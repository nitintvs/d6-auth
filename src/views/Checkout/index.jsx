import { useState, useEffect, useCallback, useRef } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import {
    Divider,
    Grid,
    Button,
    TextField,
    FormControl,
    FormLabel,
    InputAdornment,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    List,
    ListItem,
    Paper,
    InputBase,
    IconButton,
    Modal,
    Typography,
    Box
} from '@mui/material';

import _ from 'lodash';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import { GoogleMap, Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';
import {
    setKey,
    fromAddress,
    geocode,
    RequestType
} from "react-geocode";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import { countryCode } from 'constants/appData/filters';
import { GLOBAL_COUNTRY_CODE, GLOBAL_CURRENCY, GOOGLE_KEY } from 'constants/appConstants';
import SticittPayment from 'components/Payment/SticittPayment';
import instance from 'configs/axiosConfig';

let formatCurrency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: GLOBAL_CURRENCY.code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
});

const showName = (args) => {
    return _.compact(args).join(' ')
}

const showAddress = (address) => {
    return (
        <div className="address-wrapper">
            <span>{showName([address.first_name, address.last_name])} | {showName([address.country_code, address.phone_number])}</span><br />
            <Divider className='content-divider' />
            <span>{address.street_address}</span><br />
            <span>{address.city}</span><br />
            <span>{address.state}, {address.country} - {address.pin}</span>
        </div>
    )
}

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const GoogleMapContainer = ({
    setValue,
    setLoader,
    location,
    selectLocation
}) => {
    const[zoom, setZoom] = useState(12);
    // const [location, selectLocation] = useState();
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_KEY,
        libraries,
    });

    const onMapLoad = useCallback((map) => {
        setMapInstance(map);
    }, []);

    useEffect(()=>{
        if(mapInstance && location){
            mapInstance.panTo({ lat: location.lat, lng: location.lng });
            if (location) setZoom(16);
        }
    },[mapInstance, location]);

    const onMapClick = (e) => {
        setLoader(true)
        selectLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        });
        fetchLocation(e.latLng.lat(), e.latLng.lng())   
    };

    const setCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            selectLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            fetchLocation(position.coords.latitude, position.coords.longitude)
        });
    }

    useEffect(() => {
        setCurrentLocation()
    }, [])

    const handlePlaceSelect = () => {
        setLoader(true);
        const addressObject = autocomplete.getPlace();
        const address = addressObject.formatted_address;
        const lat = addressObject.geometry.location.lat();
        const lng = addressObject.geometry.location.lng();

        selectLocation({ lat, lng });
        setKey(GOOGLE_KEY);
        geocode(RequestType.ADDRESS, address)
            .then(({results}) => {
                // Handle response
                const { lat, lng } = results[0].geometry.location;
                const { address, state, country, pincode, city, suburb } = retrieveLocation(results);
                setValue('address_line1', address);
                setValue('suburb', suburb);
                setValue('city', city);
                setValue('state', state);
                setValue('country', country);
                setValue('pin', pincode);

                selectLocation({
                    lat: lat,
                    lng: lng
                })
            })
            .catch(error => {
                // Handle error
                console.log('Error ', error)
                enqueueSnackbar('Location not found', { variant: 'error' });
            });

        setLoader(false);
    };

    const fetchLocation = async (lat, lon) => {
        setLoader(true)
        setKey(GOOGLE_KEY);
        geocode(RequestType.LATLNG, [lat, lon].toString(), {
            location_type: "ROOFTOP",
            enable_address_descriptor: true,
        }).then(({results}) => {
            const { address, state, country, pincode, city, suburb } = retrieveLocation(results);
            setValue('address_line1', address);
            setValue('suburb', suburb);
            setValue('city', city);
            setValue('state', state);
            setValue('country', country);
            setValue('pin', pincode);
        }).catch((area) => {
            enqueueSnackbar('Something went wrong! Please try again', { variant: 'error' });
        })
        setLoader(false)
    }

    const retrieveLocation = (location) => {
        const locationObj = location[location.length - 1].address_components.reduce(
            (acc, component) => {
                if (component.types.includes['street_number']
                    || component.types.includes("premise")
                    || component.types.includes("neighborhood")
                    || component.types.includes("sublocality_level_3")
                    || component.types.includes("route")) {
                    if (acc.address) 
                        acc.address = acc.address + ', ' + component.long_name;
                    else 
                        acc.address = component.long_name
                } else if (component.types.includes("administrative_area_level_3")) {
                    acc.city = component.long_name;
                }
                else if (component.types.includes("locality")) {
                        acc.suburb = component.long_name;
                } else if (component.types.includes("sublocality_level_1")) {
                    if (!acc.suburb)
                        acc.suburb = component.long_name;
                } else if (component.types.includes("sublocality_level_2")) {
                    if (!acc.suburb)
                        acc.suburb = component.long_name;
                } else if (component.types.includes("administrative_area_level_1"))
                    acc.state = component.long_name;
                else if (component.types.includes("country"))
                    acc.country = component.long_name;
                else if (component.types.includes("postal_code"))
                    acc.pincode = component.long_name;
                return acc;
            },
            {}
        );
        return locationObj
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    return (
        <>
            {/* <Loader open={!isLoaded} /> */}
            <Grid item md={6} sm={12} xs={12}>
                <div className='form-wrapper'>
                    <FormControl className='form-control'>
                        <Autocomplete
                            onLoad={autocomplete => setAutocomplete(autocomplete)}
                            onPlaceChanged={handlePlaceSelect}
                        >
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search your Area"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                />
                                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Autocomplete>
                    </FormControl>
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className='form-wrapper' style={{ marginBottom: '1rem' }}>
                    <FormLabel className='form-label'>
                        <span className='label-text'>
                            or Select your delivery location
                            <span className='required'>*</span>
                        </span><br />
                    </FormLabel>
                </div>
                {isLoaded ? 
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={zoom}
                    center={location}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                >
                    <Marker
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Adjust the URL as needed
                            scaledSize: new window.google.maps.Size(30, 30),
                        }}  
                        position={location} />
                    <IconButton 
                        type="button" 
                        onClick={setCurrentLocation}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: '1',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            padding: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                        }}
                        aria-label="search">
                        <GpsFixedIcon />
                    </IconButton>
                </GoogleMap>
                : '' }
            </Grid>
        </>
    )
}

const Checkout = ({ breadcrumbs }) => {
    const [loader, setLoader] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = location.state;
    const { enqueueSnackbar } = useSnackbar();
    const [addressList, setAddressList] = useState([]);
    const [viewAddAddress, setViewAddAddress] = useState(false);
    const [selectedAddress, selectAddress] = useState();
    const [cartSummary, setCartSummary] = useState();
    const [paymentModes, setPaymentModes] = useState([]);
    const [paymentid, setPaymentid] = useState();
    const [paymentstatus, setPaymentstatus] = useState();
    const [selectedPaymentMode, selectPaymentMode] = useState();
    const [locationPin, selectLocation] = useState();
    const { register, formState: { errors }, handleSubmit, control, getValues, setValue, reset } = useForm();

    const getCartItems = async () => {
      setLoader(true)
          
      let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_CART_ITEMS);
        let { data, response } = res;

        if (data && data.cart_items) {
          setLoader(false)
        
          setCartItems(data.cart_items);
            getCartSummary()
        }
    }

    const getPaymentModes = async () => {
      setLoader(true)
        
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_ALL_PAYMENTS);
        let { data, response } = res;

        if (data) {
            setPaymentModes(data)
            selectPaymentMode(data[0])
            setLoader(false)
        
          }
    }

    const getCartSummary = async (addressId) => {
      
        setLoader(true)
        let queryParam = {
            transaction_id: orderId
        }
        if (addressId) queryParam['address_id'] = addressId

        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.CART_SUMMARY, {
            params: queryParam
        })
        let { data, response } = res;

        if (response && response.status == 400) {
            console.log("enqueueSnackbar",response)
            if(response?.data?.error)
            enqueueSnackbar(response?.data?.error, { variant: 'error' });
            selectAddress()
            setLoader(false)
          }
          
          if (!_.isEmpty(data)) {
          setLoader(false)
            setCartSummary(data)
        }
    }

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

    const proceedOrder = async () => {
        setLoader(true)
        let formData = {
            addressId: selectedAddress.id,
            transactionId: orderId,
            selectedPaymentMode: selectedPaymentMode.id,
            order_notes: ''
        }
        let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.PROCEED_PAYMENT, formData)
        let { data, response } = res;

        // if (response && response.status == 400) {
        //     enqueueSnackbar('Invalid Coupon Code', { variant: 'error' });
        //     setCouponCode('')
        //     getCartSummary();
        // }

        if (!_.isEmpty(data)) {
          console.log("paymentmode", data?.payment_id);
          if (data.checkout_url) {
            window.open(data.checkout_url, "_blank");
            setLoader(false)
          } else if (data?.payment_id) {
           setPaymentid(data?.payment_id) 
           setPaymentstatus(data?.payment_status) 
          //  navigate(`/payment/${data?.payment_id}/${orderId}`);
          setLoader(false)
          } else {
            navigate(`/order-status?orderid=${data.transaction_id}`, {
              state: { order: data },
            });
            setLoader(false)
          }
          
        }
    }
  
    useEffect(() => {
        if (!addressList.length) {
            setViewAddAddress(true)
            setLoader(false)
        } else
            setViewAddAddress(false)
    }, [addressList.length])

    useEffect(() => {
        getCartItems()
        getAddressList()
        getPaymentModes()
    }, [])

    const addShippingAddress = async (formData, e) => {
        if (_.isEmpty(locationPin) || !locationPin.lat || !locationPin.lng) {
            enqueueSnackbar('Select your location in map', { variant: 'error' })
        }
        formData = {
            ...formData,
            latitude: locationPin.lat,
            longitude: locationPin.lng
        }
        if (formData.country_code && !formData.country_code.dial_code) {
            formData = {
                ...formData,
                country_code: GLOBAL_COUNTRY_CODE.dial_code,
            }
        } else if (formData.country_code) {
            formData = {
                ...formData,
                country_code: formData.country_code.dial_code,
            }
        }

        setLoader(true)
        let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.ADD_ADDRESS_LIST, formData);
        let { data, response } = res;

        if (response
            && response.status == 400
            && response.data) {
                for (let i in response.data) {
                    setLoader(false)
                    enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i][0], { variant: 'error' });
                }
            }

        if (data) {
        
            getAddressList();
            setViewAddAddress(false)
            reset()
        }
    }

    useEffect(() => {
        if (!_.isEmpty(selectedAddress)) {
            setLoader(true)
            getCartSummary(selectedAddress.id)
        }
    }, [selectedAddress])

    useEffect(() => {
        if (addressList.length > 0 && cartItems.length > 0 && paymentModes.length && !_.isEmpty(cartSummary))
            setLoader(false)
    }, [addressList.length, cartItems.length, paymentModes.length, cartSummary])

    return (
      <CustomLayout>
        <Loader open={loader} />
        <div className="content-container">
          <CustomBreadcrumbs list={breadcrumbs} name={"Checkout"} />
          <Divider className="divider" />
          <Grid container className="checkout-wrapper main-content-wrapper">
            <Grid container className="stepper-header">
              <div className="stepper-header-content">
                <span className="inactive">SHOPPING CART</span>
                <ArrowForwardIcon />
                <span className="active">CHECKOUT</span>
                <ArrowForwardIcon />
                <span className="inactive">ORDER COMPLETE</span>
              </div>
            </Grid>
            <Grid container className="checkout-content" spacing={10}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={7}
                className="form-container"
              >
                {viewAddAddress ? (
                  <form onSubmit={handleSubmit(addShippingAddress)}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} className="form-title">
                        <span className="title">SHIPPING DETAILS</span>
                      </Grid>
                      {!loader ? (
                        <GoogleMapContainer
                          setValue={setValue}
                          setLoader={setLoader}
                          location={locationPin}
                          selectLocation={selectLocation}
                        />
                      ) : (
                        ""
                      )}
                      <Grid item xs={12} sm={6} className="form-wrapper">
                        <FormLabel>First Name</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            placeholder="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            {...register("first_name", { required: true })}
                            error={errors.first_name?.type}
                            helperText={
                              errors.first_name?.type === "required" &&
                              "First Name is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} className="form-wrapper">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="Enter Last Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            {...register("last_name", { required: true })}
                            error={errors.last_name?.type}
                            helperText={
                              errors.last_name?.type === "required" &&
                              "Last Name is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <FormLabel>House Number</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="House Number and Building Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            {...register("house_number_or_building_number", {
                              required: true,
                            })}
                            error={errors.house_number_or_building_number?.type}
                            helperText={
                              errors.house_number_or_building_number?.type ===
                                "required" && "House  is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <FormLabel>Street address</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="Street Address"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            {...register("street_address", { required: true })}
                            error={errors.street_address?.type}
                            helperText={
                              errors.street_address?.type === "required" &&
                              "Street Address is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <FormLabel>Town / City</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="Enter Town / City"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            {...register("city", { required: true })}
                            error={errors.city?.type}
                            helperText={
                              errors.city?.type === "required" &&
                              "City is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <FormLabel>State</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="Enter State"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled={true}
                            {...register("state", { required: true })}
                            error={errors.state?.type}
                            helperText={
                              errors.state?.type === "required" &&
                              "State is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <FormLabel>Country</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="Enter Country"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled={true}
                            {...register("country", { required: true })}
                            error={errors.country?.type}
                            helperText={
                              errors.country?.type === "required" &&
                              "Country is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <FormLabel>PIN</FormLabel>
                        <FormControl className="form-control">
                          <TextField
                            margin="dense"
                            id="name"
                            placeholder="PIN"
                            type="text"
                            fullWidth
                            variant="outlined"
                            size="small"
                            // disabled={true}
                            {...register("pin", { required: true })}
                            error={errors.pin?.type}
                            helperText={
                              errors.pin?.type === "required" &&
                              "Pincode is required"
                            }
                            InputLabelProps={{ shrink: false }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        fullWidth
                        className="select-wrapper"
                      >
                        <FormLabel>Phone</FormLabel>
                        <FormControl className="form-control">
                          <Controller
                            control={control}
                            name="phone_number"
                            rules={{
                              required: true,
                              maxLength: 10,
                              minLength: 10,
                            }}
                            // defaultValue={contact?.phone_number}
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
                                autoComplete="false"
                                InputLabelProps={{ shrink: false }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        className="select-input"
                                        label="Status"
                                        size="small"
                                        fullWidth
                                        sx={{
                                          ".MuiOutlinedInput-notchedOutline": {
                                            border: 0,
                                          },
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
                                            {"+" + selected.dial_code}
                                          </div>
                                        )}
                                        defaultValue={GLOBAL_COUNTRY_CODE}
                                        {...register("country_code", {
                                          required: true,
                                        })}
                                        error={
                                          getValues()["phone_number"] &&
                                          errors.country_code?.type
                                        }
                                      >
                                        {countryCode.map((code, index) => (
                                          <MenuItem
                                            className="dial-code-wrapper"
                                            value={code}
                                          >
                                            <img src={code.flag} />
                                            {"+" + code.dial_code}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          <span className="error-text">
                            {(errors.phone_number?.type === "required" &&
                              "Mobile number is mandatory") ||
                              (errors.phone_number?.type === "maxLength" &&
                                "Mobile number must be 10 digit in length") ||
                              (errors.phone_number?.type === "minLength" &&
                                "Mobile number must be 10 digit in length")}
                            {/* {getValues()['phone_number'] && errors.country_code?.type === "required" && (
                                                'Country code is required'
                                            )} */}
                          </span>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-wrapper">
                        <Button
                          type="submit"
                          color="secondary"
                          variant="outlined"
                        >
                          Add Address
                        </Button>
                        <Button
                          type="submit"
                          color="error"
                          style={{ marginLeft: "1rem" }}
                          variant="outlined"
                          disabled={addressList.length == 0}
                          onClick={() => setViewAddAddress(false)}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} className="justify-title form-title">
                      <span className="title">
                        Select from Existing Addresses
                      </span>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setViewAddAddress(true);
                          selectLocation();
                          reset();
                        }}
                      >
                        Add new address
                      </Button>
                    </Grid>
                    <Grid item sm={12} className="form-wrapper">
                      <FormControl fullWidth>
                        {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                        >
                          <List className="address-list-wrapper">
                            {addressList.map((address) => (
                              <ListItem key={address.id}>
                                <Radio
                                  onClick={() => selectAddress(address)}
                                  checked={
                                    selectedAddress
                                      ? selectedAddress.id == address.id
                                      : false
                                  }
                                />
                                {showAddress(address)}
                              </ListItem>
                            ))}
                          </List>
                          {/* <FormControlLabel value="male" control={<Radio />} label="Credit / Debit Card" /> */}
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={5}>
                <div className="checkout-summary">
                  <span className="title">YOUR ORDER</span>
                  <Divider className="divider" />
                  {cartItems.map((item, i) => (
                    <div className="calc-wrapper">
                      <div className="product-detail">
                        <div className="image-wrapper">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                          />
                        </div>
                        <div className="detail-wrapper">
                          <span className="product_name">
                            {item.product_name}
                            {/* {_.truncate(item.product_name, { length: 25 })} */}
                          </span>
                          <div className="quantity-wrapper">
                            <span className="quantity">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="description">
                        {formatCurrency.format(item.product_price)}
                      </span>
                    </div>
                  ))}
                  <Divider className="divider" />
                  <div className="calc-wrapper">
                    <span className="description">Total</span>
                    <span className="description">
                      {/* <b>{GLOBAL_CURRENCY.symbol}{_.get(cartSummary, 'cart_total')}</b> */}
                      <b>
                        {formatCurrency.format(
                          _.get(cartSummary, "cart_total", 0) || 0
                        )}
                      </b>
                    </span>
                  </div>
                  <Divider className="divider" />
                  <div className="calc-wrapper">
                    <span className="description">Coupon</span>
                    <span className="description">
                      <b>
                        {formatCurrency.format(
                          _.get(cartSummary, "coupon_discount", 0) || 0
                        )}
                      </b>
                    </span>
                  </div>
                  {selectedAddress ? (
                    <>
                      <div className="calc-wrapper">
                        <span className="description">
                          Price after discount
                        </span>
                        <span className="description">
                          <b>
                            {formatCurrency.format(
                              _.get(cartSummary, "price_after_coupon", 0) || 0
                            )}
                          </b>
                        </span>
                      </div>
                      <Divider className="divider" />
                      <div className="calc-wrapper">
                        <span className="description">Shipping</span>
                        <span className="description">
                          <b>
                            {formatCurrency.format(
                              _.get(cartSummary, "Shipping", 0) || 0
                            )}
                          </b>
                        </span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <Divider className="divider" />
                  <div className="calc-wrapper">
                    <span className="description">Subtotal</span>
                    <span className="total-amt">
                      <b>
                        {formatCurrency.format(
                          _.get(cartSummary, "sub_total", 0)
                        )}
                      </b>
                    </span>
                  </div>
                  {selectedAddress ? (
                    <>
                      <Divider className="divider" />
                      <div className="calc-wrapper">
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                          >
                            {paymentModes.map((mode) => (
                              <FormControlLabel
                                value={mode.id}
                                control={
                                  <Radio
                                    checked={
                                      selectedPaymentMode
                                        ? selectedPaymentMode.id == mode.id
                                        : false
                                    }
                                    onClick={() => {
                                      selectPaymentMode(mode);
                                    }}
                                  />
                                }
                                label={mode.payment_method_name}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <Divider className="divider" />
                      <div className="button-wrapper">
                        {selectedPaymentMode?.payment_method_name ===
                        "Peach Payments" ? (
                          <Button
                            variant="contained"
                            onClick={() => proceedOrder()}
                          >
                            Proceed to Payment
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => proceedOrder()}
                          >
                          
                            Proceed to Payment
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
        {console.log("sticittpay",window)}
      {paymentstatus =="pending"  && 
      <PayButton paymentId={paymentid} storeorderid={orderId} orderId={orderId} setLoader={setLoader}/>}
      </CustomLayout>
    );
}

export default Checkout

// export function PayButton({ paymentId }) {
//   const buttonRef = useRef(null);
//   const [isSDKReady, setSDKReady] = useState(false);
//   const [SticittPaySDK, setsticittPaySDK] = useState();

//   // Function to check if the SDK is loaded
//   const loadSticittPaySDK = () => {
//     if (window.SticittPaySDK) {
//       setSDKReady(true);
//       setsticittPaySDK(window.SticittPaySDK)
//     } else {
//       const sdkScript = document.getElementById("sticitt-pay-sdk");
//       if (sdkScript) {
//         sdkScript.addEventListener("load", () => {
//           setSDKReady(true);
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     loadSticittPaySDK();
//   }, []);

//   useEffect(() => {
//     if (isSDKReady && buttonRef.current) {
//       // Now the SDK is ready, and we can safely register the button
//       SticittPaySDK.AddButton(
//         new SticittPaySDK.PayButton(buttonRef.current, {
//           onPaid: (button, paymentId) => {
//             console.log("Payment successful:", button, paymentId);
//           },
//           onClosed: (button, paymentId) => {
//             console.log("Payment modal closed:", button, paymentId);
//           },
//         })
//       );
//     }
//   }, [isSDKReady, buttonRef]);

//   return (
//     <button ref={buttonRef} data-payment-id={paymentId}>
//       Dynamic Pay Button
//     </button>
//   );
// }


export function PayButton({ paymentId, order_Id, storeorderid, setLoader }) {
  const buttonRef = useRef(null);
  const [isSDKReady, setSDKReady] = useState(false);
  const [SticittPaySDK, setsticittPaySDK] = useState();
  const [SticittPay, setsticittPay] = useState(true);
  const navigate = useNavigate();
  
  const { enqueueSnackbar } = useSnackbar();
  // Function to check if the SDK is loaded
  const loadSticittPaySDK = () => {
    if (window.SticittPaySDK) {
      setSDKReady(true);
      setsticittPaySDK(window.SticittPaySDK);
    } else {
      const sdkScript = document.getElementById("sticitt-pay-sdk");
      if (sdkScript) {
        sdkScript.addEventListener("load", () => {
          setSDKReady(true);
        });
      }
    }
  };

  const handleClose=()=>{
    setsticittPay(!SticittPay);
  }
 

  const handlecancelpay = useCallback(async () => {
    try {
      // handleClose();
      setLoader(true)
      console.log("handleRedirect called"); 
      let res = await instance.post("/sticitt_pay/cancel-sticitt-payment/", {
          transaction_id: order_Id ? order_Id : storeorderid,
      });
      let { data } = res;
      console.log("Navigating to order-status with:", data);
      if (data && data?.message ==="Payment Cancelled successfully." ) {
        // enqueueSnackbar(data?.message, { variant: 'success' });
        // navigate(`/order-status?orderid=${order_Id ? order_Id : storeorderid}`, {
        //   state: { order: data },
        // });
        handleRedirect()
        // setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.error("Error fetching payment status:", error);
    }
  }, [order_Id, storeorderid, navigate]);



  useEffect(() => {
    loadSticittPaySDK();
  }, []);

  const handleRedirect = useCallback(async () => {
    try {
      handleClose();
      // setLoader(true)
      // console.log("handleRedirect called"); 
      // let res = await instance.get("/sticitt_pay/sticitt-payment-status/", {
      //   params: {
      //     transaction_id: order_Id ? order_Id : storeorderid,
      //   },
      // });
      // let { data } = res;
      // console.log("Navigating to order-status with:", data?.data?.transaction_id);
      // if (data && data?.data && data?.data?.transaction_id) {
        navigate(`/order-status?orderid=${order_Id ? order_Id : storeorderid}`)
          // state: { order: data },
      //   });
      //   setLoader(false)
      // }
    } catch (error) {
      setLoader(false)
      console.error("Error fetching payment status:", error);
    }
  }, [order_Id, storeorderid, navigate]);

  useEffect(() => {
    if (isSDKReady && buttonRef.current) {
      // Now the SDK is ready, and we can safely register the button
      SticittPaySDK.AddButton(
        new SticittPaySDK.PayButton(buttonRef.current, {
          onPaid: (button, paymentId) => {
            console.log("Payment successful:", button, paymentId);
            
            handleRedirect(); // Redirect after payment success
          },
          onClosed: (button, paymentId) => {
            console.log("Payment modal closed:", button, paymentId); // Log to check if called
            handleRedirect(); // Redirect when the modal is closed
          },
        })
      );
    }
  }, [isSDKReady, buttonRef, SticittPaySDK, handleRedirect]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };
  return (
    <Modal open={SticittPay}>
    <Box sx={style}>
      {/* Close Button with Icon */}
      <IconButton
        aria-label="close"
        onClick={handlecancelpay}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon /> 
      </IconButton>

    
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <img src={require('assets/icons/sticittpaylogo.png')} alt="Logo" width="200" />
      </Box>

      {/* Modal Content */}
      <Typography variant="h6" component="h2" align="center">
        Payment Information
      </Typography>
      <Typography sx={{ mt: 2, mb: 4 }} align="center">
        Complete your payment by clicking the button below.
      </Typography>

      {/* Pay Button */}
      <Button
        ref={buttonRef}
        variant="contained"
        color="primary"
        data-payment-id={paymentId}
        fullWidth
      >
        Pay with sticitt
      </Button>
    </Box>
  </Modal>
  );
}
