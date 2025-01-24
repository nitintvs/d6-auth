import { useState, useEffect } from "react";
import _ from 'lodash';

import { Button, Container, Card, CardContent, Typography, CardMedia, CardActions, Grid, Box, Modal, TextField, MenuItem, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import CustomLayout from "views/CustomLayout";
import Carousel from "components/Carousel";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants, authRouteConstants } from 'constants/routeConstants';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GLOBAL_CURRENCY } from "constants/appConstants";
import ProductList from "./ProductList";
import ProductCard from "./ProductCard";
import { isMobile } from "react-device-detect";
import instance from "configs/axiosConfig";

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: GLOBAL_CURRENCY.code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
});

const DetailCard = ({ product }) => {
    var navigate = useNavigate();
    return (
        <div className="slider-card">
            <Card className="content-card">
                <CardMedia
                    sx={{ height: '200px' }}
                    // sx={{   height: '375px' }}
                    title={product?.name}
                >
                    <img src={product?.product_image} />
                </CardMedia>
                <CardContent align="left" sx={{ marginTop: '0.5rem' }}>
                    <Typography
                        sx={{
                            display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "flex" },
                        }}
                        gutterBottom component="span">
                        {_.truncate(_.trim(product.name), { length: 25 })}
                    </Typography>
                    <Typography
                        sx={{
                            display: { xs: "none", sm: "none", md: "none", lg: "flex", xl: "none" },
                            fontSize: '0.8rem !important',
                            minHeight: "50px"
                        }}
                        gutterBottom component="span">
                        {_.truncate(_.trim(product.name), { length: 30 })}
                    </Typography>
                    <Typography
                        sx={{
                            display: { xs: "none", sm: "none", md: "flex", lg: "none", xl: "none" },
                            fontSize: '1rem'
                        }}
                        gutterBottom component="span">
                        {_.truncate(_.trim(product.name), { length: 28 })}
                    </Typography>
                    <Typography
                        sx={{
                            display: { xs: "none", sm: "flex", md: "none", lg: "none", xl: "none" },
                            fontSize: '0.9rem'
                        }}
                        gutterBottom component="span">
                        {_.truncate(_.trim(product.name), { length: 22 })}
                    </Typography>
                    <Typography
                        sx={{
                            display: { xs: "flex", sm: "none", md: "none", lg: "none", xl: "none" }
                        }}
                        gutterBottom component="span">
                        {_.truncate(_.trim(product.name), { length: 40 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {/* <b>{GLOBAL_CURRENCY.symbol}{product?.price}</b> */}
                        <b>{formatCurrency.format(product?.price || 0)}</b>
                    </Typography>
                </CardContent>
                <CardActions align="center">
                    {/* <Button size="small">Wishlist</Button> */}
                    <Button
                        color="success"
                        size="small"
                        onClick={() => {
                            navigate(`/product/${product.id}`)
                        }}
                        variant="outlined">View</Button>
                </CardActions>
            </Card>
        </div>
    )
}

const DraftSection = ({ title, description, collection, style = {} }) => (
    collection.length > 0 ?
        <Container className="draft-section center" sx={style}>
            <div className="title-section center">
                <span className="title">
                    {title}
                </span>
                <br />
                {description && <p className="description">
                    {description}
                </p>}
            </div>
            {/* <div className="content-section">{
                isMobile ?
                    <Grid container padding={"10px"} spacing={1}>
                        {collection?.map(product => (
                            <Grid item xs={6} marginTop={1} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                    :
                    <Carousel>
                        {collection.length>0 && collection?.map(product =>
                            <DetailCard
                                product={product} />
                        )}
                    </Carousel>
            }
            </div> */}
        </Container>
        : ''
)

const bgImage = require("../../assets/images/background.jpg");
// "test"
const ResponsiveBgBox = ({ websiteInfo, ...props }) => (
    <>
        <Box
            sx={{
                display: { xs: 'none', sm: 'none', md: 'block' },
                backgroundImage: _.get(websiteInfo, 'banner', '')
                    ? `url(${_.get(websiteInfo, 'banner')})`
                    : `url(${bgImage})`
            }}
            className="banner-content">
            {props.children}
        </Box>
        <Box
            sx={{
                display: { xs: 'block', sm: 'block', md: 'none' }
            }}
            className="banner-overlay"
        >
            <img className="banner-image" src={_.get(websiteInfo, 'banner')} />
            <div className="banner-detail">
                {props.children}
            </div>
        </Box>
    </>
)

const Landing = () => {
    const [loader, setLoader] = useState(false);
    const webDetails = useSelector(state => state.webDetails);
    const { websiteInfo } = webDetails;
    const [topCollection, setTopCollection] = useState([]);
    const [featureCollection, setFeatureCollection] = useState([]);
    const [hasMobileUpdateModal, setHasMobileUpdateModal] = useState(false);
    const navigate = useNavigate();


    function updateMetaDescription(newDescription) {
        const metaDescriptionTag = document.querySelector("meta[name='description']");
        if (metaDescriptionTag) {
            metaDescriptionTag.setAttribute('content', newDescription);
        } else {
            // If it doesn't exist, create it
            const newMetaTag = document.createElement('meta');
            newMetaTag.setAttribute('name', 'description');
            newMetaTag.setAttribute('content', newDescription);
            document.head.appendChild(newMetaTag); // Append it to the head
        }
    }

       // Function to update the favicon
       function updateFavicon(newFavicon) {
        const faviconLink = document.getElementById("favicon");
        if (faviconLink) {
            faviconLink.setAttribute('href', newFavicon);
        } else {
            const newFaviconLink = document.createElement('link');
            newFaviconLink.setAttribute('rel', 'icon');
            newFaviconLink.setAttribute('href', newFavicon);
            document.head.appendChild(newFaviconLink);
        }
    }

    // Function to update the apple-touch-icon
    function updateAppleTouchIcon(newAppleTouchIcon) {
        const appleTouchIconLink = document.getElementById("apple-touch-icon");
        if (appleTouchIconLink) {
            appleTouchIconLink.setAttribute('href', newAppleTouchIcon);
        } else {
            const newAppleTouchIconLink = document.createElement('link');
            newAppleTouchIconLink.setAttribute('rel', 'apple-touch-icon');
            newAppleTouchIconLink.setAttribute('href', newAppleTouchIcon);
            document.head.appendChild(newAppleTouchIconLink);
        }
    }

    // Function to update the manifest
    function updateManifest(newManifest) {
        const manifestLink = document.getElementById("manifest");
        if (manifestLink) {
            manifestLink.setAttribute('href', newManifest);
        } else {
            const newManifestLink = document.createElement('link');
            newManifestLink.setAttribute('rel', 'manifest');
            newManifestLink.setAttribute('href', newManifest);
            document.head.appendChild(newManifestLink);
        }
    }

    useEffect(()=>{
        if(webDetails && webDetails?.websiteInfo?.store_name==="The Vet Store"){
            document.title="The Vet Store"
            updateMetaDescription("The Vet Store")
            updateFavicon("/favicon1.ico"); // Fallback to default favicon
            updateAppleTouchIcon("/vetstore-512x512.png"); // Fallback to default apple-touch-icon
            updateManifest("/manifestvet.json"); // Fallback to default manifest
        }
    },[webDetails])
    useEffect(()=>{
        const D6USERDATA= localStorage.getItem("d6_user_data")
        if(D6USERDATA == "false"){
            setHasMobileUpdateModal(true)
        }
        // if(webDetails && webDetails?.websiteInfo?.store_name==="The Vet Store"){
            // }
            console.log("hasMobileUpdateModal", typeof D6USERDATA, D6USERDATA )    
        },[webDetails])
        console.log("hasMobileUpdateModal",hasMobileUpdateModal, typeof hasMobileUpdateModal )    
console.log("document",document)
    const getTopCollection = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.TOP_COLLECTION);
        let { data, response } = res;

        if (data) {
            setTopCollection(data)
        }
        setLoader(false)
    }

    const getFeatureCollection = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.FEATURE_COLLECTION);
        let { data, response } = res;

        if (data) {
            setFeatureCollection(data)
        }
        setLoader(false)
    }

    useEffect(() => {
        getTopCollection();
        getFeatureCollection();
    }, []);

    return (
        <CustomLayout>
            <Loader open={loader} />
            <Box className="banner-section">
                <ResponsiveBgBox websiteInfo={websiteInfo}>
                    <Grid container>
                        <Grid item md={9} sm={12} xs={12} className="title-section container">
                            <div className="title-content-section">
                                <span className="title">
                                    Welcome to {_.get(websiteInfo, 'store_name')}!
                                </span>
                                <br />
                                <p className="description">
                                    {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. */}
                                </p>
                                <Button
                                    className="explore-btn"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={() => navigate("/products")}>
                                    Explore
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </ResponsiveBgBox>
            </Box>
            <DraftSection
                title="Top Collection"
                collection={topCollection}
                description="These top favorites have been flying off the shelves! Grab them now. Don't miss out on the trendiest and most sought-after products - shop today!"
            />
            <DraftSection
                title="Featured"
                collection={featureCollection}
                style="background-color: rgba(0,0,0,0.1); margin-bottom: 3rem"
                description="Discover our curated collection of must-have products. Shop now and redefine your world with us."
            />
            <D6UpdateMobileModal isDialogOpen={hasMobileUpdateModal} setDialogOpen={setHasMobileUpdateModal}  />
        </CustomLayout>
    );
};

export default Landing;




const D6UpdateMobileModal = ({ isDialogOpen, setDialogOpen }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("27"); // Default country code
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
console.log("hasMobileUpdateModal",isDialogOpen,typeof isDialogOpen)
  const handleUpdate = async () => {
    if (!mobileNumber) {
      setError("Mobile number is required.");
      return;
    }
    if (mobileNumber.length > 10 || mobileNumber.length < 10 ) {
        setError("Mobile number must be 10 digits.");
      return;
    }
    const token= localStorage.getItem("u-access-token")
    setLoading(true);
    try {
      const response = await axiosInstance.put(APIRouteConstants.AUTH.D6_UPDATE_PHONE, {
          mobile_number:mobileNumber,
          country_code:countryCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      console.log("API Response:", response.data);
      if(response.data){
        localStorage.setItem("d6_user_data",JSON.stringify(true))
    setError("");
          setDialogOpen(false)
          // Navigate or take further actions on success
          window.location.reload()
        }
    } catch (error) {
      console.error("Error updating mobile number:", error);
      setError("Failed to update the mobile number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Modal open={isDialogOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "80%", sm: "75%", md: "50%", lg: "40%" },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          {/* Header Section */}
          <Grid container alignItems="center" spacing={0} sx={{ mb: 4 }}>
            <Typography variant="body1" textAlign="left" sx={{ width: "100%" }}>
              Please update your mobile number (mandatory)!
            </Typography>
          </Grid>

          {/* Modal Content */}
          <Grid container direction="column" alignItems="center">
            {/* Country Code Dropdown and Mobile Number Input */}
            <Grid item xs={12} sx={{ width: "100%", mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                  size="small"
                    select
                    fullWidth
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    label="Country Code"
                  >
                    <MenuItem value="27">27 (SA)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    size="small"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    label="Mobile Number"
                    type="tel"
                    error={!!error}
                    helperText={error}
                  />
                  {console.log("error",error)}
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ width: "100%", mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdate}
                sx={{ textTransform: "none" }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Update Mobile Number"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
