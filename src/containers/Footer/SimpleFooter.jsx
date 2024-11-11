import React, { useState } from "react";
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Typography, Grid, Link, Divider } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// import { ReactComponent as Visa } from '../../assets/images/visa-logo.svg';
// import { ReactComponent as Apple } from '../../assets/images/apple-pay-logo.svg';
import { ReactComponent as Capitec } from '../../assets/images/CapitecPay - colour.svg';
import { ReactComponent as Shiprazor } from '../../assets/images/sr.svg';
import { ReactComponent as PeachPayment } from '../../assets/images/peachpayments-logo.svg';
import PrivacyPolicy from "containers/PrivacyPolicy";
import TermsAndConditions from "containers/TermsAndConditions";
import { isMobile } from "react-device-detect";
import NewFooter from "./NewFooter";
// import { ReactComponent as VentureStudio } from '../../assets/images/venture.svg';
const ventureStudio = require('../../assets/images/vs-logo-white.png');

const amex = require('../../assets/images/amex.png');
const apple = require('../../assets/images/apple-pay-logo.png');
const visa = require('../../assets/images/visa-logo.png');

const SimpleFooter = ({ websiteInfo }) => {
    const { logo } = websiteInfo;
    const navigate = useNavigate();
    const [isOpenPrivacy, setOpenPrivacy] = useState(false)
    const [isOpenTerms, setOpenTerms] = useState(false)

    const openTermsAndConditions = (value) => {
        setOpenTerms(value);
    }

    const openPrivacyPolicy = (value) => {
        setOpenPrivacy(value);
    }

    return (
        <div> 
              <NewFooter/>
        </div>
    )
}

export default SimpleFooter
// import React, { useState } from "react";
// import _ from 'lodash';
// import { useNavigate } from 'react-router-dom';

// import { Typography, Grid, Link, Divider } from "@mui/material";
// import AdbIcon from "@mui/icons-material/Adb";

// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// // import { ReactComponent as Visa } from '../../assets/images/visa-logo.svg';
// // import { ReactComponent as Apple } from '../../assets/images/apple-pay-logo.svg';
// import { ReactComponent as Capitec } from '../../assets/images/CapitecPay - colour.svg';
// import { ReactComponent as Shiprazor } from '../../assets/images/sr.svg';
// import { ReactComponent as PeachPayment } from '../../assets/images/peachpayments-logo.svg';
// import PrivacyPolicy from "containers/PrivacyPolicy";
// import TermsAndConditions from "containers/TermsAndConditions";
// import { isMobile } from "react-device-detect";
// // import { ReactComponent as VentureStudio } from '../../assets/images/venture.svg';
// const ventureStudio = require('../../assets/images/vs-logo-white.png');

// const amex = require('../../assets/images/amex.png');
// const apple = require('../../assets/images/apple-pay-logo.png');
// const visa = require('../../assets/images/visa-logo.png');

// const SimpleFooter = ({ websiteInfo }) => {
//     const { logo } = websiteInfo;
//     const navigate = useNavigate();
//     const [isOpenPrivacy, setOpenPrivacy] = useState(false)
//     const [isOpenTerms, setOpenTerms] = useState(false)

//     const openTermsAndConditions = (value) => {
//         setOpenTerms(value);
//     }

//     const openPrivacyPolicy = (value) => {
//         setOpenPrivacy(value);
//     }

//     return (
//         <div className="footer-section">
//             <div className="logo">
//                 {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
//                 {logo ?
//                     <div className="logo-wrapper">
//                         {/* <img src={logo || require('../../../assets/images/logo.png')} alt="logo" /> */}
//                         <img src={logo} alt="logo" />
//                     </div> : ''}
//                 <Typography
//                     variant="h6"
//                     noWrap
//                     component="a"
//                     href="/"
//                     sx={{
//                         mr: 2,
//                         display: { xs: "flex", md: "flex" },
//                         fontFamily: "monospace",
//                         fontWeight: 500,
//                         color: "inherit",
//                         textDecoration: "none",
//                         fontFamily: "'Mulish', sans-serif",
//                         fontSize: '1.8rem'
//                     }}
//                 >
//                     {_.get(websiteInfo, 'store_name')}
//                 </Typography>
//             </div>
//             <Grid container className="footer-content">
//                 <Grid item xl={5} lg={4} md={9} sm={8} xs={12}>
//                     <p className="description" style={{paddingTop:20}}>
//                         Connect with us:
//                     </p>
//                     <div className="business-address">
//                         <div dangerouslySetInnerHTML={{ __html: websiteInfo.business_address }} />
//                     </div>
//                     <div className="contact-link-wrapper">
//                         {_.get(websiteInfo, 'instagram') ?
//                             <a href={`https://www.instagram.com/${websiteInfo.instagram}`} target="_blank" rel="noreferrer">
//                                 <InstagramIcon />
//                             </a>
//                             : ''}
//                         {_.get(websiteInfo, 'facebook') ?
//                             <a href={`https://facebook.com/profile.php?id=${websiteInfo.facebook}`} target="_blank" rel="noreferrer">
//                                 <FacebookIcon />
//                             </a>
//                             : ''}
//                         {_.get(websiteInfo, 'twitter') ?
//                             <a href={`https://twitter.com/intent/user?user_id=${websiteInfo.twitter}`} target="_blank" rel="noreferrer">
//                                 <TwitterIcon />
//                             </a>
//                             : ''}
//                         {_.get(websiteInfo, 'linkedIn') ?
//                             <a href={`https://www.linkedin.com/in/${websiteInfo.linkedIn}`} target="_blank" rel="noreferrer">
//                                 <LinkedInIcon />
//                             </a>
//                             : ''}
//                         {/* {_.get(websiteInfo, 'whatsapp') ?
//                             <a href={`https://wa.me/${websiteInfo.whatsapp_country_code}${websiteInfo.whatsapp}?text=Hello`} target="_blank" rel="noreferrer">
//                                 <WhatsAppIcon />
//                             </a>
//                             : ''} */}
//                     </div>
//                 </Grid>
//                 <Grid item xl={3} lg={3} md={3} sm={4} xs={12}>
//                     <div className="link-wrapper">
//                         <p className="description">
//                             Information
//                         </p>
//                         <Link onClick={() => {
//                             navigate("/products")
//                         }}>
//                             <span>Shop</span>
//                         </Link>
//                         <Link onClick={() => {
//                             navigate("/about")
//                         }}>
//                             <span>About Us</span>
//                         </Link>
//                         <Link onClick={() => {
//                             navigate("/contact")
//                         }}>
//                             <span>Contact Us</span>
//                         </Link>
//                         <Link onClick={() => {
//                             openTermsAndConditions(true)
//                         }}>
//                             <span>Terms of Use</span>
//                         </Link>
//                         <Link onClick={() => {
//                             openPrivacyPolicy(true)
//                         }}>
//                             <span>Privacy Policy</span>
//                         </Link>
//                     </div>
//                 </Grid>
//                 <Grid item xl={4} lg={5} md={12} sm={12} xs={12}>
//                     <div className="link-wrapper">
//                         <p className="description">
//                             Trusted and Supported by
//                         </p>
//                         <div className="contact-link-wrapper">
//                             <div className="img-container">
//                                 {/* <img src={require('../../assets/images/peach.jpeg')} alt='peach' /> */}
//                                 <PeachPayment style={{ width: '3.8rem' }} />
//                             </div>
//                             <div style={{ width: 'fit-content' }} className="img-container">
//                                 <Shiprazor />
//                             </div>
//                             <div className="img-container">
//                                 <img src={ventureStudio} alt="venture" />
//                             </div>
//                         </div>
//                     </div>
//                 </Grid>
//             </Grid>
//             <Divider style={{ borderColor: 'rgba(255,255,255,1)' }} />
//             <Grid container style={{ padding: '0' }} sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' } }} className="footer-content">
//                 <Grid className="copyright-text" item xl={6} lg={4} md={4} sm={4} xs={12}>
//                     <div style={{ width: '100%' }}>
//                         <span style={{ fontSize: '0.8rem' }}>© {_.get(websiteInfo, 'store_name')}</span>
//                     </div>
//                 </Grid>
//                 <Grid className="accept-text" item xl={6} lg={8} md={8} sm={8} xs={12}>
//                     <div className="bottom-footer contact-link-wrapper">
//                         <span className="description">
//                             We accept: 
//                         </span>
//                         <div className="img-container">
//                             <img src={amex} alt='amex' />
//                         </div>
//                         <div className="img-container">
//                             <img src={visa} alt='visa' />
//                         </div>
//                         <div className="img-container">
//                             <img src={require('../../assets/images/mastercard.png')} alt='master' />
//                         </div>
//                         <div style={{ alignItems: 'center' }} className="img-container">
//                             <img src={apple} alt='amex' style={{ height: '2rem', width: '2.5rem' }}/>
//                         </div>
//                         <div style={{ alignItems: 'center' }} className="img-container">
//                             <Capitec style={{ height: '1.4rem', width: '3.2rem' }} />
//                         </div>
//                     </div>
//                 </Grid>
//             </Grid>
//             <PrivacyPolicy isOpen={isOpenPrivacy} openPrivacyPolicy={openPrivacyPolicy}/>
//             <TermsAndConditions isOpen={isOpenTerms} openTermsAndConditions={openTermsAndConditions}/>
//         </div>
//     )
// }

// export default SimpleFooter