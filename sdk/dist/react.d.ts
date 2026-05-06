import * as react_jsx_runtime from 'react/jsx-runtime';

interface HumanAuthProps {
    appId: string;
    apiKey: string;
    action?: string;
    apiUrl?: string;
    verificationLevel?: "orb" | "device" | "phone";
    onVerified: (result: VerifyResult) => void;
    onError?: (error: Error) => void;
    children?: React.ReactNode;
    className?: string;
}
interface VerifyResult {
    success: boolean;
    nullifier_hash: string;
    is_new_user: boolean;
    action: string;
}
interface RpContext {
    rp_id: string;
    nonce: string;
    created_at: number;
    expires_at: number;
    signature: string;
}
/**
 * HumanAuth drop-in React component.
 *
 * Handles the full World ID verification flow:
 * 1. Fetch RP context from HumanAuth
 * 2. Open World ID widget (IDKit or redirect)
 * 3. Send proof to HumanAuth for verification
 * 4. Return result to your app
 *
 * Requires @worldcoin/idkit as a peer dependency.
 */
declare function HumanAuth({ appId, apiKey, action, apiUrl, verificationLevel, onVerified, onError, children, className, }: HumanAuthProps): react_jsx_runtime.JSX.Element;
/**
 * Server-side verification helper.
 * Call this from your API route to verify a World ID proof via HumanAuth.
 */
declare function verifyWithHumanAuth(params: {
    apiKey: string;
    proof: string;
    merkle_root: string;
    nullifier_hash: string;
    action?: string;
    verification_level?: string;
    apiUrl?: string;
}): Promise<VerifyResult>;

export { HumanAuth, type HumanAuthProps, type RpContext, type VerifyResult, verifyWithHumanAuth };
