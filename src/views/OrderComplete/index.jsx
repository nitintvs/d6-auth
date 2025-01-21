import React, { useEffect, useState } from 'react'

import { 
    Divider,
    Grid,
    Button
} from '@mui/material';

import _ from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import { GLOBAL_CURRENCY } from 'constants/appConstants';

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: GLOBAL_CURRENCY.code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
});

function queryStringToJSON(search) {
    if (!search) return {}
    var qs = search.slice(1);

    var pairs = qs.split('&');
    var result = {};
    pairs.forEach(function(p) {
        var pair = p.split('=');
        var key = pair[0];
        var value = decodeURIComponent(pair[1] || '');

        if( result[key] ) {
            if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                result[key].push( value );
            } else {
                result[key] = [result[key], value ];
            }
        } else {
            result[key] = value;
        }
    });

    return JSON.parse(JSON.stringify(result));
};

const OrderComplete = ({ breadcrumbs }) => {
    const [loader, setLoader] = useState(true);
    const [order, setOrder] = useState();
    const { search } = useLocation();
    const query = queryStringToJSON(search);
    const { orderid } = query;
    const [orderStatus, setOrderStatus] = useState('COMPLETE');

    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);

    const getOrderStatus = async () => {
        // setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_ORDER_DETAIL, {
            params: {
                transaction_id: orderid
            }
        });
        let { data, response } = res;

        if (response && response.status == 404) {
            setOrderStatus(_.upperCase(response.statusText))
        }
        
    console.log("orderstatus",data.data.payment_status)
        if (!_.isEmpty(data) && data.data) {
            setOrder(data.data)
            if (data.data.payment_status == "failed") {
                setOrderStatus(_.upperCase(data.data.payment_status))
            } 
            if (data.data.payment_status == "expired") {
                setOrderStatus(_.upperCase(data.data.payment_status))
            } 
            if (data.data.payment_status == "unknown") {
                setOrderStatus(_.upperCase(data.data.payment_status))
            } 
            if (data.data.payment_status == "pending") {
                setOrderStatus(_.upperCase(data.data.payment_status))
            } 
            if (data.data.payment_status == "successful") {
                setOrderStatus(_.upperCase(data.data.payment_status))
            } 
            if (_.get(data.data, 'order_details'))
                setProductList(data.data.order_details)
        }
        setLoader(false)
    }

    useEffect(() => {
        if (orderid) {
            getOrderStatus()
        }
    }, [orderid])

    return (
        <CustomLayout>
            <Loader open={loader} />
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={`Order Status - ${orderid}`} />
                <Divider className="divider"/>
                <Grid container className="ordercomplete-wrapper main-content-wrapper">
                    <Grid container className="stepper-header">
                        <div className='stepper-header-content'>
                            <span className='inactive'>
                                SHOPPING CART
                            </span>
                            <ArrowForwardIcon />
                            <span className='inactive'>
                                CHECKOUT
                            </span>
                            <ArrowForwardIcon />
                            <span className='active'>
                                ORDER {orderStatus}
                            </span>
                        </div>
                    </Grid>
                    <Grid container className="ordercomplete-content" spacing={10}>
                        <Grid item xs={12} sm={12} md={12} lg={8} className="order-container">
                            <Grid container spacing={3}>
                                {orderStatus == 'NOT FOUND' ? <Grid item xs={12} className='order-title'>
                                    <span className='title-hg-fail'>
                                        No such order found
                                    </span>
                                    <br />
                                    <div className='icon-wrapper-fail'>
                                        <SentimentDissatisfiedIcon />
                                    </div>
                                {/* </Grid> : _.get(productList[0], 'delivery_status') == 11 ? */}
                                </Grid> : orderStatus == 'FAILED' ?
                                <Grid item xs={12} className='order-title'>
                                    <span className='title-hg-fail'>
                                        ORDER FAILED
                                    </span>
                                    <br />
                                    <div className='icon-wrapper-fail'>
                                        <SentimentDissatisfiedIcon />
                                    </div>
                                </Grid> : orderStatus == 'EXPIRED' ?
                                <Grid item xs={12} className='order-title'>
                                    <span className='title-hg-fail'>
                                        ORDER FAILED
                                    </span>
                                    <br />
                                    <div className='icon-wrapper-fail'>
                                        <SentimentDissatisfiedIcon />
                                    </div>
                                </Grid> : orderStatus == 'UNKNOWN' ?
                                <Grid item xs={12} className='order-title'>
                                    <span className='title-hg-fail'>
                                        ORDER FAILED
                                    </span>
                                    <br />
                                    <div className='icon-wrapper-fail'>
                                        <SentimentDissatisfiedIcon />
                                    </div>
                                </Grid> : orderStatus == 'SUCCESSFUL' ?
                                <Grid item xs={12} className='order-title'>
                                    <span className='title-hg'>
                                    YOUR ORDER PLACED SUCCESSFULLY
                                    </span>
                                    <br />
                                    <div className='icon-wrapper'>
                                        <MoodIcon />
                                    </div>
                                </Grid> :
                                 orderStatus == 'PENDING' ?
                                <Grid item xs={12} className='order-title'>
                                    <span className='title-hg-fail'>
                                        ORDER PENDING
                                    </span>
                                    <br />
                                    <div className='icon-wrapper-fail'>
                                        <SentimentDissatisfiedIcon />
                                    </div>
                                </Grid> :
                                <Grid item xs={12} className='order-title'>
                                    <span className='title-hg'>
                                        YOUR ORDER PLACED SUCCESSFULLY
                                    </span>
                                    <br />
                                    <div className='icon-wrapper'>
                                        <MoodIcon />
                                    </div>
                                </Grid> }
                                <Grid item sm={12} className='order-wrapper'>
                                    {productList.map((product, i) => 
                                        <div className='calc-wrapper'>
                                            <div className='product-detail'>
                                                <div className="image-wrapper">
                                                    <img 
                                                        src={_.get(product, 'product_detail.product_image')} 
                                                        alt={_.get(product, 'product_detail.name')} />
                                                </div>
                                                <div className="detail-wrapper">
                                                    <span className='title'>
                                                        {_.truncate(_.get(product, 'product_detail.name'), { length: 25 })}
                                                    </span>
                                                    <div className='quantity-wrapper'>
                                                        <span className='quantity'>Qty: {product.quantity}</span>
                                                    </div>
                                                    <div className='status-wrapper'>
                                                        <span className='status'>
                                                            {product.delivery_status_type}
                                                        </span>
                                                    </div>
                                                    <div className='status-wrapper'>
                                                        <span className='status'>
                                                            {order.selected_payment_mode.Name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className='description'>
                                                <b>{formatCurrency.format(_.get(product, 'total_price', 0))}</b>
                                            </span>
                                        </div>
                                    )}
                                </Grid>
                                {_.get(productList[0], 'delivery_status') == 11 ?
                                <Grid item xs={12} className='order-title'>
                                    <Button
                                        onClick={() => navigate("/cart")}
                                        variant='outlined'>
                                            Go Back To Cart
                                    </Button>
                                </Grid> : ''}
                            </Grid>
                        </Grid>
                        {!loader ?
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <div className='ordercomplete-summary'>
                                <span className='title'>
                                    ORDER DETAIL
                                </span>
                                <Divider className="divider" />
                                <div className='calc-wrapper'>
                                    <span className='description'>
                                        Total
                                    </span>
                                    <span className='description'>
                                        {/* <b>{GLOBAL_CURRENCY.symbol}{_.get(order, 'total_price')}</b> */}
                                        <b>{formatCurrency.format(_.get(order, 'total_price', 0))}</b>
                                    </span>
                                </div>
                                <Divider className='divider'/>
                                <div className='calc-wrapper'>
                                    <span className='description'>
                                        Coupon
                                    </span>
                                    <span className='description'>
                                        <b>{formatCurrency.format(_.get(order, 'voucher_discount', 0))}</b>
                                    </span>
                                </div>
                                <Divider className='divider'/>
                                <div className='calc-wrapper'>
                                    <span className='description'>
                                        Shipping
                                    </span>
                                    <span className='description'>
                                        <b>{formatCurrency.format(_.get(order, 'shipping_charge', 0))}</b>
                                    </span>
                                </div>
                                <Divider className='divider'/>
                                <div className='calc-wrapper'>
                                    <span className='description'>
                                        Subtotal
                                    </span>
                                    <span style={{ fontSize: '1.5rem' }} className='total-amt'>
                                        <b>{formatCurrency.format(_.get(order, 'final_price', 0))}</b>
                                    </span>
                                </div>
                                <div className='button-wrapper'>
                                    <Button 
                                        variant="contained"
                                        onClick={() => navigate('/')}
                                    >
                                        Back to Shopping
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                        : '' }
                    </Grid>
                </Grid>
            </div>
        </CustomLayout>
    )
}
// 
export default OrderComplete