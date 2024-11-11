export const authRouteConstants = {
    LOGIN: "/login",
    SILENTRENEW: "/silent-renew",
    LOGINCALLBACK: "/login/callback",
    SIGNUP: "/signup",
    HOME: "/",
    LOGOUT: "/logout"
};

export const APIRouteConstants = {
    AUTH: {
        SIGNUP: "/customer/api/signup/", 
        LOGIN: "/customer/api/login/",
        ME: "/customer/customer-account-detail/",
        FORGOTPASSEMAIL:'/core/email_for_forgotpassword/',
        OTPVALIDATECHANGEPASSWORD:'/core/verify-otp-resetpassword/',
        RESETPASSWORD:'/core/reset-password/',
    },
    DASHBOARD: {
        ALL_CATEGORY: "/customer/api/categories/",
        ALL_PRODUCT: "/customer/api/selected-product-search/",
        GET_PRODUCT: (productId) => `/customer/products/${productId}/`,
        ADD_TO_CART: "/customer/add-to-cart/",
        GET_CART_ITEMS: "/customer/cart-items/",
        UPDATE_CART_ITEMS_LOCAL_STORAGE: "/customer/cart-without-login/",
        UPDATE_CART_ITEMS: (cartItemId) => `/customer/update-cart/${cartItemId}`,
        REMOVE_CART_ITEMS: (cartItemId) => `/customer/api/remove-from-cart/${cartItemId}/`,
        CART_SUMMARY: "/customer/api/cart-summery/",
        CHECKOUT: "/customer/checkout/",
        GET_ADDRESS_LIST: '/customer/customer-address-details/',
        ADD_ADDRESS_LIST: '/customer/add_shipping_detail/',
        GET_ALL_PAYMENTS: "/customer/api/payment-methods/",
        PROCEED_PAYMENT: '/customer/proceed-to-payment/',
        TOP_COLLECTION: "/customer/api/top-collection-products/",
        FEATURE_COLLECTION: "/customer/api/featured-products/",
        ABOUT_INFO: "/customer/api/about/",
        WEB_INFO: "/customer/api/website-info/",
        CONTACT_INFO: '/customer/api/contact-us/',
        GET_ALL_ORDERS: '/customer/customer-orders/',
        GET_ORDER_ITEM_DETAIL: '/customer/order-detail/',
        GET_ORDER_DETAIL: '/customer/transaction-detail/',
        GET_USER_DETAIL: '/customer/customer-account-detail/',
        UPDATE_PASSWORD: '/customer/change-password/',
        TERMS_CONDITION: '/customer/api/terms-&-condition/',
        PRIVACY_POLICYS: '/customer/get-privacy-policy-content/',
        REPORT_PRODUCT:"/product/report-product/"
    }
}
