import { useState, useEffect, forwardRef, useRef } from 'react'

import { 
    Divider,
    Grid,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableBody,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Slide,
    Box
} from '@mui/material';
import _ from 'lodash';
import { useSnackbar } from 'notistack';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import { useNavigate } from 'react-router-dom';
import { updateCartCount } from 'utils/website';
import { GLOBAL_CURRENCY } from 'constants/appConstants';
import { getAccessToken } from 'utils';
import { 
    updateCartItemsToLocalStorage,
    removeCartItemsFromLocalStorage,
    clearCart,
    getCartItemsFromLocalStorage,
    getCartSummaryFromLocalStorage
} from 'utils/cart';
import { handleOpenAuthDialog } from 'utils/auth';
import { useSelector } from 'react-redux';

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: GLOBAL_CURRENCY.code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const Cart = ({ breadcrumbs }) => {
    const [loader, setLoader] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartSubTotal, setSubTotal] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [couponCode, setCouponCode] = useState();
    const [appliedCouponCode, applyCouponCode] = useState();
    const [cartSummary, setCartSummary] = useState();
    const [askLogin, openAskLogin] = useState(false);
    const [showEmpty, setEmptyCart] = useState(false);

    const { user } = useSelector(state => state.userDetails);
    const prevUserRef = useRef(user);

    var token = getAccessToken();

    useEffect(() => {
        if (_.isEmpty(prevUserRef.current) && !_.isEmpty(user)) {
            let cartItem = getCartItemsFromLocalStorage();
            if (!_.isEmpty(cartItem)) syncCartFromLocalStorage()
            else getCartItems()
        }
        prevUserRef.current = user;
    }, [user])

    const syncCartFromLocalStorage = async () => {
        setLoader(true)
        let cartItems = getCartItemsFromLocalStorage();
        cartItems = _.map(cartItems, product => ({
            product: product.id,
            quantity: product.quantity
        }))
        let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.UPDATE_CART_ITEMS_LOCAL_STORAGE, cartItems);
        let { data, response } = res;

        if (!_.isEmpty(data)) {
            clearCart()
            getCartItems()
            updateCartCount(true);
        }
    }

    const getCartItems = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_CART_ITEMS);
        let { data, response } = res;

        if (data && data.cart_items) {
            setCartItems(data.cart_items);
            if (data.cart_items.length == 0) {
                setEmptyCart(true)
            } else setEmptyCart(false)
            getOutOfStock(data.cart_items)
            setSubTotal(data.subtotal_price);
        }
        getCartSummary()
        setLoader(false)
    }

    const getCartItemsFromLS = () => {
        let items = getCartItemsFromLocalStorage()
        setCartItems(items)
        if (items.length == 0) setEmptyCart(true)
        setCartSummary(getCartSummaryFromLocalStorage())
        getOutOfStock(cartItems)
    }

    const updateCartItems = async (cartItemId, action) => {
        setLoader(true)
        let res = await axiosInstance.put(APIRouteConstants.DASHBOARD.UPDATE_CART_ITEMS(cartItemId), null, {
            params: { action: action },
        });
        let { data, response } = res;

        if (data) {
            getCartItems();
            updateCartCount(true);
        }
    }

    const updateCartItemsToLS = (product, action) => {
        updateCartItemsToLocalStorage(product, action)
        updateCartCount(true);
        getCartItemsFromLS()
    }

    const removeCartItem = async (cartItemId) => {
        setLoader(true)
        let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.REMOVE_CART_ITEMS(cartItemId));
        let { data, response } = res;

        if (data) {
            getCartItems();
            updateCartCount(true);
        }
    }

    const deleteCartItemFromLocalStorage = (product) => {
        removeCartItemsFromLocalStorage(product)
        updateCartCount(true);
        getCartItemsFromLS()
    }

    const getCartSummary = async (coupon) => {
        setLoader(true)
        let queryParam = {}
        if (coupon) queryParam['voucher_code'] = coupon
        else if (appliedCouponCode && !coupon) queryParam['voucher_code'] = appliedCouponCode

        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.CART_SUMMARY, {
            params: queryParam
        })
        let { data, response } = res;

        if (response && response.status == 400) {
            enqueueSnackbar('Invalid Coupon Code', { variant: 'error' });
            setCouponCode('')
            getCartSummary();
        }

        if (!_.isEmpty(data)) {
            setCartSummary(data)
            if (coupon) applyCouponCode(coupon)
            setLoader(false)
        }
    }

    const [outOfStock, setOutOfStock] = useState(false);

    const getOutOfStock = (items) => {
        let isOutOfStock = false;
        for (let item of items) {
            if (item.quantity > item.count) {
                isOutOfStock = true;
            }
        }
        setOutOfStock(isOutOfStock)
     }

    const checkoutCart = async () => {
        setLoader(true)
        let formData = {}
        if (couponCode) formData['voucher_code'] = couponCode

        let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.CHECKOUT, formData)
        let { data, response } = res;

        if (!_.isEmpty(data)) {
            navigate("/checkout", { state: {
                orderId: data.transaction_id
            }})
        }
        setLoader(false)
    }

    useEffect(() => {
        if (token)
            getCartItems()
        else
            getCartItemsFromLS()
    }, [])

    return (
        <CustomLayout>
            <Loader open={loader} />
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={"Cart"} />
                <Divider className="divider"/>
                <Grid container className="cart-wrapper main-content-wrapper">
                    <Grid container className="stepper-header">
                        <div className='stepper-header-content'>
                            <span className='active'>
                                SHOPPING CART
                            </span>
                            <ArrowForwardIcon />
                            <span className='inactive'>
                                CHECKOUT
                            </span>
                            <ArrowForwardIcon />
                            <span className='inactive'>
                                ORDER COMPLETE
                            </span>
                        </div>
                    </Grid>
                    {showEmpty ? <Grid container className="empty-wrapper">
                        <div className="icon-wrapper">
                            <AddShoppingCartIcon /> 
                        </div>
                        <span className="title">
                            YOUR CART IS CURRENTLY EMPTY
                        </span> <br />
                        <span className="description">
                            Please add some products to your shopping cart before proceeding to checkout. 
                        </span>
                        <span className="description">
                            Browse our shop categories to discover new arrivals and special offers. 
                        </span>
                        <div className='button-wrapper'>
                            <Button variant="contained" href='/products'>
                                RETURN TO SHOP
                            </Button>
                        </div>
                    </Grid> :
                    <Grid container className="cart-content" spacing={10}>
                        <Grid item xs={12} sm={12} md={12} lg={8}>
                            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                            <TableContainer component={Paper} className='cart-table'>
                                <Table aria-label="simple table">
                                    <TableHead className='cart-table-header'>
                                        <TableRow>
                                            <TableCell width="60%" padding="normal">
                                                <div className='header'>
                                                    PRODUCT
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                QUANTITY
                                            </TableCell>
                                            <TableCell align="right">
                                                SUBTOTAL
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item, i) =>
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <div className='product-detail'>
                                                        <div className='icon-wrapper'>
                                                            <IconButton
                                                                onClick={() => {
                                                                    if (token)
                                                                        removeCartItem(item.id)
                                                                    else
                                                                        deleteCartItemFromLocalStorage(item)
                                                                }}
                                                                aria-label="close" >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </div>
                                                        <div 
                                                            className={item.count == 0 || item.count < item.quantity ? 'greyout image-wrapper' : 'image-wrapper'}
                                                        >
                                                            <img src={item.product_image} alt={item.product_name || item.name} />
                                                        </div>
                                                        <div className="detail-wrapper">
                                                            <span className='title'>
                                                                {_.truncate(item.product_name || item.name, { length: 40 })}
                                                            </span>
                                                            <span>{formatCurrency.format(item.product_price || item.price)}</span>
                                                            {item.count !== 0 && item.count < 6 ?
                                                            <div className="inventory-text">
                                                                <span>
                                                                    Only {item.count} left
                                                                </span>
                                                            </div>
                                                            : item.count == 0 ?
                                                            <div className="inventory-text">
                                                                <span>
                                                                    Out of Stock
                                                                </span>
                                                            </div>
                                                            : '' }
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div className='button-group'>
                                                        <Button 
                                                            onClick={() => {
                                                                if (token) updateCartItems(item.id, 0)
                                                                else updateCartItemsToLS(item, 0)
                                                            }}
                                                            variant="outlined" 
                                                            size="small">
                                                            -
                                                        </Button>
                                                        <Button disabled variant="contained" size="small">
                                                            {item.quantity}
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                if (token) updateCartItems(item.id, 1)
                                                                else updateCartItemsToLS(item, 1)
                                                            }} 
                                                            className={item.count == 0 || item.count <= item.quantity ? 'greyout' : ''}
                                                            disabled={item.count == 0 || item.count <= item.quantity}
                                                            variant="outlined" 
                                                            size="small">
                                                            +
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right" className={item.count == 0 || item.count < item.quantity ? 'greyout' : ''}>
                                                    <span className="price">
                                                        <b>{formatCurrency.format(item.product_subtotal_price || (item.price * item.quantity))}</b>
                                                    </span>
                                                </TableCell>
                                                
                                                {/* <div className='overlay-card'>
                                                    <Button style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} variant="outlined" color="error">
                                                        <b>Out of Stock</b>
                                                    </Button>
                                                </div> */}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Box>
                            <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
                            <TableContainer component={Paper} className='cart-table'>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        {cartItems.map((item, i) =>
                                            <TableRow key={i}>
                                                <TableCell className='mobile-table-wrapper'>
                                                    <div className='product-detail'>
                                                        <div 
                                                            className={item.count == 0 || item.count < item.quantity ? 'greyout image-wrapper' : 'image-wrapper'}
                                                        >
                                                            <img src={item.product_image} alt={item.product_name || item.name} />
                                                        </div>
                                                        <div className="detail-wrapper">
                                                            <span className='title'>
                                                                {_.truncate(item.product_name || item.name, { length: 40 })}
                                                            </span>
                                                            <span>{formatCurrency.format(item.product_price || item.price)}</span>
                                                            {item.count !== 0 && item.count < 6 ?
                                                            <div className="inventory-text">
                                                                <span>
                                                                    Only {item.count} left
                                                                </span>
                                                            </div>
                                                            : item.count == 0 ?
                                                            <div className="inventory-text">
                                                                <span>
                                                                    Out of Stock
                                                                </span>
                                                            </div>
                                                            : '' }
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>                                                            <div className='button-group'>
                                                                <Button 
                                                                    onClick={() => {
                                                                        if (token) updateCartItems(item.id, 0)
                                                                        else updateCartItemsToLS(item, 0)
                                                                    }}
                                                                    variant="outlined" 
                                                                    size="small">
                                                                    -
                                                                </Button>
                                                                <Button disabled variant="contained" size="small">
                                                                    {item.quantity}
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        if (token) updateCartItems(item.id, 1)
                                                                        else updateCartItemsToLS(item, 1)
                                                                    }} 
                                                                    className={item.count == 0 || item.count <= item.quantity ? 'greyout' : ''}
                                                                    disabled={item.count == 0 || item.count <= item.quantity}
                                                                    variant="outlined" 
                                                                    size="small">
                                                                    +
                                                                </Button>
                                                            </div>
                                                            <span style={{ marginLeft: '1rem' }} className="price">
                                                                <b>{formatCurrency.format(item.product_subtotal_price || (item.price * item.quantity))}</b>
                                                            </span>
                                                            </div>

                                                        </div>
                                                        <div className='icon-wrapper'>
                                                            <IconButton
                                                                onClick={() => {
                                                                    if (token)
                                                                        removeCartItem(item.id)
                                                                    else
                                                                        deleteCartItemFromLocalStorage(item)
                                                                }}
                                                                aria-label="close" >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                
                                                {/* <div className='overlay-card'>
                                                    <Button style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} variant="outlined" color="error">
                                                        <b>Out of Stock</b>
                                                    </Button>
                                                </div> */}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Box>
                        </Grid>
                        <Grid item className='coupon-conatiner' xs={12} sm={12} md={12} lg={4}>
                            <Grid container className="coupon-wrapper">
                                <Grid item xs={9}>
                                    <div className='form-wrapper'>
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            placeholder="Coupon Code"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            defaultValue={couponCode}
                                            value={couponCode}
                                            disabled={!token}
                                            // onBlur={() => }
                                            onChange={e => setCouponCode(e.target.value)}
                                            InputLabelProps={{ shrink: false }}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={3} className={!token ? 'greyout button-wrapper' : 'button-wrapper'}>
                                    <Button
                                        variant="outlined"
                                        className='coupon-btn'
                                        disabled={!token}
                                        onClick={() => getCartSummary(couponCode)}
                                    >
                                        APPLY 
                                    </Button>
                                </Grid>
                                {!token ?
                                <Grid item xs={12} style={{ margin: '-0.5rem 0 1.5rem 0' }} className='error-text'>
                                    <span>*** Please <a style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }} onClick={() => handleOpenAuthDialog(true)}>login</a> to apply additional offers.</span>
                                </Grid> : ''}
                            </Grid>
                            <div className='cart-summary'>
                                <span className='title'>
                                    CART TOTAL
                                </span>
                                <Divider className='divider'/>
                                {/* <div className='calc-wrapper'>
                                    <span className='description'>
                                        Total
                                    </span>
                                    <span className='description'>
                                        <b>{formatCurrency.format(_.get(cartSummary, 'cart_total'))}</b>
                                    </span>
                                </div>
                                <Divider className='divider'/>
                                <div className='calc-wrapper'>
                                    <span className='description'>
                                        Coupon
                                    </span>
                                    <span className='description'>
                                        <b>{formatCurrency.format(_.get(cartSummary, 'coupon_discount'))}</b>
                                    </span>
                                </div> */}
                                {/* <Divider className='divider'/> */}
                                <div className='calc-wrapper'>
                                    <span className='description'>
                                        Subtotal
                                    </span>
                                    <span className='description'>
                                        <b>{formatCurrency.format(_.get(cartSummary, 'cart_total'))}</b>
                                    </span>
                                </div>
                                {outOfStock ?
                                <div className='error-text'>
                                    <span>*** Some items from your cart are out of stock. Please review your cart.</span>
                                </div> : ''}
                                <div className='button-wrapper'>
                                    <Button 
                                        disabled={_.isEmpty(cartItems)}
                                        variant="contained"
                                        onClick={() => {
                                            if (token)
                                                checkoutCart()
                                            else
                                                handleOpenAuthDialog(true)
                                        }}
                                    >
                                        Proceed to checkout
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                    </Grid> }
                </Grid>
            </div>
            <Dialog 
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
            </Dialog>
        </CustomLayout>
    )
}

export default Cart