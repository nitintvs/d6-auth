// ColorContext.js
import instance from 'configs/axiosConfig';
import { APIRouteConstants } from 'constants/routeConstants';
import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const ColorContext = createContext();

// Create a provider component
export const ColorProvider = ({ children }) => {
    const [loader,setLoader] =useState(false)
    const [colors, setColors] = useState({
        header_bg: '',
        header_text: '',
        footer_bg: '',
        footer_text: '',
    });


    const getWebsiteInfo = async () => {
        setLoader(true)
        let res = await instance.get(APIRouteConstants.DASHBOARD.WEB_INFO);
        let { data, response } = res;

        if (data) {
            setColors({
                footer_bg: data.footer_bg,
                footer_text: data.footer_text,
                header_bg: data.header_bg,
                header_text: data.header_text,
            })
        }
        setLoader(false)
    }

    useEffect(() => {
        // Fetch color data from API
     getWebsiteInfo();
           
    }, []);

    return (
        <ColorContext.Provider value={{colors,loader}}>
            {children}
        </ColorContext.Provider>
    );
};
