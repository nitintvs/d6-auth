import { UserManager } from 'oidc-client-ts';

// Helper to detect if running on mobile
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const oidcConfig = {
    authority: "https://id.zipalong.tech/connect/authorize",  // Added /connect/authorize
    client_id: "webbieshop-wt",
    redirect_uri: "https://multid6auth.vercel.app/login/callback",
    response_type: "code",
    scope: "openid profile",
    silent_redirect_uri: "https://multid6auth.vercel.app/login/callback",
    post_logout_redirect_uri: "https://multid6auth.vercel.app/login",
    response_mode: "query",
    automaticSilentRenew: false,
    loadUserInfo: true,
    monitorSession: false,
    prompt: "consent",
    metadata: {
        issuer: "https://id.zipalong.tech",
        authorization_endpoint: "https://id.zipalong.tech/connect/authorize",
        token_endpoint: "https://id.zipalong.tech/connect/token",
        userinfo_endpoint: "https://id.zipalong.tech/connect/userinfo",
        end_session_endpoint: "https://id.zipalong.tech/connect/endsession"
    },
    extraQueryParams: {
        display: isMobileDevice() ? 'touch' : 'page',
        max_age: 0
    }
};

// Create UserManager instance
export const createUserManager = (config = oidcConfig) => {
    // Ensure required fields are present
    const finalConfig = {
        ...config,
        client_id: config.client_id || "webbieshop-wt",
        redirect_uri: config.redirect_uri || "https://multid6auth.vercel.app/login/callback",
        response_type: config.response_type || "code",
        scope: config.scope || "openid profile"
    };

    console.log('Creating UserManager with config:', finalConfig);

    const manager = new UserManager(finalConfig);

    // Handle storage events
    manager.events.addUserLoaded((user) => {
        console.log("User loaded", user);
    });

    manager.events.addSilentRenewError((error) => {
        console.error("Silent renew error", error);
    });

    manager.events.addUserSignedOut(() => {
        console.log("User signed out");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
    });

    return manager;
};