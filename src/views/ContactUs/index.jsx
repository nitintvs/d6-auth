import React, { useState } from 'react'

import { 
    Divider,
    Grid,
} from '@mui/material';
import _ from 'lodash';

import CustomLayout from 'views/CustomLayout'
import CustomBreadcrumbs from "components/Breadcrumbs";
import { useSelector } from 'react-redux';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const bgImage = require("../../assets/images/background.jpg");

const ContactUs = ({ breadcrumbs }) => {
    const webDetails = useSelector(state => state.webDetails);
    const { websiteInfo } = webDetails;

    return (
        <CustomLayout>
            <div 
            style={{ 
                // backgroundImage: `url(${_.get(websiteInfo, 'banner')})` 
                backgroundImage: _.get(websiteInfo, 'banner', '') 
                    ? `url(${_.get(websiteInfo, 'banner')})`
                    : `url(${bgImage})`
            }} class="parallax">
                <div className="header-wrapper">
                    <span className="span-2">Contact Us</span>
                </div>
            </div>
            <div className="content-container">
                <CustomBreadcrumbs list={breadcrumbs} name={"Contact Us"} />
                <Divider className="divider"/>
                <Grid container className="contact-wrapper main-content-wrapper">
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <span className='content-wrapper description'>
                            <div className="business-address">
                                <div dangerouslySetInnerHTML={{__html: websiteInfo.business_address}} />
                            </div>
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} className='contact-detail-wrapper'>
                        {websiteInfo.email_address ?
                        <div className='content-wrapper description'>
                            <EmailIcon />
                            <span>{_.get(websiteInfo, 'email_address')}</span>
                        <br />
                        </div>
                        : '' }
                        {websiteInfo.mobile_number ?
                        <div className='content-wrapper description'>
                            <PhoneIcon />
                            <span>+{_.get(websiteInfo, 'country_code')}{"-"}{_.get(websiteInfo, 'mobile_number')}</span>
                        <br />
                        </div>
                        : '' }
                        {websiteInfo.whatsapp ?
                        <span className='content-wrapper description'>
                            <WhatsAppIcon />
                            +{_.get(websiteInfo, 'whatsapp_country_code')}{"-"}{_.get(websiteInfo, 'whatsapp')}
                        <br />
                        </span>
                        : ''}
                    </Grid>
                </Grid>
            </div>
        </CustomLayout>
    )
}

export default ContactUs