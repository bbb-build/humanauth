// src/index.ts
var DEFAULT_API_URL = "https://humanauth.vercel.app";
var HumanAuthClient = class {
  constructor(params) {
    this.apiKey = params.apiKey;
    this.apiUrl = params.apiUrl || DEFAULT_API_URL;
  }
  async verify(params) {
    const res = await fetch(`${this.apiUrl}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-humanauth-key": this.apiKey
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "Verification failed");
    }
    return res.json();
  }
  async getRpContext(action) {
    const res = await fetch(`${this.apiUrl}/api/rp-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-humanauth-key": this.apiKey
      },
      body: JSON.stringify({ action })
    });
    if (!res.ok) {
      throw new Error("Failed to get RP context");
    }
    return res.json();
  }
};
async function verify(params) {
  const client = new HumanAuthClient({
    apiKey: params.apiKey,
    apiUrl: params.apiUrl
  });
  return client.verify(params);
}
async function getRpContext(params) {
  const client = new HumanAuthClient({
    apiKey: params.apiKey,
    apiUrl: params.apiUrl
  });
  return client.getRpContext(params.action);
}
export {
  HumanAuthClient,
  getRpContext,
  verify
};
