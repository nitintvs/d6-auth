import axiosInstance from "./axiosConfig";

export const reduxAxios = (instance) => {
    return async (type, obj = {}) => {
        const { url, data } = obj;
        var { method } = obj;

        method =
            method === "post" || method === "PUT" || method === "GET"
                ? method
                : "GET";

        var res;

        try {
            if (method !== "GET" && typeof data === "object") {
                res = await axiosInstance[method](url, data, {
                    config: { headers: { "Content-Type": "application/json" } },
                });
                //   } else if (typeof data === "formdata") {
                //     res = await axiosInstance[method](url, data, {
                //       config: { headers: { "Content-Type": "multipart/form-data" } }
                //     });
            } else {
                res = await axiosInstance[method](url);
            }
            return {
                type: `${type}`,
                payload: {
                    ...(res.data || {}),
                    success: true,
                    requestInProgress: false,
                },
            };
        } catch (err) {
            console.log("Error === ", err, err.payload);
            let message = "";
            return {
                type: `${type}`,
                payload: {
                    success: false,
                    message: message,
                    requestInProgress: false,
                },
            };
        }
    };
};

export const rdxFetch = reduxAxios(axiosInstance);
