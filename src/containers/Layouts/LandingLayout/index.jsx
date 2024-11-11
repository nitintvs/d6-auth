import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

import { SearchAppBar as AppBar } from "containers/AppBar";
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import Footer from "containers/Footer";
import { Button, CardMedia } from "@mui/material";
import whatsapp from "../../../assets/images/whatsapp1.png";
import { isMobile } from 'react-device-detect';

const LandingLayout = ({ pages, ...props }) => {
    const webDetails = useSelector(state => state.webDetails);
    const { websiteInfo } = webDetails;

    const [productList, setProductList] = useState([]);

    const searchProductList = async (search, setLoader) => {
        setLoader(true)
        if (search && search.length > 2) {
            let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.ALL_PRODUCT, {
                params: {
                    query: search
                }
            });
            let { data, response } = res;

            if (data && data.results) {
                setProductList(data.results)
            }
        } else {
            setProductList([])
        }
        setLoader(false)
    }

    const handleWhatsappClick = () => {
        const country_code = websiteInfo?.whatsapp_country_code;
        const phoneNumber = websiteInfo?.whatsapp;
    
        if (!country_code || !phoneNumber) {
            console.error('Country code or phone number is missing.');
            return;
        }
    
        const message = 'Hello! I would like to chat.';
        const url = `https://wa.me/${country_code}${phoneNumber}?text=${encodeURIComponent(message)}`;
    
        console.log(`Opening WhatsApp with URL: ${url}`);
    
        window.open(url, '_blank');
    };
    
// https://beta-api.webbieshop.com/accounts/logo-banner/


    return (<>
        <section className="layout-view">
            <section className="header">
                <AppBar
                    showToggleMenu={Boolean(pages.length)}
                    searchProductList={searchProductList}
                    productList={productList}
                    {...props} />
            </section>
            <section className="main-view">{props.children}</section>
            <section className="footer">
                <Footer websiteInfo={websiteInfo} />
            </section>
            {(websiteInfo?.whatsapp && websiteInfo?.whatsapp_country_code &&websiteInfo?.whatsapp_status) && <div style={{ position: "fixed", zIndex:9000, bottom: 20, right:  20 }}>
                <Button  onClick={handleWhatsappClick}>
                    <img style={{width:50}} src={whatsapp} />
                </Button>
            </div>}
        </section>
    </>
    );
};

export default LandingLayout;
