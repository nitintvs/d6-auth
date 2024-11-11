import React, { useState, useEffect, useRef } from "react";
import { MenuItem, Menu, Typography, ListItemIcon, Grid, Badge } from "@mui/material";
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Person from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CallIcon from '@mui/icons-material/Call';
import AppsIcon from '@mui/icons-material/Apps';

import Layout from "containers/Layouts";
import SecondaryAppBar from "containers/SecondaryAppBar";
import AuthDialog from "containers/AuthDialog";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants, authRouteConstants } from 'constants/routeConstants';
import { getAccessToken } from 'utils';
import { updateUserDetail } from 'utils/auth';

import { blue } from '@mui/material/colors';
import { setAllCategoryList, updateCartCount, updateWebsiteDetail } from 'utils/website';
import { handleLoginModal, handleOpenAuthDialog } from 'utils/auth';
import LoadWebsite from 'views/LoadWebsite';

import { APP_NAME, APP_LOGO } from "constants/appConstants";
import { clearCart, getCartCountFromLocalStorage, getCartItemsFromLocalStorage } from "utils/cart";

const CustomLayout = (props) => {
    const [loader, setLoader] = useState(false);
    const location = useLocation();
    const [isLoginDialogOpen, setLoginDialog] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElCategory, setAnchorElCategory] = useState(null);
    const navigate = useNavigate();
    
    const [filteredCategories, setFilteredCategory] = useState({
        categories: [],
        type: 'nested'
    });
    const loggedInUser = useSelector(state => state.userDetails);
    const { user, doLogin, isAuthOpen } = loggedInUser
    const webDetails = useSelector(state => state.webDetails);
    const { allCategories, websiteInfo, refreshCart } = webDetails;
    const [cartCount, setCartCount] = useState();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenCategory = (event) => {
        setAnchorElCategory(event.currentTarget);
    };

    const handleCloseCategory = () => {
        setAnchorElCategory(null);
    };

    const filterCategory = (categories) => {
        let _categories = []
        let _filteredCategories = [];
        let categoryTypeSimple = true;
        for (let category of categories) {
            if (!category.parent) {
                _categories.push(category)
            }
        }
        for (let category of _categories) {
            let list = _.filter(categories, { parent: category.id})
            if (list.length > 0) categoryTypeSimple = false
            _filteredCategories.push({
                ...category,
                child: list
            })
        }

        setFilteredCategory({
            categories: _filteredCategories,
            type: categoryTypeSimple ? 'simple' : 'nested'
        })
    }


    const navItems = [{
        title: 'About',
        icon: <InfoIcon />,
        path: "/about"
    },{
        title: 'Categories',
        icon: <CategoryIcon />,
        handleClick: handleOpenCategory,
        isDropdown: true,
        isMobileView: false,
        path: "/products"
    },{
        title: 'Shop',
        icon: <ShoppingBagIcon />,
        path: "/products"
    }]
    
    const rightNavItems = [{
        title: 'Contact Us',
        icon: <CallIcon />,
        path: "/contact"
    }]
    
    const userSettings=[{
        title: 'My Account',
        icon: <AccountCircle />,
        path: "/user-setting"
    }, {
        title: 'My Order',
        icon: <AppsIcon />,
        path: "/order-history"
    }, {
        title: 'Logout',
        icon: <LogoutIcon />,
        path: authRouteConstants.LOGOUT,
    }]
    
    useEffect(() => {
        if (refreshCart) {
            getCartCount();
            updateCartCount(false)
        }
    }, [refreshCart])

    const getCategoryList = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.ALL_CATEGORY);
        let { data, response } = res;

        if (data) {
            setAllCategoryList(data)
        }
        setLoader(false)
    }

    const getUser = async () => {
        let res = await axiosInstance.get(APIRouteConstants.AUTH.ME)
        let { data, response } = res;

        if (data && data.success) {
            const user = data.data;
            updateUserDetail(user)
        }
    }

    const token = getAccessToken()

    useEffect(() => {
        if (token) {
            getUser()
        }
        getCartCount()
    }, [token])

    const prevUserRef = useRef(user);

    useEffect(() => {
        if (_.isEmpty(prevUserRef.current) && !_.isEmpty(user) && !_.isEqual(location.pathname, '/cart')) {
            let cartItem = getCartItemsFromLocalStorage();
            if (!_.isEmpty(cartItem)) syncCartFromLocalStorage()
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
            getCartCount()
        }
        setLoader(false)
    }

    const getLoggedUser = () => {
        const { user } = loggedInUser;
        if (!_.isEmpty(user)) return user;
        if (!token) {
            updateUserDetail(null);
        } else {
            getUser();
        }
    }

    const getWebsiteInfo = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.WEB_INFO);
        let { data, response } = res;

        if (data) {
            updateWebsiteDetail(data)
        }
        setLoader(false)
    }

    useEffect(() => {
        if (_.isEmpty(websiteInfo))
            getWebsiteInfo()
    }, [websiteInfo])

    const getCartCount = async () => {
        if (!token) {
            let count = getCartCountFromLocalStorage()
            setCartCount(count);
        } else {
            let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.GET_CART_ITEMS);
            let { data, response } = res;

            let count = 0;
            if (data && data.cart_items) {
                for (let i of data.cart_items) {
                    count = count + i.quantity
                }
                setCartCount(count);
            }
        }
    }

    useEffect(() => {
        if (!allCategories.length)
            getCategoryList()
        else {
            filterCategory(allCategories)
        }
    }, [allCategories])

    useEffect(() => {
        getLoggedUser();
    }, []);

    return (
        <Layout 
            pages={[]} 
            iconItems={[{
                title: 'Cart',
                icon: cartCount ? 
                    <Badge badgeContent={cartCount} showZero={!cartCount} color="info" style={{marginRight:3}} >
                        <Typography fontSize="xl">
                            <ShoppingCart sx={{ color: webDetails?.websiteInfo?.header_text, fontSize: '1.4rem' }}/>
                        </Typography>
                    </Badge> :
                    <ShoppingCart sx={{ color: webDetails?.websiteInfo?.header_text, fontSize: '1.4rem' }}/>,
                handleClick: () => navigate('/cart'),
                helpText: "Open Cart",
                isMobileView: true,
                isAuth: false
            },
            {
                title: 'User',
                icon: <Person sx={{ color: webDetails?.websiteInfo?.header_text, fontSize: '1.6rem', ml:2  }}/>,
                handleClick: handleOpenUserMenu,
                helpText: "User Setting",
                isMobileView: false,
                isAuth: true
            }
        ]}
            appTitle={websiteInfo?.store_name}
            logo={websiteInfo?.logo}
            user={user}
            handleOpenAuthDialog={() => handleOpenAuthDialog(true)}
            >   
                <LoadWebsite activate={_.isEmpty(websiteInfo)} />
                <Loader open={loader} />
                <section className="seconday-header">
                    {/* <SecondaryAppBar 
                        navItems={navItems} 
                        rightNavItems={rightNavItems}
                        anchor="left"
                        settings={userSettings}
                        user={user}
                        handleOpenAuthDialog={() => handleOpenAuthDialog(true)}
                        iconItems={[{
                            title: 'Cart',
                            icon: cartCount ? 
                                <Badge badgeContent={cartCount} showZero={!cartCount} color="info" >
                                    <Typography fontSize="xl">
                                        <ShoppingCart sx={{ color: blue[200], fontSize: '1.6rem' }}/>
                                    </Typography>
                                </Badge> :
                                <ShoppingCart sx={{ color: blue[200], fontSize: '1.6rem' }}/>,
                            path: '/cart',
                            helpText: "Open Cart",
                            isMobileView: true,
                            isAuth: false
                        }]}
                    /> */}
                </section>
            {props.children}
            <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {userSettings.map((setting) => (
                    <MenuItem key={setting} onClick={() => {
                        navigate(setting.path)
                    }}>
                        <ListItemIcon>
                            {setting.icon}
                        </ListItemIcon>
                        <Typography textAlign="center">{setting.title}</Typography>
                    </MenuItem>
                ))}
            </Menu>
            <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElCategory}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorElCategory)}
                onClose={handleCloseCategory}
            >
                <Grid container className="menu-container">
                    {filteredCategories.type === 'simple' ?
                        <div className="simple-item-container">
                        {filteredCategories.categories.map((parent) =>
                            <MenuItem 
                                key={parent.id} 
                                onClick={() => {
                                    navigate(`/products?category=${parent.name}`)
                                }}
                            >
                                <Typography textAlign="center">{parent.name}</Typography>
                            </MenuItem> )}
                        </div> :
                        filteredCategories.categories.map((parent) => <div className="menu-item-container">
                            <MenuItem 
                                key={parent.id} 
                                onClick={() => {
                                    navigate(`/products?category=${parent.name}`)
                                }}
                            >
                                <Typography textAlign="center">{parent.name}</Typography>
                            </MenuItem>
                            <div className="child-item-container">
                                {parent.child.length > 0 && parent.child.map(category => (
                                    <MenuItem 
                                        key={category.id} 
                                        onClick={() => {
                                            navigate(`/products?category=${category.name}`)
                                        }}
                                    >
                                        <Typography textAlign="center">{category.name}</Typography>
                                    </MenuItem>
                                ))}
                            </div>
                        </div>
                    )}
                    
                </Grid>
            </Menu>
            <AuthDialog 
                isAuthDialogOpen={isAuthOpen}
                setAuthDialog={handleOpenAuthDialog}
                logoUrl={websiteInfo.logo}
            />
        </Layout>
    );
};

export default CustomLayout;
