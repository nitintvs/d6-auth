import { WebStorageStateStore } from "oidc-react";

export const oidcConfig = {
    authority: "https://id.zipalong.tech", // The authority URL (Issuer)
    clientId: "webbieshop-wt", // Your client ID
    redirectUri: "https://multid6auth.vercel.app/login/callback", // Redirect URI after authentication
    responseType: "code", // Use Authorization Code flow
    scope: "openid profile", // Requested scopes
    silent_redirect_uri: "https://multid6auth.vercel.app/silent-renew",
    post_logout_redirect_uri: "https://multid6auth.vercel.app",
    response_mode: "query",
    automaticSilentRenew: true,
    loadUserInfo: false,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    pkce: true,
    clockSkew: 300,
    staleStateAge: 3600,
    monitorSession: true,
    silentRequestTimeout: 10000,
    checkSessionIntervalInSeconds: 30,
    accessTokenExpiringNotificationTimeInSeconds: 60,
    includeIdTokenInSilentRenew: true,
    mergeClaims: true, // Merge claims from multiple sources
    storeAuthStateInCookie: true, // Store auth state in cookie for better persistence
    revokeTokensOnSignout: false, // Don't revoke tokens on signout to maintain D6 session
};