import React, { Fragment, useEffect, useState } from 'react';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';
import { Grid, CircularProgress } from '@mui/material';
import axiosInstance from "../../configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import Backdrop from '@mui/material/Backdrop';

// Memory storage for incognito mode
const memoryStorage = new Map();

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

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

  const setStorageItem = async (key, value) => {
    const isIncognito = await detectIncognito();
    if (isIncognito) {
      memoryStorage.set(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  };

  useEffect(() => {
    const authenticateUser = async () => {
      if (auth?.error === 'login_required') {
        console.log('Login required, redirecting to login page...');
        navigate('/login');
        return;
      }

      if (auth && auth.isLoading === false && auth.userData) {
        try {
          await setStorageItem("D6-access-token", auth.userData.access_token);
          console.log("Token saved:", auth.userData);

          const userInfoResponse = await axiosInstance.post(
            APIRouteConstants.AUTH.D6_SIGNING,
            { access_token: auth.userData.access_token }
          );

          if (userInfoResponse && userInfoResponse.status === 200) {
            await setStorageItem("u-access-token", userInfoResponse?.data?.access);
            await setStorageItem("u-refresh-token", userInfoResponse?.data?.refresh);
            await setStorageItem("d6_user_data", userInfoResponse?.data?.mobile_number_exist);

            setLoading(false);
            window.location.href = "/products";
          } else {
            console.error("Failed to fetch user information");
            setLoading(false);
            navigate("/login");
          }
        } catch (error) {
          console.error("Error during authentication process:", error);
          setLoading(false);
          navigate("/login");
        }
      } else if (auth?.isLoading === false) {
        console.error("Authentication failed");
        setLoading(false);
        navigate("/login");
      }
    };

    authenticateUser();
  }, [auth, navigate]);

  return (
    <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CallbackPage;