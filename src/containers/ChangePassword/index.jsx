
import React, { useState } from 'react'

import {
    Card,
    Grid,
    FormControl,
    TextField,
    Button
} from "@mui/material";
import { useForm } from 'react-hook-form';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import _ from 'lodash';

const Changepassword = ({ uid,change0nBack=()=>{}}) => {
    const [loader, setLoader] = useState(false)
    const [isLogin,setIsLogIn]=useState(false)
    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit, control, getValues } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
    });

    const changePassword = async (formData) => {
        setLoader(true)
        const payload = {
            uid: uid,
            new_password: formData.password,
            confirm_password: formData.confirmPassword
        }
        let res = await axiosInstance.post(APIRouteConstants.AUTH.RESETPASSWORD, payload)
        let { data, response } = res;
        // navigate(`/auth/otp-validate`)
        setLoader(false)

        if (response
            && response.status === 400
            && response.data) {
            for (let i in response.data) {
                setLoader(false)
                enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i], { variant: 'error' });
            }
        } else {
            // navigate(`/auth/login`)
            change0nBack()
        }


    };

    return (
        <div className="login-wrapper">
            <Loader open={loader} />
            <div className="card-wrapper" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <span className="form-label">Reset your password
                </span>
                <h5 className='label-sec-text'>
                    Enter a new password for your account
                </h5>
                <form onSubmit={handleSubmit(changePassword)} style={{ padding: '30px' }}>
                    <Grid container className="form-container">
                        <Grid item sm={12} className='form-wrapper'>
                            <FormControl className='form-control'>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    placeholder="New Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="New Password"
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
                        </Grid>
                        <Grid item sm={12} className='form-wrapper'>
                            <FormControl className='form-control'>
                                <TextField
                                    margin="dense"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Confirm Password"
                                    {...register("confirmPassword", { required: true, minLength: 6, maxLength: 20 })}
                                    error={errors.confirmPassword?.type}
                                    helperText={(errors.confirmPassword?.type === "required" && (
                                        'Confirm Password is required'
                                    ) || errors.confirmPassword?.type === "minLength" && (
                                        'Confirm should be atleast 6 character in length'
                                    ) || errors.confirmPassword?.type === "maxLength" && (
                                        'Confirm  should not be more than 20 character in length'
                                    ))}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item sm={12} className='form-wrapper' style={{ display: 'flex', justifyContent: 'center' }}>
                            <div >
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="success"
                                    style={{width:'300px', marginTop:'20px'}}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    )
}

export default Changepassword 