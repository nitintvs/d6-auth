import { useEffect, useState } from 'react'

import { 
    Divider,
    Grid,
    Button,
    Card,
    TablePagination,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Rating,
    CardHeader,
    CardContent,
    CardActions,
    Collapse
} from '@mui/material';

import _ from 'lodash';
import moment from 'moment';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoodIcon from '@mui/icons-material/Mood';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import PendingIcon from '@mui/icons-material/Pending';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import BackpackIcon from '@mui/icons-material/Backpack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import Loader from 'components/Loader';
import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import CustomDialog from 'components/Dialog';
import { GLOBAL_CURRENCY } from 'constants/appConstants';
import CustomStepper from 'components/Stepper';

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
            <span>{showName([address.first_name, address.last_name])} | +{showName([address.country_code, address.phone_number])}</span><br/>
            <Divider className='content-divider'/>
            <span>{address.street_address}</span><br/>
            <span>{address.city}</span><br />
            <span>{address.state}, {address.country} - {address.pin}</span>
        </div>
    )
}

const steps = [{
    label: 'Order Placed', 
    id: 1,
    statusId: 1,
    icon: <PendingIcon />
}, {
    label: 'Order Confirmed', 
    id: 2,
    statusId: 2,
    icon: <ThumbUpAltIcon />
}, {
    label: 'Order Packed', 
    id: 3,
    statusId: 3,
    icon: <BackpackIcon />
}, {
    label: 'Order Shipped', 
    id: 4,
    statusId: 4,
    icon: <LocalShippingIcon />
}, {
    label: 'Order Delivered',
    id: 5, 
    statusId: 5,
    icon: <CheckIcon />
}]

const failSteps = [{
    label: 'Order Failed',
    id: 1, 
    statusId: 1,
    icon: <CloseIcon />
}, {
    label: 'Order Confirmed', 
    id: 2,
    statusId: 2,
    icon: <ThumbUpAltIcon />
}, {
    label: 'Order Packed', 
    id: 3,
    statusId: 3,
    icon: <BackpackIcon />
}, {
    label: 'Order Shipped', 
    id: 4,
    statusId: 4,
    icon: <LocalShippingIcon />
}, {
    label: 'Order Delivered',
    id: 5, 
    statusId: 5,
    icon: <CheckIcon />
}]

const cancelSteps = [{
    label: 'Order Placed', 
    id: 1,
    statusId: 1,
    icon: <PendingIcon />
}, {
    label: 'Order Confirmed', 
    id: 2,
    statusId: 2,
    icon: <ThumbUpAltIcon />
}, {
    label: 'Order Packed', 
    id: 3,
    statusId: 3,
    icon: <BackpackIcon />
}, {
    label: 'Cancelled',
    id: 4, 
    statusId: 10,
    icon: <CloseIcon />
}]

const StatusStepper = ({
    step,
    type
}) => {
    return (
        <div className='status-wrapper'>
            <CustomStepper 
                steps={type == 'cancel' ? cancelSteps : type == 'fail' ? failSteps : steps} 
                activeStep={type == 'fail' ? 1 : step}
                completedStep={type == 'fail' ? 1 : step} />
        </div>
    )
}

const OrderHistory = ({ breadcrumbs }) => {
    const [loader, setLoader] = useState(false);
    const [allOrders, setOrderList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [addReview, addReviewToggle] = useState(false);
    const [selectedOrder, selectOrder] = useState('');
    const [reviewString, addReviewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [showEmpty, setShowEmpty] = useState(false);

    const getOrderList = async (category) => {
        setLoader(true)
        let queryParams = {
            page: pageCount + 1
        }
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_ALL_ORDERS, {
            params: queryParams
        });
        let { data } = res;
    
        if (data && data.results) {
            if (data.count === 0) setShowEmpty(true)
            setOrderList(data.results)
            setTotalCount(data.count);
            setPageCount(data.current_page - 1);
        }
        setLoader(false)
    }

    useEffect(() => {
        getOrderList()
    }, [pageCount])

    const handleChangePage = (e, newPage) => {
        setPageCount(newPage)
    }

    const DialogHeader = (
        <span className='title'>Add Review - {_.get(selectedOrder, 'product_name')}</span>
    );
    
    const DialogAction = (
        <>
        <Button type="submit" color="success" variant="contained">
            Add
        </Button>
        <Button type="submit" color="success" variant="contained">
            Cancel
        </Button>
        </>
    )

    const [collapseDiv, showCollapseDiv] = useState(false);
    const [displayOrder, setDisplayOrder] = useState();
    const [isShippingAddress, showShippingAddress] = useState(false);
    const [isStatus, showStatus] = useState(false);

    const resetCollapseDiv = () => {
        showCollapseDiv(false)
        showStatus(false)
        showShippingAddress(false)
        setDisplayOrder()
    }


    return (
        <CustomLayout>
            <Loader open={loader} />
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={"Orders"} />
                <Divider className="divider"/>
                <Grid container className="orderhistory-wrapper main-content-wrapper">
                    {showEmpty ? 
                    <Card className='emptylist-wrapper'>
                        <RemoveShoppingCartIcon />
                        <span className="title">No orders yet</span>
                        <Button className="btn" href="/products" variant="contained">
                            Go to Shop
                        </Button>
                    </Card> :
                    <Grid container className="list-wrapper">
                        <Grid item xs={12} sm={12} md={12} lg={10} xl={8}>
                            {allOrders.map((order, i) => 
                                <Card className='order-wrapper'>
                                    <CardHeader 
                                        className='header-detail'
                                        title={<Grid container>
                                            <Grid item xs={8} sm={8} md={3} className="detail-wrapper">
                                                <span className='title'>
                                                    Order Placed
                                                </span>
                                                <br />
                                                <span className='data'>
                                                    {moment(order.created).format("On ddd[,] D MMM, YYYY")}
                                                </span>
                                            </Grid>
                                            <Grid item xs={4} sm={4} md={3} className="align-end detail-wrapper">
                                                <span className='title'>
                                                    Total Price
                                                </span>
                                                <span className='data'>
                                                    {formatCurrency.format(order.final_price || 0)}
                                                </span>
                                            </Grid>
                                            <Grid item xs={7} sm={7} md={3} className="detail-wrapper">
                                                <span className='title'>
                                                    Order Id
                                                </span>
                                                <br />
                                                <span className='data'>
                                                    # {order.order_id}
                                                </span>
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={3} className="align-end detail-wrapper">
                                                <span className='title'>
                                                    Transaction Id
                                                </span>
                                                <span className='data'>
                                                    # {order.transaction_id}
                                                </span>
                                            </Grid>
                                        </Grid>}>
                                    </CardHeader>
                                    <CardContent className='product-detail'>
                                        <Grid container>
                                            <Grid item sx={{ width: {
                                                xs: '30%',
                                                sm: '20%',
                                                md: '10%'
                                            } }}>
                                                <div className="image-wrapper">
                                                    <img src={_.get(order, 'product_detail.product_image')} alt={_.get(order, 'product_detail.name')} />
                                                </div>
                                            </Grid>
                                            <Grid item sx={{ width: { xs: '70%', sm: '80%', md: '60%' } }}>
                                                <div className="detail-wrapper">
                                                    <span className='title'>
                                                        {_.get(order, 'product_detail.name')} - <b>{_.get(order, 'product_detail.category_name')}</b>
                                                    </span>
                                                    <div style={{ display: 'flex' }}>
                                                        <span className='quantity'>
                                                            Qty: {_.get(order, 'quantity')} 
                                                        </span>
                                                        <span className='quantity'>
                                                            {formatCurrency.format(_.get(order, 'unit_price', 0))}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex' }}>
                                                        <span className='price'>
                                                        Payment mode: {_.get(order, 'payment_mode.payment_method_name')}
                                                        </span>
                                                    </div>
                                                    {/* <span className='status1'>
                                                    Order Status: 
                                                        <span className='status'>{_.get(order, 'delivery_status_type')}</span>
                                                    </span> */}


                                                    <span className='status'>
                                                    Order Status: 
                                                            {_.get(order, 'delivery_status') == 11 ? 
                                                                <span className='status-fail'> {_.get(order, 'delivery_status_type')} </span> : 
                                                                <span className='status-success'>{_.get(order, 'delivery_status_type')} </span>}
                                                    </span>

                                                    {/* <span className='date'>
                                                        {product.deliveryDate ? 
                                                            moment(product.deliveryDate).format("[On] ddd[,] D MMM") :
                                                            moment(product.estimatedDate).format("[Delivery estimated by] ddd[,] D MMM") }
                                                    </span> */}
                                                    {/* <span className='brand'>
                                                        {_.get(order, '')}
                                                    </span> */}
                                                    {/* <span className='title'>
                                                        {_.get(order, 'transaction_id')}
                                                    </span> */}
                                                </div>
                                            </Grid>
                                            <Grid item 
                                                sx={{ width: { xs: '100%', sm: '100%', md: '30%' } }} 
                                                className='side-action-wrapper'>
                                                {order.delivery_status ?
                                                <Button
                                                    className='action-btn'
                                                    onClick={() => {
                                                        resetCollapseDiv()
                                                        if (displayOrder?.id !== order.id || (displayOrder?.id === order.id && isShippingAddress)) {
                                                            setDisplayOrder(order)
                                                            showCollapseDiv(true)
                                                            showShippingAddress(false)
                                                            showStatus(true)
                                                        }
                                                    }}
                                                    variant="outlined">
                                                    Track Order
                                                </Button> : ''}
                                                {order.shipping_address ?
                                                <Button
                                                    className='action-btn'
                                                    onClick={() => {
                                                        resetCollapseDiv()
                                                        if (displayOrder?.id !== order.id || (displayOrder?.id === order.id && isStatus)) {
                                                            setDisplayOrder(order)
                                                            showCollapseDiv(true)
                                                            showStatus(false)
                                                            showShippingAddress(true)
                                                        }
                                                    }}
                                                    variant="outlined">
                                                    View Shipping Address
                                                </Button> : '' }
                                                {/* <Button
                                                    className='action-btn'
                                                    variant="outlined">
                                                    Track Order
                                                </Button> */}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions className='action-wrapper'>
                                        <Collapse className='collapse-div' in={collapseDiv && displayOrder.id == order.id} timeout="auto" unmountOnExit>
                                            {isShippingAddress ? showAddress(_.get(displayOrder, 'shipping_address')) : ''}
                                            {isStatus ? 
                                                _.get(displayOrder, 'delivery_status') == 10 ?
                                                    <StatusStepper type="cancel" step={_.get(displayOrder, 'delivery_status')} /> :
                                                _.get(displayOrder, 'delivery_status') == 11 ?
                                                    <StatusStepper type="fail" step={_.get(displayOrder, 'delivery_status')} /> :
                                                    <StatusStepper step={_.get(displayOrder, 'delivery_status')} /> : ''}
                                        </Collapse>
                                        {/* <div className='collapsed-div'>

                                        </div> */}
                                    </CardActions>
                                    {/* <div className='action-wrapper'>
                                        <Button
                                            color="success"
                                            onClick={() => {
                                                selectOrder(order)
                                                addReviewToggle(true)
                                            }}
                                            variant="outlined">
                                            Add Review
                                        </Button>
                                    </div> */}
                                    
                                </Card>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={10} xl={8}>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                component="div"
                                count={totalCount}
                                rowsPerPage={totalCount < 10 ? totalCount : 10}
                                page={pageCount}
                                onPageChange={handleChangePage} />
                        </Grid>
                    </Grid>
                    }
                </Grid>
            </div>
            {/* <CustomDialog 
                isDialogOpen={true}
                className="formatted-dialog"
                header={DialogHeader}
                isFormattedDialog={false}
                setDialogOpen={(e) => {
                    addReviewToggle(e)
                }}
            > 
                <div className="dialog-body text-area-wrapper">
                    <Rating 
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                    />
                    <TextField 
                        className="text-area"
                        margin="dense"
                        multiline
                        maxRows={3}
                        onChange={e => addReviewComment(e.target.value)}
                    />
                </div>
            </CustomDialog> */}
        </CustomLayout>
    )
}

export default OrderHistory