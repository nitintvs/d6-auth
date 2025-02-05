import React, { Fragment, useEffect, useState } from 'react';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';
import { Grid, CircularProgress } from '@mui/material';
import axiosInstance from "../../configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import Backdrop from '@mui/material/Backdrop';

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      if (auth && auth.isLoading === false && auth.userData) {
        try {
          // Store the token in local storage
          localStorage.setItem("D6-access-token", auth.userData.access_token);
          console.log("Token saved to local storage:", auth.userData);

          const userInfoResponse = await axiosInstance.post(
            APIRouteConstants.AUTH.D6_SIGNING,
            { access_token: auth.userData.access_token }
          );

          if (userInfoResponse && userInfoResponse.status === 200) {
            localStorage.setItem("u-access-token", userInfoResponse?.data?.access);
            localStorage.setItem("u-refresh-token", userInfoResponse?.data?.refresh);
            localStorage.setItem("d6_user_data", userInfoResponse?.data?.mobile_number_exist);

            setLoading(false); // Set loading to false before redirecting
            window.location.href = "/products"; // Redirect to the home page
          } else {
            console.error("Failed to fetch user information");
            setLoading(false); // Stop loading if there's an issue
          }
        } catch (error) {
          console.error("Error during authentication process:", error);
          setLoading(false); // Stop loading on error
          navigate("/login"); // Redirect to login if an error occurs
        }
      } else if (auth?.isLoading === false) {
        console.error("Authentication failed");
        setLoading(false); // Stop loading when auth fails
        navigate("/login"); // Redirect to login if auth fails
      }
    };

    authenticateUser();
  }, [auth, navigate]);

  // Show the loader until the page transitions
  return (
    <Fragment>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {(auth?.isLoading || loading) && <CircularProgress color="secondary"/>}
      </Grid>
    </Fragment>
  );
};

function Loader() {
  return (
    <Backdrop
      sx={{ color: "#ccc", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress sx={{color:"blueviolet"}} />
    </Backdrop>
  );
}

export default CallbackPage;