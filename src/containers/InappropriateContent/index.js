import React, { useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ReportIcon from "../../assets/icons/report.png";
import { CloseTwoTone } from "@mui/icons-material";
import Loader from "components/Loader";

const InappropriateContent = ({ termsOpen, handleTermsClose }) => {
  return (
    <Dialog
      open={termsOpen}
      onClose={handleTermsClose}
    >
      <Grid
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid>

        <DialogTitle fontSize={"0.9rem"} fontWeight={"500"}>
          Terms and Conditions for Reporting Inappropriate Content
        </DialogTitle>
        </Grid>
        <Grid>

        <IconButton onClick={handleTermsClose}>
          <CloseTwoTone />
        </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <DialogContent>
        <Typography fontSize={"0.85rem"} fontWeight={"500"} mb={2}>
          We truly appreciate your help in keeping the platform safe. Please
          follow these simple guidelines:
        </Typography>
        <Typography
          fontSize={"0.7rem"}
          fontWeight={"300"}
          paragraph
          display={"flex"}
          alignItems={"center"}
        >
          1. If you see content that seems inappropriate or fake, use the report
          icon on the product page.
          <img src={ReportIcon} style={{ width: "30px" }} />
        </Typography>
        <Typography fontSize={"0.7rem"} fontWeight={"300"} paragraph>
          2. The details of your report, including your email and the reported
          product information, will be accessible to the team handling the
          review. They will assess the report and take appropriate action if
          necessary.
        </Typography>
        <Typography fontSize={"0.7rem"} fontWeight={"300"} paragraph>
          3. False reports may lead to penalties, including account suspension.
        </Typography>

        <Typography fontSize={"0.8rem"} fontWeight={"300"}>
          Thank you for helping us keep the platform safe and reliable.
        </Typography>
      </DialogContent>
      <Divider />
      {/* <DialogActions> */}
      <Button fullWidth onClick={handleTermsClose} color="primary">
        Close
      </Button>
      {/* </DialogActions> */}
    </Dialog>
  );
};

export default InappropriateContent;

// const FullScreenLoader = ({ loading }) => {
//     return (
//       <Backdrop
//         sx={{
//           color: '#fff',
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//         open={loading}
//       >
//         <CircularProgress color="inherit" />
//         <Typography
//           variant="h6"
//           sx={{ mt: 2, color: 'white' }}
//         >
//           Loading, please wait...
//         </Typography>
//       </Backdrop>
//     );
//   };
