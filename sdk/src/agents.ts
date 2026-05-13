const DEFAULT_API_URL = "https://humanauth.vercel.app";

export interface AgentRegistrationStart {
  agent_address: string;
  nonce: string;
  verification_url: string;
  qr_data: string;
  action: string;
  signal: string;
  world_app_id: string;
}

export interface AgentRegistrationProof {
  root: string;
  nullifierHash: string;
  proof: string[];
}

export interface AgentRegistrationFinalized {
  agent_address: string;
  agentbook_tx_hash: string;
  agentbook_registered_at: string;
}

export interface AgentSummary {
  address: string;
  agentbook_tx_hash: string | null;
  agentbook_registered_at: string | null;
  scopes: string[];
  created_at: string;
  revoked_at: string | null;
  last_used_at: string | null;
}

export class HumadAgentClient {
  private accessToken: string;
  private apiUrl: string;

  constructor(params: { accessToken: string; apiUrl?: string }) {
    this.accessToken = params.accessToken;
    this.apiUrl = (params.apiUrl || DEFAULT_API_URL).replace(/\/+$/, "");
  }

  async startAgentRegistration(): Promise<AgentRegistrationStart> {
    return this.request<AgentRegistrationStart>("/api/v1/agents", {
      method: "POST",
    });
  }

  async finalizeAgentRegistration(
    address: string,
    proof: AgentRegistrationProof,
  ): Promise<AgentRegistrationFinalized> {
    return this.request<AgentRegistrationFinalized>(
      `/api/v1/agents/${encodeURIComponent(address)}/finalize`,
      {
        method: "POST",
        body: JSON.stringify(proof),
      },
    );
  }

  async listAgents(): Promise<AgentSummary[]> {
    const data = await this.request<{ agents: AgentSummary[] }>("/api/v1/agents", {
      method: "GET",
    });
    return data.agents;
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const res = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        ...init.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      const message =
        typeof error.error === "string"
          ? error.error
          : typeof error.message === "string"
            ? error.message
            : "Humad agent API request failed";
      throw new Error(message);
    }

    return res.json();
  }
}
