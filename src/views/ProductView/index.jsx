import React, { useState, useEffect, forwardRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

import { 
    Grid,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Slide
} from '@mui/material';
import moment from 'moment';

import CustomLayout from 'views/CustomLayout';
import CustomBreadcrumbs from "components/Breadcrumbs";
import VerticalTabs from 'components/VerticalTabs';
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';

import CloseIcon from '@mui/icons-material/Close';
import { updateCartCount } from 'utils/website';
import { handleOpenAuthDialog } from 'utils/auth';
import { GLOBAL_CURRENCY } from 'constants/appConstants';
import { addCartItemsToLocalStorage } from 'utils/cart';
import { getAccessToken } from 'utils';
import FlagContent from 'components/InappropriateContent';

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: GLOBAL_CURRENCY.code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const getImageThumbnail = (imageUrl) => {
    var image = _.split(imageUrl, ' ~ ')
    return image;
}

const getNextDate = (days) => {
    let date = moment();
    let next_date = date.add(days, 'day');
    return moment(next_date).format(" ddd[,] D MMM")
}

const ProductView = (props) => {
    const [loader, setLoader] = useState(false);
    let { productId } = useParams();
    const [product, setProductDetail] = useState({});
    let { breadcrumbs } = props;
    let [imageList, setImageList] = useState([]);
    let [selectedImage, selectImage] = useState('');
    const [askLogin, openAskLogin] = useState(false);
    const loggedInUser = useSelector(state => state.userDetails);
    const { user } = loggedInUser;
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    var token = getAccessToken();

    const getProductDetail = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_PRODUCT(productId));
        let { data, response } = res;
    
        if (!_.isEmpty(data)) {
            setProductDetail(data)
        }
        setLoader(false)
    }
    
    useEffect(() => {
        if (productId) getProductDetail()
    }, [productId])

    useEffect(() => {   
        if (!_.isEmpty(product)) {
            var { images } = product;
            setImageList(images);
            selectImage(images[0]);
        }
    }, [product])

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const addToCart = async (product) => {
        setLoader(true)
        if (!token) {
            addCartItemsToLocalStorage(product)
            updateCartCount(true)
            getProductDetail()
            // await delay(5000);
            enqueueSnackbar('Hey, this feels great! Product has been added to the cart.', { variant: 'success' })
        } else {
            let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.ADD_TO_CART, {
                product_id: product.id
            });
            let { data, response } = res;

            if (response 
                && response.status === 400
                && response.data ) {
                    if (response.data.error) {
                        enqueueSnackbar(response.data.error, { variant: 'error' })
                    } else
                        for (let i in response.data) {
                            enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i][0], { variant: 'error' });
                        }
            }

            if (data) {
                enqueueSnackbar('Hey, this feels great! Product has been added to the cart.', { variant: 'success' })
                updateCartCount(true)
            }
        }

        setLoader(false)
    }

    const handleAddToCart = () => {
        addToCart(product)
    }

    return (
      <CustomLayout>
        <Loader open={loader} />
        <div className="catalog-wrapper content-container">
          <CustomBreadcrumbs
            list={breadcrumbs}
            name={`${_.truncate(product.name, { length: 40 })}`}
          />
          <Divider className="divider" />
          {/* {!loader ?  */}
          <Grid container className="main-content-wrapper product-view-wrapper">
            <Grid
              item
              lg={5}
              md={6}
              sm={12}
              xs={12}
              className="image-display-wrapper"
            >
              <VerticalTabs
                type="image"
                itemList={imageList}
                selectedItem={selectedImage}
              />
            </Grid>
            <Grid
              item
              lg={7}
              md={6}
              sm={12}
              xs={12}
              className="description-wrapper"
            >
              <span className="title">{product.name}</span>
              <br />
              {product.discount ? (
                <div className="price-wrapper">
                  <span className="price">${product.price}</span>
                  <span className="offer">${product.offer}</span>
                  <span className="discount">{product.discount}%</span>
                </div>
              ) : (
                <div className="price-wrapper">
                  <span className="offer">
                    <b>{formatCurrency.format(product.price || 0)}</b>
                  </span>
                </div>
              )}
              {/* <p className='description'>{product.description}</p> */}
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              {/* <br /> */}
              <span className="description">
                Category: {product.category_name}
              </span>
              <br />
              <span className="description">
                Expected delivery by:
                {getNextDate(product.order_processing_days)}
              </span>
              <br />
              <br />
              {product.count == 0 ? (
                <span className="inventory-text">Out of Stock</span>
              ) : product.count < 6 ? (
                <span className="inventory-text">
                  Only {product.count} item(s) left
                </span>
              ) : (
                ""
              )}
              {product.count != 0 ? (
                <div className="product-action">
                  <div className="button-wrapper">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAddToCart()}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="button-wrapper">
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => {
                        handleAddToCart();
                        navigate("/cart");
                      }}
                    >
                      {/* onClick={() => navigate("/cart")}> */}
                      Buy now
                    </Button>
                  </div>
                  <div className="button-wrapper">
                  <FlagContent  product={product} productName={product?.name} />
                  </div>
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
          {/* : ''} */}
        </div>
        {/* <Dialog 
                open={askLogin} 
                TransitionComponent={Transition}
                onClose={() => {

                }}
                className='login-dialog-wrapper'>
                    <DialogTitle disableTypography className='login-dialog-title'>
                        <IconButton onClick={() => {
                            openAskLogin(false)
                        }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                <DialogContent className='dialog-content'>
                    <DialogContentText id="alert-dialog-slide-description">
                        <span>Please Login to continue</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-action'>
                    <Button 
                        variant='contained' 
                        color="error" 
                        size="small" 
                        onClick={() => {
                            openAskLogin(false)
                            handleOpenAuthDialog(true)
                        }}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog> */}
        {/* <h2>Product View</h2> */}
      </CustomLayout>
    );
}

export default ProductView;