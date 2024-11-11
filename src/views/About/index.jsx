import { useState, useEffect } from 'react'

import { 
    Divider,
    Grid,
} from '@mui/material';
import _ from 'lodash';

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';
import { useSelector } from 'react-redux';

const About = ({ breadcrumbs }) => {
    const [loader, setLoader] = useState(false);
    const [aboutUs, setAboutUs] = useState();
    const webDetails = useSelector(state => state.webDetails);
    const { websiteInfo } = webDetails;

    const getAboutUs = async () => {
        setLoader(true)
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.ABOUT_INFO);
        let { data, response } = res;

        if (data && data.about) {
            setAboutUs(data.about)
        }
        setLoader(false)
    }

    useEffect(() => {
        getAboutUs();
    }, []);

    const bgImage = require("../../assets/images/background.jpg");

    return (
        <CustomLayout>
            <Loader open={loader} />
            <div
                style={{ 
                    // backgroundImage: `url(${_.get(websiteInfo, 'banner')})` 
                    backgroundImage: _.get(websiteInfo, 'banner', '') 
                        ? `url(${_.get(websiteInfo, 'banner')})`
                        : `url(${bgImage})`
                }}
                class="parallax">
                <div className="header-wrapper">
                    <span className="span-2">About Us</span>
                </div>
            </div>
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={"About"} />
                <Divider className="divider"/>
                <Grid container className="about-wrapper main-content-wrapper">
                    <Grid item xs={12} sm={12} md={10} lg={8}>
                        <div className='content-wrapper description' dangerouslySetInnerHTML={{__html: aboutUs}} />
                    </Grid>
                </Grid>
            </div>
        </CustomLayout>
    )
}

export default About