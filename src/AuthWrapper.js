import { useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { useNavigate } from "react-router-dom";
import { APIRouteConstants } from "constants/routeConstants";

import axiosInstance from "configs/axiosConfig";
const AuthWrapper = ({ children }) => {
  const auth = useAuth();
  const [lastD6Token, setLastD6Token] = useState(null);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (auth && auth.isLoading === false && auth.userData) {
        const newD6Token = auth.userData.access_token;

        // ✅ Only proceed if the D6 token has changed
        if (newD6Token && newD6Token !== lastD6Token) {
          setLastD6Token(newD6Token); // Update state to track last token

          try {
            console.log("New D6 Token detected, fetching new access/refresh tokens...");

            // Store the D6 token in local storage
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

              console.log("Updated user tokens successfully!");
            } else {
              console.error("Failed to fetch user information");
            }
          } catch (error) {
            console.error("Error during authentication process:", error);
            // navigate("/login");
          }
        }
      } 
    };

    handleTokenRefresh();
  }, [auth, navigate]);

  return children;
};

export default AuthWrapper;
