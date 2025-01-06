import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import { Typography } from "@mui/material";
import getUser from "reducers/userReducer";

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [hasMobile, setHasMobile] = useState(false);
  console.log("mobile1", hasMobile);
  const handleCloseUpdateMObileModal = () => {
    setHasMobile(false);
  };

  console.log("auth", auth);

  useEffect(async () => {
    if (auth && auth.isLoading === false && auth.userData) {
      // Store the token in local storage
      localStorage.setItem("D6-access-token", auth.userData.access_token);
      console.log("Token saved to local storage:", auth.userData);

      if (auth.userData.access_token) {
        try {
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
              userInfoResponse?.data?.refressh
            );
            if (userInfoResponse?.data?.mobile_number_exist == false) {
              setHasMobile(true);
            }
            navigate("/");
            getUser(userInfoResponse?.data?.access);
          }
        } catch (error) {
          console.error("Error during API calls or parsing:", error);
        }
      } else {
        console.warn("No accesstokendata found in localStorage.");
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

  return <Fragment>
    {auth.isLoading && <Loader />}
    <UpdateMobileModal open={hasMobile} handleClose={handleCloseUpdateMObileModal}/>
    </Fragment>;
};

const UpdateMobileModal = ({ open, handleClose }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  console.log("mobile", open);
  const handleSubmit = async () => {
    try {
      const requestBody = {
        mobile_number: mobileNumber, // User input
        country_code: 27, // Replace with dynamic data if needed
      };

      // API call
      const response = await axiosInstance.put(
        APIRouteConstants.AUTH.D6_UPDATE_PHONE,
        requestBody
      );

      console.log("localstorage1", response?.data);

      // Close the modal on success
      handleClose();
    } catch (error) {
      console.error("Error updating mobile number:", error);

      // Display error feedback
      alert("Failed to update mobile number. Please try again.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
        onClick: (e) => e.stopPropagation(),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "400px" },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "40px", objectFit: "contain" }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ textAlign: "center", flexGrow: 1 }}
          >
            Update Mobile Number
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Please update your mobile number to ensure you can receive
            notifications and updates.
          </Typography>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Update Number
        </Button>
      </Box>
    </Modal>
  );
};

export default CallbackPage;
