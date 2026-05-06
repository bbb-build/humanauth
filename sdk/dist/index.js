"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HumanAuthClient: () => HumanAuthClient,
  getRpContext: () => getRpContext,
  verify: () => verify
});
module.exports = __toCommonJS(src_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HumanAuthClient,
  getRpContext,
  verify
});
