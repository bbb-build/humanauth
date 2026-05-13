-- HumanAuth L3 Phase 2: AgentBook registration timestamp.
-- 012_agents.sql may already be applied in deployed environments, so add the
-- timestamp column through a forward-only migration.

ALTER TABLE ha_agents
  ADD COLUMN IF NOT EXISTS agentbook_registered_at TIMESTAMPTZ;

COMMENT ON COLUMN ha_agents.agentbook_registered_at IS 'AgentBook registration relay transaction accepted timestamp.';
