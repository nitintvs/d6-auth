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
        localStorage.setItem("d6_user_data", userInfoResponse?.data?.mobile_number_exist == true);
        window.location.href = "/";
        // if (userInfoResponse?.data?.mobile_number_exist == true) {
        //   setHasMobile(true);
        // }else{
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
  
  return (
    <Fragment>
      <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      {auth?.isLoading && <CircularProgress color="secondary" size={34}/> }  
      </Grid>
    </Fragment>
  );
};



function Loader({
    open,
    setOpen
}) {

  return (
        <Backdrop
            sx={{ color: '#ccc', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            // onClick={setO}
        >
            <CircularProgress sx={{color:"red"}} />
        </Backdrop>
  );
}


const D6Modal = ({ isDialogOpen, setDialogOpen1 }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+1"); // Default country code
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!mobileNumber) {
      setError("Mobile number is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://api.example.com/update-mobile", {
        countryCode,
        mobileNumber,
      });
      console.log("API Response:", response.data);

      // Navigate or take further actions on success
      navigate("/");
    } catch (error) {
      console.error("Error updating mobile number:", error);
      setError("Failed to update the mobile number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen1(false);
  };

  return (
    <>
      <Modal open={isDialogOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "75%", md: "50%", lg: "40%" },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          {/* Header Section */}
          <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="h6" textAlign="center" sx={{ width: "100%" }}>
              Please update your mobile number (mandatory)
            </Typography>
          </Grid>

          {/* Modal Content */}
          <Grid container direction="column" alignItems="center">
            {/* Country Code Dropdown and Mobile Number Input */}
            <Grid item xs={12} sx={{ width: "100%", mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    select
                    fullWidth
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    label="Country Code"
                  >
                    {/* Add more country codes as needed */}
                    <MenuItem value="+1">+1 (USA)</MenuItem>
                    <MenuItem value="+91">+91 (India)</MenuItem>
                    <MenuItem value="+44">+44 (UK)</MenuItem>
                    <MenuItem value="+61">+61 (Australia)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    label="Mobile Number"
                    type="tel"
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ width: "100%", mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdate}
                sx={{ textTransform: "none" }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Update Mobile Number"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};



export default CallbackPage;
