interface VerifyParams {
    apiKey: string;
    proof: string;
    merkle_root: string;
    nullifier_hash: string;
    action?: string;
    verification_level?: string;
    apiUrl?: string;
}
interface VerifyResult {
    success: boolean;
    nullifier_hash: string;
    is_new_user: boolean;
    action: string;
}
interface RpContextResult {
    rp_context: {
        rp_id: string;
        nonce: string;
        created_at: number;
        expires_at: number;
        signature: string;
    };
}
declare class HumanAuthClient {
    private apiKey;
    private apiUrl;
    constructor(params: {
        apiKey: string;
        apiUrl?: string;
    });
    verify(params: Omit<VerifyParams, "apiKey" | "apiUrl">): Promise<VerifyResult>;
    getRpContext(action?: string): Promise<RpContextResult>;
}
declare function verify(params: VerifyParams): Promise<VerifyResult>;
declare function getRpContext(params: {
    apiKey: string;
    action?: string;
    apiUrl?: string;
}): Promise<RpContextResult>;

export { HumanAuthClient, type RpContextResult, type VerifyParams, type VerifyResult, getRpContext, verify };
