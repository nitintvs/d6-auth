import React, { Fragment, useEffect } from 'react';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { Typography } from '@mui/material';
import axiosInstance from "../../configs/axiosConfig"
import { APIRouteConstants } from 'constants/routeConstants';

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  console.log("auth", auth);

  useEffect(async() => {
    if (
      auth &&
      auth.isLoading===false &&
      auth.userData 
    ) {
      // Store the token in local storage
      localStorage.setItem("D6-access-token", auth.userData.access_token);
      console.log("Token saved to local storage:", auth.userData);
      
      const userInfoResponse = await axiosInstance.post(
        APIRouteConstants.AUTH.D6_SIGNING,
        { access_token: auth.userData.access_token } // Include access_token in the request body
      );
      if (userInfoResponse && userInfoResponse.status == 200) {
        localStorage.setItem(
          "u-access-token",
          userInfoResponse?.data?.access
        );
        localStorage.setItem(
          "u-refresh-token",
          userInfoResponse?.data?.refresh
        );
        window.location.href="/"
        // if (
        //   userInfoResponse?.data?.mobile_number_exist == false
        // ) {
        //   setHasMobile(true);
        // }
        // getUser(userInfoResponse?.data?.access)
      }
      // Navigate to a specific route
    } else {
      //     // Handle errors or redirect back to login if authentication fails
      console.error("Authentication failed");
      // navigate('/');
      // alert("Authentication failed");

    }
  }, [auth, navigate, auth?.isLoading]);
  // useEffect(() => {
  //   if (auth.isAuthenticated) {
  //     // Navigate to home after successful login
  //     navigate('/');
  //   } else {
  //     // Handle errors or redirect back to login if authentication fails
  //     console.error('Authentication failed');
  //     navigate('/');
  //   }
  // }, [auth, navigate]);

  return <Fragment>{auth.isLoading && <Loader />}</Fragment>;
};

export default CallbackPage;
