const oidcConfig = {
    authority: "https://id.zipalong.tech/connect/authorize",
    client_id: "webbieshop-wt",                     
    redirect_uri:"https://d6auth.vercel.app/login/callback",
    silent_redirect_uri: "https://d6auth.vercel.app/login/callback",
    post_logout_redirect_uri: "https://d6auth.vercel.app/login",
    response_type: "code",
    scope: "openid profile",
    automaticSilentRenew: true,
    loadUserInfo: true 
  };
  
  export default oidcConfig;
  