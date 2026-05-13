import * as react_jsx_runtime from 'react/jsx-runtime';

interface AgentRegistrationProof {
    root: string;
    nullifierHash: string;
    proof: string[];
}
interface AgentRegistrationFinalized {
    agent_address: string;
    agentbook_tx_hash: string;
    agentbook_registered_at: string;
}

interface HumanAuthProps {
    appId: string;
    /** @deprecated Use widget flow (appId only) instead. API keys should only be used server-side. */
    apiKey?: string;
    action?: string;
    apiUrl?: string;
    verificationLevel?: "orb" | "device" | "phone";
    onVerified: (result: VerifyResult) => void;
    onError?: (error: Error) => void;
    children?: React.ReactNode;
    className?: string;
}
interface AuthorizeAgentProps {
    accessToken: string;
    apiUrl?: string;
    pendingProof?: AgentRegistrationProof;
    onAuthorized: (result: AgentRegistrationFinalized) => void;
    onError?: (err: Error) => void;
    /** Optional label displayed above the QR code. */
    label?: string;
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
 * Preferred: pass only `appId` (widget flow with Origin-based auth).
 * Server-side: use `verifyWithHumanAuth()` with apiKey instead.
 */
declare function HumanAuth({ appId, apiKey, action, apiUrl, verificationLevel, onVerified, onError, children, className, }: HumanAuthProps): react_jsx_runtime.JSX.Element;
declare function AuthorizeAgent({ accessToken, apiUrl, pendingProof, onAuthorized, onError, label, className, }: AuthorizeAgentProps): react_jsx_runtime.JSX.Element;
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

export { AuthorizeAgent, type AuthorizeAgentProps, HumanAuth, type HumanAuthProps, type RpContext, type VerifyResult, verifyWithHumanAuth };
