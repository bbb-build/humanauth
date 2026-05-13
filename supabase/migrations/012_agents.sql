-- HumanAuth L3 Phase 1: custodial agent wallet storage
--
-- AgentBookへのオンチェーン登録はPhase 2で扱う。ここでは、HumanAuthが
-- agent秘密鍵を既存AES-GCM暗号化境界 (lib/crypto.ts encryptWithActiveKey)
-- でcustodial管理し、SIWE署名に使える最小DB基盤だけを敷設する。

CREATE TABLE IF NOT EXISTS ha_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  -- EIP-55 checksum形式のEthereum address
  address TEXT NOT NULL UNIQUE CHECK (address ~ '^0x[0-9a-fA-F]{40}$'),
  -- lib/crypto.ts encryptWithActiveKey: v<N>:<base64>
  encrypted_private_key TEXT NOT NULL CHECK (encrypted_private_key ~ '^v[0-9]+:[A-Za-z0-9+/]+={0,2}$'),
  agentbook_tx_hash TEXT,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ha_agents_user ON ha_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_ha_agents_address ON ha_agents(address);

-- 既存コードはSupabase service role経由で個人データへアクセスする。
-- RLSを有効化し、anon/authenticated clientからの直接アクセスはpolicy未定義で拒否する。
ALTER TABLE ha_agents ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ha_agents IS 'HumanAuth L3 custodial agent wallets. Private keys are encrypted with lib/crypto.ts active key.';
COMMENT ON COLUMN ha_agents.agentbook_tx_hash IS 'Phase 2でAgentBookオンチェーン登録後に更新するtransaction hash。';
