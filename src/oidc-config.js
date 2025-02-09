// const oidcConfig = {
//     authority: "https://id.zipalong.tech/connect/authorize",
//     client_id: "webbieshop-wt",                     
//     redirect_uri:"http://localhost:3000/login/callback",
//     silent_redirect_uri: "https://d6auth.vercel.app/login/callback",
//     post_logout_redirect_uri: "https://d6auth.vercel.app/login",
//     response_type: "code",
//     scope: "openid profile",
//     response_mode: "fragment",
//     automaticSilentRenew: true,
//     loadUserInfo: true ,
//     pkce:true
//   };

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
    // Using cookies for storage
    stateStore: {
        set: (key, value) => {
            document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
            return Promise.resolve();
        },
        get: (key) => {
            const value = document.cookie.split('; ')
                .find(row => row.startsWith(key))
                ?.split('=')[1];
            return Promise.resolve(value);
        },
        remove: (key) => {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            return Promise.resolve();
        }
    }
};
  
  // https://multid6auth.vercel.app/