import React, { Fragment, useEffect } from 'react';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { Typography } from '@mui/material';

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  console.log("auth", auth);

  useEffect(() => {
    if (
      auth &&
      auth.isLoading===false &&
      auth.userData 
    ) {
      // Store the token in local storage
      localStorage.setItem("u-access-token", auth.userData.access_token);
      console.log("Token saved to local storage:", auth.userData.access_token);

      navigate("/");
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
