const DEFAULT_API_URL = "https://humanauth.vercel.app";

export interface VerifyParams {
  apiKey: string;
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  action?: string;
  verification_level?: string;
  apiUrl?: string;
}

export interface VerifyResult {
  success: boolean;
  nullifier_hash: string;
  is_new_user: boolean;
  action: string;
}

export interface RpContextResult {
  rp_context: {
    rp_id: string;
    nonce: string;
    created_at: number;
    expires_at: number;
    signature: string;
  };
}

export class HumanAuthClient {
  private apiKey: string;
  private apiUrl: string;

  constructor(params: { apiKey: string; apiUrl?: string }) {
    this.apiKey = params.apiKey;
    this.apiUrl = params.apiUrl || DEFAULT_API_URL;
  }

  async verify(params: Omit<VerifyParams, "apiKey" | "apiUrl">): Promise<VerifyResult> {
    const res = await fetch(`${this.apiUrl}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-humanauth-key": this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "Verification failed");
    }

    return res.json();
  }

  async getRpContext(action?: string): Promise<RpContextResult> {
    const res = await fetch(`${this.apiUrl}/api/rp-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-humanauth-key": this.apiKey,
      },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      throw new Error("Failed to get RP context");
    }

    return res.json();
  }
}

export async function verify(params: VerifyParams): Promise<VerifyResult> {
  const client = new HumanAuthClient({
    apiKey: params.apiKey,
    apiUrl: params.apiUrl,
  });
  return client.verify(params);
}

export async function getRpContext(params: {
  apiKey: string;
  action?: string;
  apiUrl?: string;
}): Promise<RpContextResult> {
  const client = new HumanAuthClient({
    apiKey: params.apiKey,
    apiUrl: params.apiUrl,
  });
  return client.getRpContext(params.action);
}
