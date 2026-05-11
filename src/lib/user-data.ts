// Vault データアクセスヘルパ — ha_user_data_items を扱う唯一のAPI境界
//
// このファイルが「テーブルを直接 SQL で触る箇所」の単一の出口になる。
// routes / resolvers は必ずここを経由して get / set / list / delete を行う。
//
// 暗号化 (ステップ3) でカラム形式が変わっても、ここに閉じ込めて吸収する想定。
//
// 使い方:
//   await setUserDataItem({ userId, namespace: "humad", key: "apps_used",
//     value: ["client_a", "client_b"], scopeName: "humad.apps_used:read", source: "system" });
//   const item = await getUserDataItem(userId, "humad", "apps_used");
//   const items = await listUserDataItems(userId, "humad");
//   await deleteUserDataItem(userId, "humad", "apps_used");

import { getSupabaseAdmin } from "@/lib/supabase";
import { logger, errCtx } from "@/lib/logger";

export type UserDataSource = "self" | "system" | "external_oauth" | "data_import";

export interface UserDataItem<T = unknown> {
  id: string;
  userId: string;
  namespace: string;
  key: string;
  value: T;
  encrypted: boolean;
  schemaVersion: number;
  source: UserDataSource;
  scopeName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SetUserDataItemArgs<T = unknown> {
  userId: string;
  namespace: string;
  key: string;
  value: T;
  // OIDC scope 名 (例: "humad.apps_used:read")。SCOPE_REGISTRY と一致させること
  scopeName?: string | null;
  source?: UserDataSource;
  schemaVersion?: number;
  // ステップ3 で暗号化を有効化したら true にする。今は基本 false で受ける
  encrypted?: boolean;
}

interface RawRow {
  id: string;
  user_id: string;
  namespace: string;
  key: string;
  value: unknown;
  encrypted: boolean;
  schema_version: number;
  source: UserDataSource;
  scope_name: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow<T>(row: RawRow): UserDataItem<T> {
  return {
    id: row.id,
    userId: row.user_id,
    namespace: row.namespace,
    key: row.key,
    value: row.value as T,
    encrypted: row.encrypted,
    schemaVersion: row.schema_version,
    source: row.source,
    scopeName: row.scope_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// namespace / key の基本バリデーション。ドット区切りの命名規約に沿わせる
// (例: namespace="humad" key="apps_used" → scope "humad.apps_used:read")
const NAMESPACE_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/;
const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

function assertNamespaceKey(namespace: string, key: string): void {
  if (!NAMESPACE_PATTERN.test(namespace)) {
    throw new Error(`invalid namespace: ${namespace} (expected dot-separated lowercase tokens)`);
  }
  if (!KEY_PATTERN.test(key)) {
    throw new Error(`invalid key: ${key} (expected lowercase snake_case)`);
  }
}

export async function getUserDataItem<T = unknown>(
  userId: string,
  namespace: string,
  key: string,
): Promise<UserDataItem<T> | null> {
  assertNamespaceKey(namespace, key);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_user_data_items")
    .select("*")
    .eq("user_id", userId)
    .eq("namespace", namespace)
    .eq("key", key)
    .maybeSingle();
  if (error) {
    logger.warn("user-data-get-failed", { userId, namespace, key, error: error.message });
    return null;
  }
  if (!data) return null;
  return mapRow<T>(data as RawRow);
}

export async function listUserDataItems<T = unknown>(
  userId: string,
  namespace?: string,
): Promise<UserDataItem<T>[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("ha_user_data_items").select("*").eq("user_id", userId);
  if (namespace !== undefined) {
    if (!NAMESPACE_PATTERN.test(namespace)) {
      throw new Error(`invalid namespace: ${namespace}`);
    }
    query = query.eq("namespace", namespace);
  }
  const { data, error } = await query.order("namespace").order("key");
  if (error) {
    logger.warn("user-data-list-failed", { userId, namespace, error: error.message });
    return [];
  }
  return ((data ?? []) as RawRow[]).map((r) => mapRow<T>(r));
}

// upsert: (user_id, namespace, key) UNIQUE に対して値だけ差し替え。
// scope_name / source / schema_version は明示的に渡された時のみ更新（既存値を尊重）。
export async function setUserDataItem<T = unknown>(
  args: SetUserDataItemArgs<T>,
): Promise<UserDataItem<T> | null> {
  assertNamespaceKey(args.namespace, args.key);
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = {
    user_id: args.userId,
    namespace: args.namespace,
    key: args.key,
    value: args.value,
  };
  if (args.scopeName !== undefined) payload.scope_name = args.scopeName;
  if (args.source !== undefined) payload.source = args.source;
  if (args.schemaVersion !== undefined) payload.schema_version = args.schemaVersion;
  if (args.encrypted !== undefined) payload.encrypted = args.encrypted;

  const { data, error } = await supabase
    .from("ha_user_data_items")
    .upsert(payload, { onConflict: "user_id,namespace,key" })
    .select("*")
    .maybeSingle();
  if (error) {
    logger.warn("user-data-set-failed", {
      userId: args.userId,
      namespace: args.namespace,
      key: args.key,
      error: error.message,
    });
    return null;
  }
  if (!data) return null;
  return mapRow<T>(data as RawRow);
}

export async function deleteUserDataItem(
  userId: string,
  namespace: string,
  key: string,
): Promise<boolean> {
  assertNamespaceKey(namespace, key);
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("ha_user_data_items")
      .delete()
      .eq("user_id", userId)
      .eq("namespace", namespace)
      .eq("key", key);
    if (error) {
      logger.warn("user-data-delete-failed", { userId, namespace, key, error: error.message });
      return false;
    }
    return true;
  } catch (e) {
    logger.warn("user-data-delete-exception", { userId, namespace, key, ...errCtx(e) });
    return false;
  }
}
