import { useEffect, useState } from "react";
import {
  DialogContent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import parse from "html-react-parser";
import { useSnackbar } from "notistack";
import {
  APIRouteConstants,
  authRouteConstants,
} from "constants/routeConstants";
import _ from "lodash";
import axiosInstance from "configs/axiosConfig";
import { fontSize } from "@mui/system";
import CustomDialog from "components/Dialog";
import axios from "axios";
import { TERMS_OF_SERVICE } from "constants/appConstants";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "components/Loader";
import instance from "configs/axiosConfig";

const TermsAndConditions = ({ isOpen, openTermsAndConditions, setHeader_text }) => {
  const [termsAndCondition, setTermsAndCondition] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (isOpen && _.isEmpty(termsAndCondition)) getTermsAndCondition();
  }, [isOpen]);

  const getTermsAndCondition = async () => {
    setLoader(true);
    let res = await instance.get(APIRouteConstants.DASHBOARD.TERMS_CONDITION);
    let { data, response } = res;

    if (response && response.status === 400 && response.data) {
      for (let i in response.data) {
        enqueueSnackbar(_.capitalize(i) + ": " + response.data[i], {
          variant: "error",
        });
      }
    }

    if (data && data && data.terms_and_condition) {
      setTermsAndCondition(data.terms_and_condition);
    }
    setLoader(false);
  };

  return (
    <Dialog
      className="condition-dialog-wrapper"
      onClose={() => openTermsAndConditions(false)}
      open={isOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: "1.2rem" }}>
        {setHeader_text}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => openTermsAndConditions(false)}
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
          {!loader && parse(`${termsAndCondition}`)}
          {/* <span style={{ fontWeight: '600', color: 'black' }}>{_.get(termsAndCondition, 'subheading')}</span>
                    <p style={{ whiteSpace: 'pre-line' }}>{_.get(termsAndCondition, 'text_content')}</p> */}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="dialog-action">
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            openTermsAndConditions(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditions;
