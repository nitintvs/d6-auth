import React, { useState } from 'react'

import {
    Card,
    Grid,
    FormControl,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    FormLabel,
    Divider
} from "@mui/material";
import { useForm } from 'react-hook-form';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import { enqueueSnackbar } from 'notistack';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
// import OTP from 'components/Inputs/OTP';
// import Changepassword from 'containers/Changepassword';
import OTP from 'containers/OTP';
import Changepassword from 'containers/ChangePassword';
import { padding, textAlign } from '@mui/system';
// import 

const Forgotpassword = ({onBack=()=>{}}) => {
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false)
    const [step, setStep] = useState(0)
    const [otp, setOTP] = useState('');
    const [email, setEmail] = useState('')
    const [uid, setUid] = useState('')


    const { register, formState: { errors }, handleSubmit, control, getValues } = useForm({
        defaultValues: {
            email: '',
        },
    });

    const doEnterEmail = async (formData) => {
        setLoader(true)
        formData = {
            ...formData,
            email: formData.email,
            user_type: 5
        }
        let res = await axiosInstance.post(APIRouteConstants.AUTH.FORGOTPASSEMAIL, formData)
        let { data, response } = res;
        // navigate(`/auth/otp-validate`)
        setStep(1)
        setLoader(false)
        setEmail(formData?.email)
        if (response
            && response.status === 400
            && response.data) {
            for (let i in response.data) {
                setLoader(false)
                enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i], { variant: 'error' });
            }
        }

    };



    const verifyOTP = async () => {
        const payload = {
            email: email,
            user_type: 5,
            otp: otp
        }
        setLoader(true)
        let res = await axiosInstance.post(APIRouteConstants.AUTH.OTPVALIDATECHANGEPASSWORD, payload)
        let { data, response } = res;
        setLoader(false)
        setUid(res?.data?.uid)
        if (response
            && response.status === 400
            && response.data) {
            for (let i in response.data) {
                setLoader(false)
                enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i], { variant: 'error' });
            }
        }
        if (data && data.success) {
            enqueueSnackbar('OTP verified successfully', { variant: 'success' });
            setStep(2)
        }
    };
    return (
        <div>
            {step == 0 && (
                <div className="dialog-body" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>

                    <Loader open={loader} />
                    {/* <Card className="auth-wrapper form-wrapper"> */}
                    <span className="">Forgot your password?</span>
                    <h5 className='description' style={{ textAlign: 'center' }}>Please enter the email associated with your account and we'll send you the OTP to reset your password</h5>
                    <form onSubmit={handleSubmit(doEnterEmail)} >
                        <Grid container className="form-container formALign" >
                            <Grid item sm={12} className='form-wrapper'>
                                <FormControl className='form-control'>
                                    <TextField
                                        margin="dense"
                                        id="email"
                                        placeholder="Enter Email"
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        label="
                            Enter Email"
                                        {...register("email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i })}
                                        error={errors.email?.type}
                                        helperText={(errors.email?.type === "required" && (
                                            'Email is required'
                                        ) || errors.email?.type === "pattern" && (
                                            'Email is invalid'
                                        ))}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid className=''>
                                <div className='buttonSize'>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        className='buttonSize'
                                    >
                                        Continue
                                    </Button>
                                </div>

                            </Grid>
                        </Grid>
                    </form>
                    {/* </Card> */}
                </div>
            )}
            {step == 1 && (
                <div className="login-wrapper">
                    <Loader open={loader} />
                    {/* <Card style={{ padding: "14px" }} className="list-wrapper dashboard-card-wrapper"> */}

                    <h4 className='title-text' style={{ marginBottom: '5px', textAlign: 'center' }}>Enter the OTP sent to your  <br />registered email
                    </h4>
                    <Divider />
                    <DialogContent >
                        <div className='form-wrapper'>
                           
                            <FormControl style={{marginLeft:'10px'}} className='form-control'>
                                <OTP
                                    style={{ marginTop: '1rem' }}
                                    separator={<span>-</span>}
                                    value={otp}
                                    onChange={setOTP}
                                    length={5} />
                            </FormControl>
                        </div>
                    </DialogContent>
                    <div style={{ marginTop: '1rem', marginBottom: '1rem', marginLeft: '23%' }} className='action-wrapper'>
                        <Button
                            sx={{ width: 'fit-content', mr: 1 }}
                            variant="contained"
                            disabled={otp?.length < 5}
                            onClick={() => verifyOTP()}
                            color="success">Verify</Button>
                        <Button
                            sx={{ width: 'fit-content' }}
                            variant="outlined"
                            // onClick={() => navigate(`/auth/login`)}
                            color="secondary">Cancel</Button>
                    </div>
                    {/* </Card> */}
                </div>
            )}
            {step == 2 && (

                <Changepassword change0nBack={onBack} uid={uid} />
            )}
        </div>
    )
}

export default Forgotpassword 