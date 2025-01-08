import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from 'notistack';
import {
    TextField,
    Button,
    FormControl,
    DialogActions,
    InputAdornment,
    Select,
    MenuItem,
    CardMedia
} from '@mui/material';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import axios from "axios";

import Loader from 'components/Loader';
import { countryCode } from 'constants/appData/filters';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants, dashboardRouteConstants } from "constants/routeConstants";
import CustomDialog from 'components/Dialog';
import { handleOpenAuthDialog, updateUserDetail } from 'utils/auth';
import { API_URL, GLOBAL_COUNTRY_CODE } from 'constants/appConstants'
import Forgotpassword from 'containers/Forgotpassword';
import PrivacyPolicy from 'containers/PrivacyPolicy';
import TermsAndConditions from 'containers/TermsAndConditions';
import { useAuth } from 'oidc-react';

export default function AuthDialog({ isAuthDialogOpen, setAuthDialog, refreshUser, logoUrl }) {
    const { register, formState: { errors }, handleSubmit, control, getValues } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            mobile_number: '',
            email: '',
            password: '',
            country_code: GLOBAL_COUNTRY_CODE
        },
    });
    const { enqueueSnackbar } = useSnackbar();
    const [isLoginView, setLoginView] = useState(true);
    const [loader, setLoader] = useState(false);
    const [isForgotPass, setIsForgotPass] = useState(false)
    const [isOpenPrivacy, setOpenPrivacy] = useState(false)
    const [isOpenTerms, setOpenTerms] = useState(false)

    const handleLoginView = () => {
        if (isForgotPass) {
            setIsForgotPass(false)
            setLoginView(true)
        } else {
            setLoginView(!isLoginView)
        }
    }

    const DialogHeader = (
        <span className='description'>Please enter your details to {isLoginView ? 'sign in' : 'get started'}.</span>
    );

    const DialogAction = (
        <Button type="submit" color="success" variant="contained">
            {isLoginView ? 'Sign in' : 'Sign up'}
        </Button>
    )

    const DialogFooter = (
        <div style={{ textAlign: 'center' }} className='link-wrapper'>
            <u onClick={handleLoginView}>
                <p className="decorated-text description">
                    {isLoginView && !isForgotPass ?
                        `Don't have an account? Create account` :
                        `Already an existing user? Sign in`}
                </p>
            </u>
        </div>
    )

    const privacyStatement = (
        <div style={{ textAlign: 'center', padding: '0.6rem 2rem' }} className=' link-wrapper'>
            <u>
                <p style={{ fontSize: '15px', }} className="description">
                    By continuing, you agree to the 
                    <span 
                        className='link-wrapper-underLine' 
                        onClick={() => setOpenTerms(true)}> 
                    {" "} Terms of Service 
                    </span> and  <span 
                    onClick={(e) => {
                        setOpenPrivacy(true)
                    }} className='link-wrapper-underLine'>Privacy Policy.</span>
                </p>
            </u>
        </div>
    )


    const getUser = async (token) => {
        let res = await axios.get(APIRouteConstants.AUTH.ME, {
            baseURL: API_URL,
            headers: {
                Accept: "application/json",
                "domain-name": 'accessories',
                Authorization: `Bearer ${token}`,
            }
        })
        let { data, response } = res;

        if (response
            && response.status === 401) {
            // navigate(authRouteConstants.LOGOUT)
        }

        if (data && data.success) {
            const user = data.data;
            updateUserDetail(user)
            handleOpenAuthDialog()
            setLoader(false)
        }
    }

    const doLogin = async (formData) => {
        setLoader(true)
        let res = await axiosInstance.post(APIRouteConstants.AUTH.LOGIN, formData)
        let { data, response } = res;

        if (response
            && response.status === 400
            && response.data) {
            if (response.data.message) {
                enqueueSnackbar(response.data.message, { variant: 'error' });
                setLoader(false)
            } else
                for (let i in response.data) {
                    enqueueSnackbar(response.data[i][0], { variant: 'error' });
                    setLoader(false)
                }
        }

        if (data && data.success) {
            localStorage.setItem('u-access-token', data.access)
            getUser(data.access)
        }
    }

    const doCreateUser = async (formData) => {
        setLoader(true)
        let res = await axiosInstance.post(APIRouteConstants.AUTH.SIGNUP, formData)
        let { data, response } = res;

        if (response
            && response.status === 400
            && response.data ) {
                if (response.data.message) {
                    enqueueSnackbar(response.data.message, { variant: 'error' })
                } else {
                    for (let i in response.data) {
                        enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i][0], { variant: 'error' });
                    }
                }
        }

        if (!_.isEmpty(data)) {
            setLoginView(true)
        }
        setLoader(false)
    }

    const handleAuth = (formData) => {
        if (isLoginView) doLogin(formData)
        else {
            if (formData.mobile_number) {
                formData = {
                    ...formData,
                    country_code: formData.country_code.dial_code,
                }
            } else {
                delete formData['mobile_number']
                delete formData['country_code']
            }
            doCreateUser(formData)
        }
    }

    const openTermsAndConditions = (value) => {
        setOpenTerms(value);
    }

    const openPrivacyPolicy = (value) => {
        setOpenPrivacy(value);
    }
     const IS_D6_APP=  window?.location?.host === "d6auth.vercel.app"
    return (
        <div>
           {!IS_D6_APP? <D6Modal  logoUrl={logoUrl} isDialogOpen={isAuthDialogOpen} setDialogOpen={setAuthDialog}/>: <CustomDialog
                isDialogOpen={isAuthDialogOpen}
                setDialogOpen={setAuthDialog}
                header={!isForgotPass && DialogHeader}
                footer={DialogFooter}
                isFormattedDialog={!isForgotPass}
                action={DialogAction}
                handleForm={handleAuth}
                logoUrl={logoUrl}
                subFooter={!isForgotPass && privacyStatement}
            >
                <Loader open={loader} />
                {!isForgotPass ? (
                    <div>
                        {isLoginView ?
                            <form onSubmit={handleSubmit(handleAuth)}>
                                <div className="dialog-body">
                                    <div className='auth-wrapper form-wrapper'>
                                        <FormControl className='form-control'>
                                            <TextField
                                                margin="dense"
                                                id="email"
                                                placeholder="Email"
                                                type="email"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: false }}
                                                {...register("email", { required: true })}
                                                error={errors.email?.type}
                                                helperText={errors.email?.type === "required" && (
                                                    'Email or Phone number is required'
                                                )}
                                            />
                                        </FormControl>
                                        <FormControl className='form-control'>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                placeholder="Enter Password"
                                                type="password"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                // label="Password"
                                                InputLabelProps={{ shrink: false }}
                                                {...register("password", { required: true })}
                                                error={errors.password?.type}
                                                helperText={errors.password?.type === "required" && (
                                                    'Password is required'
                                                )}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <DialogActions className='dialog-action-wrapper'>
                                    {DialogAction}
                                </DialogActions>
                            </form>
                            : <form onSubmit={handleSubmit(handleAuth)}>
                                <div className="dialog-body">
                                    <div className='auth-wrapper form-wrapper'>
                                        <FormControl className='form-control'>
                                            <TextField
                                                margin="dense"
                                                id="first_name"
                                                placeholder="First Name"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: false }}
                                                {...register("first_name", { required: true, maxLength: 20 })}
                                                error={errors.first_name?.type}
                                                helperText={errors.first_name?.type === "required" && (
                                                    'First name is required'
                                                )}
                                            />
                                        </FormControl>
                                        <FormControl className='form-control'>
                                            <TextField
                                                margin="dense"
                                                id="last_name"
                                                placeholder="Last Name"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: false }}
                                                {...register("last_name", { required: true, maxLength: 20 })}
                                                error={errors.last_name?.type}
                                                helperText={errors.last_name?.type === "required" && (
                                                    'Last name is required'
                                                )}
                                            />
                                        </FormControl>
                                        <FormControl className='form-control'>
                                            <TextField
                                                margin="dense"
                                                id="email"
                                                placeholder="Email"
                                                type="email"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: false }}
                                                {...register("email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i })}
                                                error={errors.email?.type}
                                                helperText={(errors.email?.type === "required" && (
                                                    'Email is required'
                                                ) || errors.email?.type === "pattern" && (
                                                    'Email is invalid'
                                                ))}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth className='select-wrapper'>
                                            <Controller
                                                control={control}
                                                name="mobile_number"
                                                rules={{ required: true, maxLength: 10, minLength: 10 }}
                                                // defaultValue={contact?.mobile_number}
                                                render={({ field: { onChange, value } }) => (
                                                    <TextField
                                                        margin="dense"
                                                        id="name"
                                                        placeholder="Mobile Number"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={onChange}
                                                        value={value}
                                                        autoComplete='false'
                                                        InputLabelProps={{ shrink: false }}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    className="select-input"
                                                                    label="Status"
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                                                                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                                                        {
                                                                            border: 0,
                                                                        },
                                                                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                                        {
                                                                            border: 0,
                                                                        },
                                                                    }}
                                                                    renderValue={(selected) => (
                                                                        <div className="dial-code-wrapper">
                                                                            <img src={selected.flag} />
                                                                            {'+' + selected.dial_code}
                                                                        </div>
                                                                    )}
                                                                    defaultValue={GLOBAL_COUNTRY_CODE}
                                                                    {...register("country_code", { required: true })}
                                                                    error={getValues()['mobile_number'] && errors.country_code?.type}
                                                                >
                                                                    {countryCode.map((code, index) =>
                                                                        <MenuItem className="dial-code-wrapper" value={code}>
                                                                            <img src={code.flag} />
                                                                            {'+' + code.dial_code}
                                                                        </MenuItem>
                                                                    )}
                                                                </Select>
                                                            </InputAdornment>,
                                                        }}
                                                    />
                                                )}
                                            />
                                            <span className="error-text">
                                                {(errors.mobile_number?.type === "required" && (
                                                    'Mobile number is mandatory'
                                                ) || errors.mobile_number?.type === "maxLength" && (
                                                    'Mobile number must be 10 digit in length'
                                                ) || errors.mobile_number?.type === "minLength" && (
                                                    'Mobile number must be 10 digit in length'
                                                ))}
                                                {/* {getValues()['mobile_number'] && errors.country_code?.type === "required" && (
                                        'Country code is required'
                                    )} */}
                                            </span>
                                        </FormControl>
                                        <FormControl className='form-control'>
                                            <TextField
                                                margin="dense"
                                                id="password"
                                                placeholder="Password"
                                                type="password"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: false }}
                                                {...register("password", { required: true, minLength: 6, maxLength: 20 })}
                                                error={errors.password?.type}
                                                helperText={(errors.password?.type === "required" && (
                                                    'Password is required'
                                                ) || errors.password?.type === "minLength" && (
                                                    'Password should be atleast 6 character in length'
                                                ) || errors.password?.type === "maxLength" && (
                                                    'Password should not be more than 20 character in length'
                                                ))}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <DialogActions className='dialog-action-wrapper'>
                                    {DialogAction}
                                </DialogActions>
                            </form>}

                        <h4 type='button' className='link-wrapper-underLine' onClick={() => setIsForgotPass(true)} style={{ margin: '20px 40px 5px', fontSize: "14px" }}>Forgot password? </h4>
                    </div>
                ) : <Forgotpassword onBack={() => setIsForgotPass(false)} />}

            </CustomDialog>}
            <PrivacyPolicy isOpen={isOpenPrivacy} openPrivacyPolicy={openPrivacyPolicy}/>
            <TermsAndConditions isOpen={isOpenTerms} openTermsAndConditions={openTermsAndConditions}/>
        </div>
    );
}



const D6Modal = ({isDialogOpen,setDialogOpen, logoUrl}) => {

    const auth = useAuth();
  
    const handleLogin = () => {
      auth.signIn(); // Trigger login flow only when the button is clicked
    };
  
    const handleLogout = () => {
      auth.signOutRedirect({ post_logout_redirect_uri: "https://d6auth.vercel.app/login" });
    };
  const handleClose = () =>{setDialogOpen(false)} ;

  return (
    <>
      <Modal open={isDialogOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            margin:"auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <img src={logoUrl} alt="Logo" style={{ width: 50, height: 50 }} />
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        <Box textAlign={'center'} sx={{display:"flex",justifyContent:"center",alignItems:"center"}} >

          <CardMedia
            component={"img"}
            src={logoUrl}
            alt="Logo"
            style={{ width: 50, height: 50 }}
            />
            </Box>
          {/* Modal Content */}
          <Typography variant="h6" align="center" gutterBottom>
            Welcome to Testing Store!
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2, textTransform: "none" }}
          >
            Login with D6
          </Button>
        </Box>
      </Modal>
    </>
  );
};



