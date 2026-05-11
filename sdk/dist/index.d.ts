interface OAuthClientConfig {
    clientId: string;
    redirectUri: string;
    scopes?: string[];
    apiUrl?: string;
}
interface TokenSet {
    accessToken: string;
    refreshToken?: string;
    idToken?: string;
    expiresIn: number;
    scope: string;
    tokenType: "Bearer";
}
interface UserInfo {
    sub: string;
    handle?: string;
    display_name?: string;
    avatar_url?: string;
    verified_human?: boolean;
    verification_level?: "orb" | "device";
    email?: string;
    email_verified?: boolean;
}
declare function generatePkcePair(): Promise<{
    verifier: string;
    challenge: string;
}>;
/**
 * Browser entry point.
 * Generates PKCE + state, stores them in sessionStorage, and redirects to the authorize endpoint.
 * After the user signs in and consents, they are redirected back to redirectUri with ?code=&state=.
 */
declare function signIn(config: OAuthClientConfig & {
    state?: string;
}): Promise<void>;
interface CallbackResult {
    tokens: TokenSet;
    state: string;
    scopes: string[];
}
/**
 * Browser entry point. Handles ?code=&state= query on the redirectUri page.
 * Exchanges code for tokens and returns them. Throws on error.
 */
declare function handleCallback(opts: {
    clientId: string;
    apiUrl?: string;
}): Promise<CallbackResult>;
interface ExchangeParams {
    clientId: string;
    code: string;
    codeVerifier: string;
    redirectUri: string;
    clientSecret?: string;
    apiUrl?: string;
}
declare function exchangeCodeForTokens(params: ExchangeParams): Promise<TokenSet>;
interface RefreshParams {
    clientId: string;
    refreshToken: string;
    clientSecret?: string;
    apiUrl?: string;
}
declare function refreshAccessToken(params: RefreshParams): Promise<TokenSet>;
declare function getUserInfo(opts: {
    accessToken: string;
    apiUrl?: string;
}): Promise<UserInfo>;
/**
 * Convenience getter — same as getUserInfo() but accepts a TokenSet.
 */
declare function getUser(tokens: TokenSet, apiUrl?: string): Promise<UserInfo>;
interface AutoRefreshController {
    /** Stop the auto-refresh timer. Safe to call multiple times. */
    stop(): void;
}
interface AutoRefreshParams {
    clientId: string;
    initialTokens: TokenSet;
    onUpdate: (next: TokenSet) => void;
    onError?: (err: Error) => void;
    /**
     * Seconds before expiry to trigger refresh. Default: 60.
     * Must be < initialTokens.expiresIn or the first refresh fires immediately.
     */
    refreshLeewaySec?: number;
    clientSecret?: string;
    apiUrl?: string;
}
/**
 * Start a timer that calls refreshAccessToken() shortly before each access
 * token expires. Reschedules itself after every successful refresh.
 *
 * Requires `initialTokens.refreshToken`. Throws synchronously if absent.
 *
 * The caller is responsible for persisting the updated TokenSet via onUpdate,
 * and for calling controller.stop() when the session ends (sign-out, route
 * unmount, etc).
 *
 * Example:
 *   const ctrl = startAutoRefresh({
 *     clientId,
 *     initialTokens: tokens,
 *     onUpdate: (next) => setTokens(next),
 *     onError: (err) => console.warn("refresh failed", err),
 *   });
 *   // later
 *   ctrl.stop();
 */
declare function startAutoRefresh(params: AutoRefreshParams): AutoRefreshController;
interface SilentRenewParams {
    clientId: string;
    /**
     * URL to load inside the silent iframe. This page MUST call
     * handleSilentCallback() to relay the result back to the parent window.
     * Often the same as the regular signIn redirectUri (the page can detect
     * iframe context via window.parent !== window).
     */
    redirectUri: string;
    scopes?: string[];
    apiUrl?: string;
    /** Max wait in ms before rejecting. Default: 10000. */
    timeoutMs?: number;
}
/**
 * Silent renewal flow:
 *   1. Create a hidden <iframe> pointing at /api/oauth/authorize with prompt=none
 *   2. The IdP either redirects to redirectUri with ?code=&state= (SSO active)
 *      or returns ?error=login_required (SSO expired)
 *   3. The page at redirectUri calls handleSilentCallback() which postMessages
 *      the TokenSet (or error) back to the parent
 *   4. We resolve / reject with that result and remove the iframe
 *
 * Requires the user to be signed in to the Humad SSO session (cookie).
 * If not, rejects with "login_required" — the caller should fall back to
 * the interactive signIn() flow.
 */
declare function silentRenew(params: SilentRenewParams): Promise<CallbackResult>;
/**
 * Call this from the redirect page when it detects it's loaded inside a
 * silent renew iframe (e.g. window.parent !== window).
 * Exchanges the code for tokens and postMessages the result to the parent.
 *
 * The parent's silentRenew() promise resolves with this result.
 *
 * Returns true if this was a silent callback (handled), false otherwise
 * (the page should run its normal handleCallback() logic).
 */
declare function handleSilentCallback(opts: {
    clientId: string;
    apiUrl?: string;
}): Promise<boolean>;
interface SignOutParams {
    /**
     * Token to revoke. Required when mode is "revoke" (default).
     * Not required when mode is "navigate".
     */
    token?: string;
    tokenTypeHint?: "access_token" | "refresh_token";
    clientId: string;
    clientSecret?: string;
    apiUrl?: string;
    /**
     * "revoke" (default): call /api/oauth/revoke to invalidate the token.
     *   Quiet, server-friendly, no browser navigation.
     * "navigate": redirect the browser to /api/oauth/end-session for
     *   OIDC RP-Initiated Logout. Also ends the user's Humad SSO session.
     *   Requires a browser; throws if window is not available.
     */
    mode?: "revoke" | "navigate";
    /**
     * OIDC RP-Initiated Logout parameters (used only when mode="navigate").
     * id_token issued earlier — helps the IdP identify the user / RP.
     */
    idTokenHint?: string;
    /**
     * Where the IdP should send the browser after logout.
     * MUST be pre-registered on the client's post_logout_redirect_uris.
     */
    postLogoutRedirectUri?: string;
    /**
     * Opaque value echoed back as ?state= on post_logout_redirect_uri.
     */
    state?: string;
}
declare function signOut(params: SignOutParams): Promise<void>;
interface EndSessionUrlParams {
    apiUrl?: string;
    clientId?: string;
    idTokenHint?: string;
    postLogoutRedirectUri?: string;
    state?: string;
}
/**
 * Build the OIDC RP-Initiated Logout URL without performing navigation.
 * Useful when the caller wants to attach the URL to a link or perform
 * the redirect via a framework router.
 */
declare function buildEndSessionUrl(params: EndSessionUrlParams): string;

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

export { type AutoRefreshController, type AutoRefreshParams, type CallbackResult, type EndSessionUrlParams, type ExchangeParams, HumanAuthClient, type OAuthClientConfig, type RefreshParams, type RpContextResult, type SignOutParams, type SilentRenewParams, type TokenSet, type UserInfo, type VerifyParams, type VerifyResult, buildEndSessionUrl, exchangeCodeForTokens, generatePkcePair, getRpContext, getUser, getUserInfo, handleCallback, handleSilentCallback, refreshAccessToken, signIn, signOut, silentRenew, startAutoRefresh, verify };
