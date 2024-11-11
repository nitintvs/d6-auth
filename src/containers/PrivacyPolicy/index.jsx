import { useEffect, useState, forwardRef } from "react";
import _ from "lodash";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  Slide,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import {
  APIRouteConstants,
  authRouteConstants,
} from "constants/routeConstants";
import axiosInstance from "configs/axiosConfig";
import { fontSize } from "@mui/system";
import CustomDialog from "components/Dialog";
import axios from "axios";
import { PRIVACY_POLICY } from "constants/appConstants";
import CloseIcon from "@mui/icons-material/Close";
import instance from "configs/axiosConfig";
import parse from "html-react-parser";
import Loader from "components/Loader";
const PrivacyPolicy = ({ isOpen, openPrivacyPolicy = () => {} }) => {
  const [privacyData, setPrivacydata] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (isOpen && _.isEmpty(privacyData)) getPrivacyPolicy();
  }, [isOpen]);

  const getPrivacyPolicy = async () => {
    setLoader(true);
    let res = await instance.get(APIRouteConstants.DASHBOARD.PRIVACY_POLICYS);
    let { data, response } = res;

    if (response && response.status === 400 && response.data) {
      for (let i in response.data) {
        enqueueSnackbar(_.capitalize(i) + ": " + response.data[i], {
          variant: "error",
        });
      }
    }

    if (data && data && data.privacy_policy) {
      setPrivacydata(data.privacy_policy);
    }
    setLoader(false);
  };

  return (
    <Dialog
      className="condition-dialog-wrapper"
      onClose={() => openPrivacyPolicy(false)}
      open={isOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: "1.2rem" }}>
        {"Returns and refunds"}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => openPrivacyPolicy(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Loader open={loader} />
      <Divider />
      <DialogContent className="dialog-content">
        <DialogContentText
          className="policy-wrapper"
          id="alert-dialog-slide-description"
        >
          {!loader && parse(`${privacyData?privacyData:"No return & refunds policy"}`)}
          {/* <span style={{ fontWeight: '600', color: 'black' }}>{_.get(privacyData, 'subheading')}</span>
                    <p style={{ whiteSpace: 'pre-line' }}>{_.get(privacyData, 'text_content')}</p> */}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="dialog-action">
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            openPrivacyPolicy(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyPolicy;
