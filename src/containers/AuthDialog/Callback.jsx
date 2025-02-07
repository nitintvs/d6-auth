import React, { useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { useNavigate } from "react-router-dom";
import { Grid, CircularProgress, Backdrop } from "@mui/material";
import axiosInstance from "../../configs/axiosConfig";
import { APIRouteConstants } from "constants/routeConstants";

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isTokenExpired = (expiryTimestamp) => {
      if (!expiryTimestamp) return true; // If there's no expiry, assume it's expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return currentTimestamp >= expiryTimestamp;
    };

    const authenticateUser = async () => {
      if (!auth || auth.isLoading) return; // Wait until authentication is finished

      if (!auth.userData) {
        console.error("No user data available. Redirecting to login.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const expiryTimestamp = auth.userData.expires_at;
        
        // 🔄 If token expired, attempt silent renew before redirecting
        if (isTokenExpired(expiryTimestamp)) {
          console.warn("Token expired. Attempting silent renew...");
          if (auth.userManager) {
            try {
              const refreshedUser = await auth.userManager.signinSilent();
              if (refreshedUser) {
                console.log("Token successfully renewed.");
                localStorage.setItem("D6-access-token", refreshedUser.access_token);
              } else {
                console.warn("Silent renew failed. Redirecting to login.");
                navigate("/login");
                return;
              }
            } catch (silentError) {
              console.error("Silent renew error:", silentError);
              navigate("/login");
              return;
            }
          } else {
            console.warn("User manager not available for silent renew.");
            navigate("/login");
            return;
          }
        }

        // ✅ Store new access token in local storage
        localStorage.setItem("D6-access-token", auth.userData.access_token);

        // 🔄 Fetch user information
        const userInfoResponse = await axiosInstance.post(
          APIRouteConstants.AUTH.D6_SIGNING,
          { access_token: auth.userData.access_token }
        );

        if (userInfoResponse.status === 200) {
          // ✅ Store additional tokens and data
          localStorage.setItem("u-access-token", userInfoResponse?.data?.access);
          localStorage.setItem("u-refresh-token", userInfoResponse?.data?.refresh);
          localStorage.setItem("d6_user_data", userInfoResponse?.data?.mobile_number_exist);

          setLoading(false);
          navigate("/products"); // 🚀 Redirect to products page
        } else {
          console.error("Failed to fetch user information");
          setLoading(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during authentication process:", error);
        setLoading(false);
        navigate("/login"); // 🚀 Redirect to login on error
      }
    };

    authenticateUser();
  }, [auth, navigate]);

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {(auth?.isLoading || loading) && <CircularProgress color="secondary" />}
    </Grid>
  );
};

export default CallbackPage;
