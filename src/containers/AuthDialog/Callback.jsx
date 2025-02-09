import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import axiosInstance from "../../configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import { createUserManager } from '../../oidc-config';

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleCallback = async () => {
      const userManager = createUserManager();
      
      try {
        const user = await userManager.signinRedirectCallback();
        console.log("User authenticated:", user);

        if (user && user.access_token) {
          try {
            const userInfoResponse = await axiosInstance.post(
              APIRouteConstants.AUTH.D6_SIGNING,
              { access_token: user.access_token }
            );

            if (userInfoResponse?.status === 200) {
              // Try sessionStorage first, fallback to localStorage
              try {
                sessionStorage.setItem("u-access-token", userInfoResponse.data.access);
                sessionStorage.setItem("u-refresh-token", userInfoResponse.data.refresh);
                sessionStorage.setItem("d6_user_data", userInfoResponse.data.mobile_number_exist);
              } catch {
                localStorage.setItem("u-access-token", userInfoResponse.data.access);
                localStorage.setItem("u-refresh-token", userInfoResponse.data.refresh);
                localStorage.setItem("d6_user_data", userInfoResponse.data.mobile_number_exist);
              }

              window.location.href = "/products";
            } else {
              console.error("Failed to fetch user information");
              navigate("/login");
            }
          } catch (error) {
            console.error("API error:", error);
            navigate("/login");
          }
        } else {
          console.error("No access token received");
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        if (error.message?.includes('login_required')) {
          // Clear any existing tokens and redirect to login
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "/login";
        } else {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CallbackPage;