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

export { type CallbackResult, type EndSessionUrlParams, type ExchangeParams, HumanAuthClient, type OAuthClientConfig, type RefreshParams, type RpContextResult, type SignOutParams, type TokenSet, type UserInfo, type VerifyParams, type VerifyResult, buildEndSessionUrl, exchangeCodeForTokens, generatePkcePair, getRpContext, getUser, getUserInfo, handleCallback, refreshAccessToken, signIn, signOut, verify };
