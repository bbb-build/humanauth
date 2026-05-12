// メールアドレス入力のサーバ側バリデーション。
//
// 自己申告 (email_verified=false) を受け付ける入口なので、検証の厳密さよりも
// 「明らかに壊れた値」「ストレージを破壊しかねない長さ」を弾くことが目的。
// RFC 5321 はローカル部 64 / ドメイン部 255 / 全体 254 を上限とする。

const MAX_LENGTH = 254;
// RFC からはかなり緩めた実用的なパターン: ローカル@ドメイン.tld を 1 回マッチ。
// 国際化ドメイン (IDN) の puny 変換は呼び出し側が必要なら実施する。
const PATTERN = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

export interface EmailValidationResult {
  ok: boolean;
  // 失敗時のみ message
  message?: string;
  // 成功時は正規化済み値 (trim + lowercase したアドレス)
  normalized?: string;
}

export function validateEmail(input: unknown): EmailValidationResult {
  if (typeof input !== "string") {
    return { ok: false, message: "email must be a string" };
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, message: "email is empty" };
  }
  if (trimmed.length > MAX_LENGTH) {
    return { ok: false, message: `email exceeds ${MAX_LENGTH} characters` };
  }
  if (!PATTERN.test(trimmed)) {
    return { ok: false, message: "email format is invalid" };
  }
  return { ok: true, normalized: trimmed.toLowerCase() };
}
