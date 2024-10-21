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

//   export default oidcConfig;
export const oidcConfig = {
    authority: "https://id.zipalong.tech", // The authority URL (Issuer)
    clientId: "webbieshop-wt", // Your client ID
    // redirectUri: "https://oauthdebugger.com/debug", // Redirect URI after authentication
    redirectUri: "https://d6auth.vercel.app/login/callback", // Redirect URI after authentication
    responseType: "code", // Use Authorization Code flow
    scope: "openid profile", // Requested scopes
    silent_redirect_uri: "https://d6auth.vercel.app/login/callback",
    post_logout_redirect_uri: "https://d6auth.vercel.app/login",
    response_mode: "fragment",
    automaticSilentRenew: true, // Silent token renewal
    loadUserInfo: true, // Load additional user info from the userinfo endpoint
  };
  