import React, { useEffect, useState } from 'react'

import { 
    Divider,
    Grid,
    Button,
    Card,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    FormLabel,
    FormControl,
    TextField,
    InputAdornment
} from '@mui/material';
import _ from 'lodash';
import { useForm } from "react-hook-form";

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import axiosInstance from "configs/axiosConfig";

import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loader from 'components/Loader';
import { APIRouteConstants } from 'constants/routeConstants';
import { useSnackbar } from 'notistack';

const UserSetting = ({ breadcrumbs }) => {
    const [openUpdatePass, setUpdatePass] = useState(false);
    const [activeCard, setActiveCard] = useState();
    const [openUpdateAdd, setUpdateAdd] = useState(false);
    const [userDetail, setUserDetail] = useState({})
    const [loader, setLoader] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const getUserDetails = async (category) => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_USER_DETAIL);
        let { data } = res;
    
        if (data && !_.isEmpty(data.data)) {
            setUserDetail(data.data)
        }
        setLoader(false)
    }

    const handleUpdatePassword = async (formData) => {
        setLoader(true)
        let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.UPDATE_PASSWORD, formData);
        let { data, response } = res;

        if (response 
            && response.status == 400
            && response.data) {
                enqueueSnackbar(response.data.message, { variant: 'error' })
                reset()
            }
    
        if (!_.isEmpty(data)) {
            enqueueSnackbar('Password updated successfully', { variant: 'success' })
            setUpdatePass(false)
            reset()
        }
        setLoader(false)
    }

    const [addressList, setAddressList] = useState([]);

    const getAddressList = async () => {
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_ADDRESS_LIST);
        let { data, response } = res;

        if (response
            && response.status === 400
            && response.data) {
            for (let i in response.data) {
                enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i][0], { variant: 'error' });
                setLoader(false)
            }
        }

        if (data) {
            setAddressList(data);
        }
    }

    useEffect(() => {
        getUserDetails()
        getAddressList()
    }, [])

    return (
        <CustomLayout>
            <Loader open={loader} />
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={_.get(userDetail, 'first_name') + ' ' + _.get(userDetail, 'last_name')} />
                <Divider className="divider"/>
                <Grid container className="usersetting-wrapper main-content-wrapper">
                    <Grid container className="list-wrapper">
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <ListItem component="div" className="item-warpper" onClick={() => setActiveCard()}>
                                <ListItemButton>
                                    <ListItemIcon className="icon-wrapper">
                                        <ContactEmergencyIcon />
                                    </ListItemIcon>
                                    <ListItemText className="text-wrapper" primary={`Account`} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem component="div" className="item-warpper" onClick={() => setActiveCard('address')}>
                                <ListItemButton>
                                    <ListItemIcon className="icon-wrapper">
                                        <LocationOnIcon />
                                    </ListItemIcon>
                                    <ListItemText className="text-wrapper" primary={`Addresses`} />
                                </ListItemButton>
                            </ListItem>
                            
                        </Grid>
                        {!activeCard && <Grid item xs={12} sm={12} md={9} lg={9}>
                            <Card className="list-content-wrapper">
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Username : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(userDetail, 'first_name') + ' ' + _.get(userDetail, 'last_name')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Contact : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(userDetail, 'country_code') + ' ' + _.get(userDetail, 'mobile_number')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Email : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(userDetail, 'email')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Password : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">*********</span>
                                        {!openUpdatePass && 
                                        <span 
                                            className="link" 
                                            onClick={() => setUpdatePass(true)}
                                        >Change Password</span> }
                                        {openUpdatePass && (
                                        <form onSubmit={handleSubmit(handleUpdatePassword)}>
                                        <Grid container className="update-wrapper">
                                            <Grid item xs={12} className='form-wrapper'>
                                                <FormLabel>Old Password</FormLabel>
                                            {/* </Grid> */}
                                            {/* <Grid item xs={8} className='form-wrapper'> */}
                                                <FormControl style={{ marginBottom: '1rem' }} className='form-control'>
                                                    <TextField
                                                        margin="dense"
                                                        id="name"
                                                        type="password"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        {...register("old_password", { required: true})}
                                                        error={errors.old_password?.type}
                                                        helperText={errors.old_password?.type === "required" && (
                                                            'Old password is required'
                                                        )}
                                                        // variant="soft"
                                                        InputLabelProps={{ shrink: false }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} className='form-wrapper'>
                                                <FormLabel>New Password</FormLabel>
                                            {/* </Grid> */}
                                            {/* <Grid item xs={8} className='form-wrapper'> */}
                                                <FormControl style={{ marginBottom: '1rem' }} className='form-control'>
                                                    <TextField
                                                        margin="dense"
                                                        id="name"
                                                        type="password"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        {...register("new_password", { required: true})}
                                                        error={errors.new_password?.type}
                                                        helperText={errors.new_password?.type === "required" && (
                                                            'New password is required'
                                                        )}
                                                        InputLabelProps={{ shrink: false }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} className='form-wrapper'>
                                                <FormLabel>Confirm Password</FormLabel>
                                            {/* </Grid> */}
                                            {/* <Grid item xs={8} className='form-wrapper'> */}
                                                <FormControl style={{ marginBottom: '1rem' }} className='form-control'>
                                                    <TextField
                                                        margin="dense"
                                                        id="name"
                                                        type="password"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        {...register("confirm_password", { required: true})}
                                                        error={errors.confirm_password?.type}
                                                        helperText={errors.confirm_password?.type === "required" && (
                                                            'Confirm password is required'
                                                        )}
                                                        // variant="soft"
                                                        InputLabelProps={{ shrink: false }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4} className='form-wrapper'>
                                                <Button 
                                                    type="submit"
                                                    variant="contained">Update</Button>
                                            </Grid>
                                        </Grid>
                                        </form>
                                        )}
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid> }
                        {activeCard === 'address' && <Grid item xs={12} sm={12} md={8} lg={9} className="address-wrapper">
                            {/* <Grid container className="item-wrapper">
                                {!openUpdateAdd ?
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setUpdateAdd(true)}
                                    color="secondary">
                                    + ADD NEW ADDRESS
                                </Button> : <div className='button-wrapper'>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => setUpdateAdd(false)}
                                        color="secondary">
                                        Save
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => setUpdateAdd(false)}
                                        color="error">
                                        Cancel
                                    </Button>
                                </div>
                                }
                            </Grid> */}
                            {openUpdateAdd && <Card className="update-form-wrapper list-content-wrapper">
                                <Grid container spacing={3}>
                                <Grid item sm={6} className='form-wrapper'>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Enter First Name"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} className='form-wrapper'>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Enter Last Name"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={12} className='form-wrapper'>
                                    <FormLabel>Street address</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="House Number, Apartment, Suite and Street Name"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} className='form-wrapper'>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Enter Country"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} className='form-wrapper'>
                                    <FormLabel>State</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Enter State"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} className='form-wrapper'>
                                    <FormLabel>Town / City</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Enter Town / City"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} className='form-wrapper'>
                                    <FormLabel>PIN</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="PIN"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            // variant="soft"
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} className='form-wrapper'>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Enter Phone"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                            }}
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} className='form-wrapper'>
                                    <FormLabel>Address Type</FormLabel>
                                    <FormControl className='form-control'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Home / Other"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    </FormControl>
                                </Grid>
                                </Grid>
                            </Card> }
                            {addressList.length > 0 && addressList.map(address => (
                            <Card className="list-content-wrapper">
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Recipient Name : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'first_name') + ' ' + _.get(address, 'last_name')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">House Number : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'house_number_or_building_number')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Street : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'street_address')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">City : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'city')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">State/province/area : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'state')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Country : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'country')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Pincode : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{_.get(address, 'pin')}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Phone Number : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">{'+' + _.get(address, 'country_code') + ' ' + _.get(address, 'phone_number')}</span>
                                    </Grid>
                                </Grid>
                            </Card>
                            ))}
                            {/* <Card className="list-content-wrapper">
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Street : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">C-5, 4th Flr, Everest Bldg., Tardeo Rd, Tardeo</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">City : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">Mumbai</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">State/province/area : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">Maharashtra</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Phone Number : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">+91 7777-777-777</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Pincode : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">400034</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Country : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">India</span>
                                    </Grid>
                                </Grid>
                            </Card>
                            <Card className="list-content-wrapper">
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Street : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">Shop No 15, Market No 3, C R Park</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">City : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">Delhi</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">State/province/area : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">Delhi</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Phone Number : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">+91 7777-777-777</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Pincode : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">110019</span>
                                    </Grid>
                                </Grid>
                                <Grid container className="item-wrapper">
                                    <Grid item md={4} className="key-wrapper">
                                        <span className="">Country : </span>
                                    </Grid>
                                    <Grid item md={8} className="value-wrapper">
                                        <span className="">India</span>
                                    </Grid>
                                </Grid>
                            </Card> */}
                        </Grid> }
                    </Grid>
                </Grid>
            </div>
        </CustomLayout>
    )
}

export default UserSetting