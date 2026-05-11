import { redirect } from "next/navigation";
import { getOAuthClient, parseScopes } from "@/lib/oauth";
import { getSsoUserId } from "@/lib/sso-session";
import { getSupabaseAdmin } from "@/lib/supabase";
import ConsentClient from "./ConsentClient";

// /oauth/consent?return_to=<authorize-path>&client_id=...&scope=...
//
// サーバーで認証状態とclient情報を解決し、クライアントコンポーネントに渡す。
// オープンリダイレクト防止: return_to は /api/oauth/authorize で始まるパスのみ許可。

interface PageProps {
  searchParams: Promise<{ return_to?: string; client_id?: string; scope?: string }>;
}

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  openid: "Sign you in with Humad",
  profile: "View your handle and display name",
  verified_human: "Confirm you are a verified human (no personal data)",
  email: "View your email address (only if you have one set)",
};

export default async function ConsentPage({ searchParams }: PageProps) {
  const { return_to, client_id, scope } = await searchParams;

  if (!return_to || !return_to.startsWith("/api/oauth/authorize")) {
    return <ErrorScreen message="Invalid return_to" />;
  }
  if (!client_id) return <ErrorScreen message="Missing client_id" />;
  if (!scope) return <ErrorScreen message="Missing scope" />;

  // 未ログイン → signinへ
  const userId = await getSsoUserId();
  if (!userId) {
    const signinUrl = `/oauth/signin?return_to=${encodeURIComponent(return_to)}`;
    redirect(signinUrl);
  }

  const client = await getOAuthClient(client_id);
  if (!client) return <ErrorScreen message="Unknown client" />;

  const scopes = parseScopes(scope);
  if (scopes.length === 0) return <ErrorScreen message="Invalid scope" />;

  // ユーザー情報取得（handle表示用）
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("ha_users")
    .select("handle, display_name")
    .eq("id", userId)
    .single();

  const scopeRows = scopes.map((s) => ({
    scope: s,
    description: SCOPE_DESCRIPTIONS[s] || s,
  }));

  return (
    <ConsentClient
      clientName={client.name as string}
      clientId={client_id}
      scope={scope}
      scopes={scopeRows}
      returnTo={return_to}
      userHandle={(user?.handle as string | undefined) || ""}
      userDisplayName={(user?.display_name as string | undefined) || ""}
    />
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "#0a0a0f", color: "#ffffff" }}
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-xl font-bold" style={{ color: "#ef4444" }}>
          Error
        </h1>
        <p className="text-sm" style={{ color: "#a8b0bc" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
