import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Divider,
  Typography,
  Box,
  CardMedia,
  Tooltip,
  TextField,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import InappropriateContent from "containers/InappropriateContent";
import { CloseOutlined } from "@mui/icons-material";
import report from "../../assets/icons/report.png";
import instance from "configs/axiosConfig";
import { APIRouteConstants } from "constants/routeConstants";
import { enqueueSnackbar } from "notistack";
import _ from "lodash";
import Loader from "components/Loader";
import { useLoader } from "Context/LoaderContext";
const FlagContent = ({ productName, productUrl, product }) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { showLoader, hideLoader } = useLoader();
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    reason: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };


  const validateForm = () => {
    let valid = true;
    let newErrors = {
      email: '',
      reason: '',
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Reason validation
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  
  const handleFlag = async (e) => {
    showLoader("Loading data, please wait...")
    // e.stopPropagation();
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    if (validateForm()) {
      const payload = {
        user_email: formData.email,
        reason_for_flagging: formData.reason,
        // product_url:
        //   "https://thevetstore.webbieshop.com/" + "product/" + product?.id,
        product_url: window.location.origin + "/product" + "/" + product?.id,
        // date: "",
        date: formattedDate,
      };

      try {
        const Response = await instance.post(
          APIRouteConstants.DASHBOARD.REPORT_PRODUCT,
          { ...payload }
        );
        const { data, response } = Response;
        console.log("response", data);
        if (response && response.status === 400 && response.data) {
          if (response.data.error) {
            enqueueSnackbar(response.data.error, { variant: "error" });
            hideLoader()
          } else
            for (let i in response.data) {
              enqueueSnackbar(_.capitalize(i) + ": " + response.data[i][0], {
                variant: "error",
              });
              setFormData({
                email: '',
                reason: '',
              })
              hideLoader()
            }
        }
        if (data && data.success == true) {
          enqueueSnackbar(data?.message, { variant: "success" });
          hideLoader()
        }
        console.log("formattedDate", response.data);
      } catch (error) {
        hideLoader()
        console.error("Error submitting the form:", error);
      }
      handleClose(e);
    }
  };






  const handleTermsOpen = (e) => {
    e.stopPropagation();
    setTermsOpen(true);
  };

  const handleTermsClose = (e) => {
    e.stopPropagation();
    setTermsOpen(false);
  };


  

  return (
    <>
      <IconButton onClick={handleClickOpen} aria-label="flag">
        <Tooltip title="Report inappropriate content">
          <img src={report} style={{ width: "30px", color: "#ccc" }} />
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <Grid
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <DialogTitle
            fontWeight={"500"}
            p={"8px !important"}
            fontSize={"1.1rem"}
          >
            Report Inappropriate Content
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Divider></Divider>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <Box display={"flex"}>
            <Box
              component="img"
              src={product.product_image}
              alt={product.name}
              sx={{
                width: "100%",
                maxWidth: 200,
                margin: "auto",
                height: "auto",
                marginBottom: 2,
              }}
            />
          </Box>
          <Typography fontSize={"0.9rem"} fontWeight={"500"}>
            {product.name}
          </Typography>
          <Box>
            <Box pt={2}>
              {/* <Typography>Email</Typography> */}
              <TextField
                variant="outlined"
                label="Email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                size="small"
                onClick={(e) => e.stopPropagation()}
                error={!!errors.email} // Mark input as errored
                helperText={errors.email} // Show error message
              />
            </Box>
            <Box pt={2}>
              <TextField
                fullWidth
                label="Reason to report
"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                // sx={{ pt: 1 }}
                multiline
                size="small"
                onClick={(e) => e.stopPropagation()}
                error={!!errors.reason} // Mark input as errored
                helperText={errors.reason} // Show error message
              />
            </Box>
          </Box>

          <Box pb={0}>
            <Typography fontSize={"0.75rem"} mt={2} textAlign={"left"}>
              Note :
              <br />
              If you find this content innappropriate, please click confirm and
              proceed, to submit the report.
              <br />
              For more details please read the terms and conditions mentioned in
              the footer of the website.
            </Typography>
          </Box>
        </DialogContent>
        <Divider></Divider>
        <Box display={"flex"}>
          <Button
            variant="text"
            fullWidth
            sx={{ borderRadius: "0" }}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ borderRadius: "0" }}
            onClick={handleFlag}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
      <InappropriateContent open={termsOpen} onClose={handleTermsClose} />
    </>
  );
};

export default FlagContent;

