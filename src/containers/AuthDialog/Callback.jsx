import React, { Fragment, useEffect, useState } from 'react';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Modal, Typography } from '@mui/material';
import axiosInstance from "../../configs/axiosConfig"
import { APIRouteConstants } from 'constants/routeConstants';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
const CallbackPage = () => {
  const [hasMobile, setHasMobile] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  console.log("auth", auth);

  useEffect(async () => {
    if (auth && auth.isLoading === false && auth.userData) {
      // Store the token in local storage
      localStorage.setItem("D6-access-token", auth.userData.access_token);
      console.log("Token saved to local storage:", auth.userData);

      const userInfoResponse = await axiosInstance.post(
        APIRouteConstants.AUTH.D6_SIGNING,
        { access_token: auth.userData.access_token } // Include access_token in the request body
      );
      if (userInfoResponse && userInfoResponse.status == 200) {
        localStorage.setItem("u-access-token", userInfoResponse?.data?.access);
        localStorage.setItem(
          "u-refresh-token",
          userInfoResponse?.data?.refresh
        );
        localStorage.setItem("d6_user_data", userInfoResponse?.data);
        window.location.href = "/";
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
  
  return (
    <Fragment>
      <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      {auth?.isLoading && <CircularProgress color="secondary" size={34}/> }  
      </Grid>
    </Fragment>
  );
};



export default CallbackPage;
