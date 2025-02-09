// Function to detect incognito mode
const detectIncognito = async () => {
    try {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        return new Promise((resolve) => {
            if (!fs) {
                resolve(false);
                return;
            }
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
        });
    } catch {
        return false;
    }
};

// In-memory storage for incognito mode
const memoryStorage = new Map();

import { WebStorageStateStore } from "oidc-client-ts";

//   export default oidcConfig;
// export const oidcConfig = {
  //     authority: "https://id.zipalong.tech", // The authority URL (Issuer)
//     clientId: "webbieshop-wt", // Your client ID
//     // redirectUri: "https://oauthdebugger.com/debug", // Redirect URI after authentication
//     redirectUri: "https://d6auth.vercel.app/login/callback", // Redirect URI after authentication
//     responseType: "code", // Use Authorization Code flow
//     scope: "openid profile", // Requested scopes
//     silent_redirect_uri: "https://d6auth.vercel.app/login/callback",
//     post_logout_redirect_uri: "https://d6auth.vercel.app/login",
//     response_mode: "fragment",
//     automaticSilentRenew: true, // Silent token renewal
//     loadUserInfo: false, // Load additional user info from the userinfo endpoint
//   };

// export const oidcConfig = {
//     authority: "https://id.zipalong.tech", // The authority URL (Issuer)
//     clientId: "webbieshop-wt", // Your client ID
//     // redirectUri: "https://oauthdebugger.com/debug", // Redirect URI after authentication
//     redirectUri: "https://d6auth.vercel.app/login/callback", // Redirect URI after authentication
//     responseType: "code", // Use Authorization Code flow
//     scope: "openid profile", // Requested scopes
//     silent_redirect_uri: "https://d6auth.vercel.app/login/callback",
//     post_logout_redirect_uri: "https://d6auth.vercel.app/login",
//     response_mode: "fragment",
//     automaticSilentRenew: true, // Silent token renewal
//     loadUserInfo: false, // Load additional user info from the userinfo endpoint
//   };
export const oidcConfig = {
    authority: "https://id.zipalong.tech",
    clientId: "webbieshop-wt",
    redirectUri: "https://multid6auth.vercel.app/login/callback",
    responseType: "code",
    scope: "openid profile",
    silent_redirect_uri: "https://multid6auth.vercel.app/login/callback",
    post_logout_redirect_uri: "https://multid6auth.vercel.app/login",
    response_mode: "fragment",
    automaticSilentRenew: true,
    loadUserInfo: false,
    monitorSession: true,
    prompt: "login",  // Force login prompt
    clockSkew: 300,   // 5 minutes clock skew for token validation
    stateStore: {
        set: async (key, value) => {
            const isIncognito = await detectIncognito();
            if (isIncognito) {
                memoryStorage.set(key, value);
            } else {
                localStorage.setItem(key, value);
            }
            return Promise.resolve();
        },
        get: async (key) => {
            const isIncognito = await detectIncognito();
            if (isIncognito) {
                return Promise.resolve(memoryStorage.get(key));
            }
            return Promise.resolve(localStorage.getItem(key));
        },
        remove: async (key) => {
            const isIncognito = await detectIncognito();
            if (isIncognito) {
                memoryStorage.delete(key);
            } else {
                localStorage.removeItem(key);
            }
            return Promise.resolve();
        }
    }
};
  
  // https://multid6auth.vercel.app/