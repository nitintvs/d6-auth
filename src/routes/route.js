import React from "react";
import {
    useRoutes,
} from "react-router-dom";

import { AuthorisedRoute } from "../middlewares/auth.middleware";

import Landing from "views/Landing";
import ProductList from "views/ProductList";
import ProductView from "views/ProductView";
import Cart from "views/Cart";
import Checkout from "views/Checkout";
import OrderComplete from "views/OrderComplete";
import OrderHistory from "views/OrderHistory";
import UserSetting from "views/UserSetting";

import "../styles/app.global.scss";
import "../assets/styles/css/App.css";
import About from "views/About";
import ContactUs from "views/ContactUs";
import FAQs from "views/FAQs";
import Logout from "containers/Logout";
import { authRouteConstants } from "constants/routeConstants";
import Payment from "containers/Payment";
import CallbackPage from "containers/AuthDialog/Callback";
import SilentRenew from "containers/AuthDialog/SilentRenew";

// eslint-disable-next-line
export default () => {
    let element = useRoutes([
        {
            path: "/",
            element: <Landing />,
        },
        {
            name: "Products",
            path: "/products",
            element: (
                <ProductList
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
            ),
        },
        {
            name: "Product",
            path: "/product/:productId",
            element: (
                <ProductView
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                        {
                            path: "/products",
                            name: "Products",
                        },
                    ]}
                />
            ),
        },
        {
            name: "Cart",
            path: "/cart",
            element: (
                <Cart
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
            ),
        },
        {
            name: "Checkout",
            path: "/checkout",
            element: (
                <AuthorisedRoute>
                <Checkout
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
                </AuthorisedRoute>
            ),
        },
        {
            name: "Order Successful",
            path: "/order-status",
            element: (
                <AuthorisedRoute>
                <OrderComplete
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
                </AuthorisedRoute>
            ),
        },
        {
            name: "Order History",
            path: "/order-history",
            element: (
                <AuthorisedRoute>
                <OrderHistory
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
                </AuthorisedRoute>
            ),
        },
        {
            name: "User Settings",
            path: "/user-setting",
            element: (
                <AuthorisedRoute>
                <UserSetting
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
                </AuthorisedRoute>
            ),
        },
        {
            name: "About",
            path: "/about",
            element: (
                <About
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
            ),
        },
        {
            name: "Contact Us",
            path: "/contact",
            element: (
                <ContactUs
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
            ),
        },
        {
            name: "FAQs",
            path: "/faqs",
            element: (
                <FAQs
                    breadcrumbs={[
                        {
                            path: "/",
                            name: "Home",
                        },
                    ]}
                />
            ),
        },
        {
            path: authRouteConstants.LOGOUT,
            element: <Logout />
        },
        {
            path: authRouteConstants.LOGINCALLBACK,
            element: <CallbackPage />
        },
        {
            path: authRouteConstants.SILENTRENEW,
            element: <SilentRenew />
        },
        {
            path: "/payment/:payment_id/:orderId",
            element: <Payment />
        }
    ]);
    return element;
};
