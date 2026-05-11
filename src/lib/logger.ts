// 軽量 structured logger。
// - JSON 1行/レコードで stdout に書き出す（Vercel のログ収集にそのまま乗る）
// - error レベルは LOGS_DISCORD_WEBHOOK が設定されていれば Discord に通知
// - DSN/外部SaaSに依存しない。後で Sentry を入れる場合は emit を差し替える
//
// 使い方:
//   logger.info("token-issued", { clientId, userId });
//   logger.error("token-handler-failed", { clientId, error: err.message, stack: err.stack });

type Level = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const SERVICE = "humanauth";

function envLevel(): Level {
  const raw = (process.env.LOG_LEVEL || "").toLowerCase();
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") return raw;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function envName(): string {
  return process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
}

function commitSha(): string {
  return (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || "dev";
}

interface LogContext {
  [k: string]: unknown;
}

function emit(level: Level, msg: string, ctx?: LogContext) {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[envLevel()]) return;

  const record = {
    ts: new Date().toISOString(),
    level,
    service: SERVICE,
    env: envName(),
    sha: commitSha(),
    msg,
    ...ctx,
  };
  const line = safeStringify(record);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else if (level === "info") console.log(line);
  else console.debug(line);

  // 本番の error のみ Discord 通知。dev/preview では通知しない（騒音防止）。
  const webhook = process.env.LOGS_DISCORD_WEBHOOK;
  if (level === "error" && webhook && envName() === "production") {
    notifyDiscord(webhook, record).catch(() => {
      // 通知失敗は黙殺（無限ループ防止）
    });
  }
}

function safeStringify(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return JSON.stringify({ stringifyError: true, raw: String(v) });
  }
}

async function notifyDiscord(webhook: string, record: Record<string, unknown>) {
  // Discord メッセージは 2000 文字制限。本文は code block 内に詰める。
  const payloadStr = safeStringify(record);
  const truncated = payloadStr.length > 1500 ? `${payloadStr.slice(0, 1500)}…` : payloadStr;
  const content =
    `🔥 \`${record.service}\`/\`${record.env}\` **${record.msg}**\n` +
    "```json\n" +
    truncated +
    "\n```";
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
    // Edge runtime でも fetch は動く
  });
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => emit("debug", msg, ctx),
  info: (msg: string, ctx?: LogContext) => emit("info", msg, ctx),
  warn: (msg: string, ctx?: LogContext) => emit("warn", msg, ctx),
  error: (msg: string, ctx?: LogContext) => emit("error", msg, ctx),
};

// エラー値を安全にシリアライズするヘルパ。
export function errCtx(e: unknown): { error: string; stack?: string } {
  if (e instanceof Error) {
    return { error: e.message, stack: e.stack };
  }
  return { error: String(e) };
}
