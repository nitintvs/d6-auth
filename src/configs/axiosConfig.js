import axios from "axios";
import { getAccessToken } from "utils";
import { authRouteConstants } from "constants/routeConstants";
import { API_URL } from 'constants/appConstants';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "domain-name": (function () {


            // return window.location.host;
            // return 'https://logotest.webbieshop.com/'
            // return 'https://thegnhomehaven.webbieshop.com'
            // return 'nitintest52.webbieshop.com'
            // return 'cycelStore.webbieshop.com'
            // return 'accessories.webbieshop.com'
            // return 'demowebbie.webbieshop.com'
            // return 'istore.webbieshop.com'
            // return 'thevetstore.webbieshop.com'
            // return 'testing-sites.webbieshop.com'
            // return  'mclardies.webbieshop.com'
            return 'ritu-store.webbieshop.com' //for d6 live demo enviroment
            // return 'PGtest.webbieshop.com'
        })(),
    }
});

instance.interceptors.request.use(
    function (config) {
        const token = getAccessToken();
        if (token)
            config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    }
)

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("error response interceptors", error.response);
        if (error && error.response && error.response.status === 401) {
            if (error.response.data && error.response.data.code === "token_not_valid") {
                window.location.href = authRouteConstants.LOGOUT
            }
        }
        return error
    }
);

export default instance;