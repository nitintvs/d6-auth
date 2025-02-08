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
    automaticSilentRenew: true, // Silent token renewal
    loadUserInfo: false, // Load additional user info from the userinfo endpoint
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    pkce: true, // Enable PKCE for better security
    clockSkew: 300, // 5 minutes clock skew for token validation
    staleStateAge: 3600, // 1 hour state age
    monitorSession: true,
    silentRequestTimeout: 10000, // 10 seconds timeout for silent requests
    checkSessionIntervalInSeconds: 30, // Check session every 30 seconds
    accessTokenExpiringNotificationTimeInSeconds: 60, // Notify 1 minute before token expires
    includeIdTokenInSilentRenew: true, // Include ID token in silent renewal
};