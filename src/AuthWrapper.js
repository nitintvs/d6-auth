import { useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from "constants/routeConstants";
import { isMobile } from "react-device-detect";

const SilentRenewToken = () => {
  const auth = useAuth();
  // const navigate = useNavigate();
  const [lastD6Token, setLastD6Token] = useState(localStorage.getItem("D6-access-token"));

  useEffect(() => {
    console.log("auth",JSON.stringify(auth.userData))
    console.log("auth",JSON.stringify(auth.userManager.signinSilent()))
if(isMobile){
  sessionStorage.getItem("oidc.user:https://id.zipalong.tech:webbieshop-wt");
  localStorage.setItem("oidc.user:https://id.zipalong.tech:webbieshop-wt",auth.userData);
}else{
  sessionStorage.getItem("oidc.user:https://id.zipalong.tech:webbieshop-wt");
  localStorage.setItem("oidc.user:https://id.zipalong.tech:webbieshop-wt",auth.userData);
}

    const handleTokenRenewal = async () => {
      if (auth && auth.isLoading === false && auth.userData) {
        const newD6Token = auth.userData.access_token;

        // ✅ Only proceed if the token has changed
        if (newD6Token && newD6Token !== lastD6Token) {
          setLastD6Token(newD6Token); // Track last token

          try {
            console.log("🔄 New D6 Token detected, fetching new access/refresh tokens...");

            // Store the new D6 token in local storage
            localStorage.setItem("D6-access-token", newD6Token);

            // Call API to get the new access & refresh token
            const userInfoResponse = await axiosInstance.post(
              APIRouteConstants.AUTH.D6_SIGNING,
              { access_token: newD6Token }
            );

            if (userInfoResponse && userInfoResponse.status === 200) {
              localStorage.setItem("u-access-token", userInfoResponse?.data?.access);
              localStorage.setItem("u-refresh-token", userInfoResponse?.data?.refresh);
              localStorage.setItem("d6_user_data", userInfoResponse?.data?.mobile_number_exist);

              console.log("✅ Updated user tokens successfully!");
            } else {
              console.error("❌ Failed to fetch user information");
            }
          } catch (error) {
            console.error("❌ Error during authentication process:", error);
            // navigate("/login");
          }
        }
      } else if (auth?.isLoading === false) {
        console.error("❌ Authentication failed");
        // navigate("/login");
      }
    };

    handleTokenRenewal();
  }, [auth]);

  return null; // Since this component doesn't render anything
};

export default SilentRenewToken;
