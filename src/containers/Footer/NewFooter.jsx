import React, { useContext, useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
// import axiosInstance from "configs/axiosConfig";
import "./formstyle.css";
import "./globalstylesheet-sai.css";
import "./globalstylesheet.css";
import { ReactComponent as Capitec } from "../../assets/images/CapitecPay - colour.svg";
import { ReactComponent as Shiprazor } from "../../assets/images/sr.svg";
import { ReactComponent as PeachPayment } from "../../assets/icons/Amazon_Web_Services-Logo.wine.svg";
import { Link, useNavigate } from "react-router-dom";
import PrivacyPolicy from "containers/PrivacyPolicy";
import TermsAndConditions from "containers/TermsAndConditions";
import { APIRouteConstants } from "constants/routeConstants";
import instance from "configs/axiosConfig";
import { useSelector } from "react-redux";

import { handleLoginModal, handleOpenAuthDialog } from "utils/auth";
import { getAccessToken } from "utils";
import { Button, Divider } from "@mui/material";
import { ColorContext } from "utils/UIContext";
import InappropriateContent from "containers/InappropriateContent";
// import { MyContext } from "../Context/websiteinfocontext";
// import { APIRouteConstants } from "constants/routeConstants";
// import { useSnackbar } from "notistack";

const ventureStudio = require("../../assets/images/vs-logo-white.png");

const amex = require("../../assets/images/amex.png");
const apple = require("../../assets/images/apple-pay-logo.png");
const visa = require("../../assets/images/visa-logo.png");

function NewFooter() {
  const navigate = useNavigate();
  const { webDetails } = useSelector((state) => state);
  const colors = {
    footer_bg: webDetails?.websiteInfo?.footer_bg
      ? webDetails?.websiteInfo?.footer_bg
      : "#000",
    footer_text: webDetails?.websiteInfo?.footer_text
      ? webDetails?.websiteInfo?.footer_text
      : "#fff",
  };
  const [loading, setLoading] = useState(false);
  const [socialmedia, setSocialmedia] = useState({});
  const [email, setEmail] = useState("");   
  const [termsOpen, setTermsOpen] = useState(false);
  


  const [emailError, setEmailError] = useState("");
  const [underlineColor, setUnderlineColor] = useState("transparent");
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const handleTrackOrderClick = () => {
    console.log("Token:", token); // Log the token to ensure it's correct
    if (token) {
      console.log("Navigating to /order");
      navigate("/order-history");
    } else {
      console.log("Opening Auth Dialog");
      handleOpenAuthDialog(true);
    }
  };

  console.log("Token", webDetails?.websiteInfo); // Log the token to ensure it's correct
  const handleMyOrderClick = () => {
    if (token) {
      console.log("Navigating to /order");
      navigate("/order-history");
    } else {
      console.log("Opening Auth Dialog");
      handleOpenAuthDialog(true);
    }
  };

  const token = getAccessToken();
  const [isOpenPrivacy, setOpenPrivacy] = useState(false);
  const [isOpenTerms, setOpenTerms] = useState(false);
  const [header_text, setHeader_text] = useState("");
  const openPrivacyPolicy = (value) => {
    setOpenPrivacy(value);
  };

  
  const handleTermsOpen = (e) => {
    e.stopPropagation();
    setTermsOpen(true);
  };

  const handleTermsClose = (e) => {
    e.stopPropagation();
    setTermsOpen(false);
  };
  const openTermsAndConditions = (value,e) => {
    console.log("value",e)
    setHeader_text(e)
    setOpenTerms(value);
  };

  const getContactinfo = async () => {
    setLoading(true);
    let res = await instance.get(APIRouteConstants.DASHBOARD.CONTACT_INFO);
    let { data, response } = res;

    if (data) {
      setSocialmedia(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getContactinfo();
  }, []);

  console.log("socialmedia", webDetails?.websiteInfo.store_name);
  const handleEmailChange = (e) => {
    e.preventDefault();
    // console.log("first", validateEmail(e.target.value));
    if (email === "") {
      setEmailError("Please Enter email address");
      return;
    }
    subscribe(e.target.value);
  };

  // useEffect(() => {
  //   setUnderlineColor("#fff");
  // }, []);

  const handleMouseEnter = (e) => {
    e.target.style.borderBottom = `1px solid ${colors.footer_text}`; // Change to your desired hover color
  };

  const handleMouseLeave = (e) => {
    e.target.style.borderBottom = "2px solid transparent"; // Reset the underline
  };

  const subscribe = async () => {
    // let { data, response } = res;
    // if (data.status === 200) {
    //   setLoading(false);
    //   setEmailError("");
    //   setEmail("");
    //   //   enqueueSnackbar("You've subscribed successfully.", {
    //   //     variant: "success",
    //   //   });
    // } else {
    //   setLoading(false);
    //   //   enqueueSnackbar("Invalid email address", { variant: "error" });
    // }
  };
  const darkColors = [
    "#000000",
    "#1a1a1a",
    "#2b2b2b",
    "#333333",
    "#4d4d4d",
    "#666666",
  ]; // Add more dark shades if needed

  const bgColor = colors.footer_background;
  const isDarkBackground = darkColors.includes(bgColor);;

  const isColorTrue = Object.keys(colors).length > 0;
  return (
    <footer
      className="footer"
      style={{ background: isColorTrue && colors.footer_bg }}
    >
      <div className="footer__div">
        <div className="footer__div__top">
          <div className="footer__div__top__aboutus">
            {/* {(socialmedia?.instagram  ||
              socialmedia?.twitter  ||
              socialmedia?.facebook  ||
              socialmedia?.linkedIn ) && } */}
            <div style={{ color: isColorTrue && colors.footer_text }}>
              Connect with us:
            </div>
            <div style={{ display: "none" }}>
              Webbieshop is from the stable of The Venture Studio who are the
              venture builders and spin out products that solve market problems.
            </div>
            <div>
              {/* {
                <a target="_blank">
                  <i className="bi bi-instagram"></i>
                </a>
              }
              {
                <a target="_blank">
                  <i className="bi bi-linkedin"></i>
                </a>
              }
              {
                <a target="_blank">
                  <i className="bi bi-twitter"></i>
                </a>
              }{" "}
              {
                <a target="_blank">
                  <i className="bi bi-facebook"></i>
                </a>
              } */}
              {socialmedia?.instagram && (
                <a
                  href={`https://www.instagram.com/${socialmedia.instagram}`}
                  target="_blank"
                >
                  <i
                    style={{ color: isColorTrue && colors.footer_text }}
                    className="bi bi-instagram"
                  ></i>
                </a>
              )}
              {socialmedia?.linkedIn && (
                <a
                  href={`https://www.linkedin.com/in/${socialmedia.linkedIn}`}
                  target="_blank"
                >
                  <i
                    style={{ color: isColorTrue && colors.footer_text }}
                    className="bi bi-linkedin"
                  ></i>
                </a>
              )}
              {socialmedia?.twitter && (
                <a
                  href={`https://twitter.com/intent/user?user_id=${socialmedia.twitter}`}
                  target="_blank"
                >
                  <i
                    style={{ color: isColorTrue && colors.footer_text }}
                    className="bi bi-twitter"
                  ></i>
                </a>
              )}{" "}
              {socialmedia?.facebook && (
                <a
                  href={`https://facebook.com/profile.php?id=${socialmedia.facebook}`}
                  target="_blank"
                >
                  <i
                    style={{ color: isColorTrue && colors.footer_text }}
                    className="bi bi-facebook"
                  ></i>
                </a>
              )}
            </div>
          </div>
          <div className="footer__div__top__right">
            <ul className="footer__div__top__right__notifications">
              <li
                style={{
                  color: isColorTrue && colors.footer_text,
                  borderBottom: `1px solid ${colors.footer_text}`,
                }}
                className="footer__div__top__right__notifications__heading"
              >
                Company
              </li>
              <li>
                <Link
                  to={"/products"}
                  onClick={scrollToTop}
                  style={{
                    fontSize:"0.66rem",
                    whiteSpace: "nowrap",
                    color: isColorTrue && colors.footer_text,
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to={"/about"}
                  onClick={scrollToTop}
                  style={{
                    fontSize:"0.66rem",
                    whiteSpace: "nowrap",
                    color: isColorTrue && colors.footer_text,
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  style={{
                    fontSize:"0.66rem",
                    textDecoration: "none",
                    color: isColorTrue && colors.footer_text,
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  to={"/contact"}
                  onClick={scrollToTop}
                >
                  Contact us
                </Link>
              </li>
              {/* <li>
                <Link
                  to={"/privacypolicy"}
                  style={{ whiteSpace: "nowrap" }}
                  onClick={scrollToTop}
                >
                  Privacy Policy
                </Link>
              </li> */}
              {/* <li>
                <Link
                  style={{ whiteSpace: "nowrap" }}
                  to={"/termsandcondistion"}
                  onClick={scrollToTop}
                >
                  FAQs
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="footer__div__top__right">
            <ul className="footer__div__top__right__notifications">
              <li
                style={{
                  color: isColorTrue && colors.footer_text,
                  borderBottom: `1px solid ${colors.footer_text}`,
                }}
                className="footer__div__top__right__notifications__heading"
              >
                {/* INFORMATION */}
                Services
              </li>
              <li>
                <button
                  style={{
                    textAlign: "left",
                    fontSize:"0.66rem",
                    color: isColorTrue && colors.footer_text,
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    // paddingBottom: "1px",
                    // transition: "border-bottom 0.3s ease",
                    background: "none", // Removes default button styles
                    border: "none", // Removes default button border
                    cursor: "pointer", // Makes it behave like a link
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleMyOrderClick}
                >
                  My order
                </button>

                {/* <Link
                  to={"/order-history"}
                  onClick={scrollToTop}
                  style={{
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  My order
                </Link> */}
              </li>
              <li>
                <button
                  style={{
                    textAlign: "left",
                    fontSize:"0.66rem",
                    color: isColorTrue && colors.footer_text,
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    // paddingBottom: "1px",
                    // transition: "border-bottom 0.3s ease",
                    background: "none", // Removes default button styles
                    border: "none", // Removes default button border
                    cursor: "pointer", // Makes it behave like a link
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleTrackOrderClick}
                >
                  Track your order
                </button>
              </li>
              <li>
                <Link
                  style={{
                    textDecoration: "none",
                     
                    color: isColorTrue && colors.footer_text,
                    borderBottom: "2px solid transparent",
                    // paddingBottom: "1px",
                    // transition: "border-bottom 0.3s ease",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  // to={"/termsandcondistions"}
                  onClick={scrollToTop}
                >
                  {/* Return and refunds */}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__div__top__right">
            <ul className="footer__div__top__right__notifications">
              <li
                style={{
                  color: isColorTrue && colors.footer_text,
                  borderBottom: `1px solid ${colors.footer_text}`,
                }}
                className="footer__div__top__right__notifications__heading"
              >
                {/* INFORMATION */}
                Information
              </li>
              <li>
                <Link
                  style={{
                    textDecoration: "none",
                    fontSize:"0.66rem",
                    color: isColorTrue && colors.footer_text,
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={openPrivacyPolicy}
                >
                   Returns and refunds
                </Link>
              </li>
              <li>
                <Link
                  style={{
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                    fontSize:"0.66rem",
                    color: isColorTrue && colors.footer_text,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(a)=>openTermsAndConditions(a,"Terms of Services and Privacy Policy")}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  style={{
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                    fontSize:"0.66rem",
                    color: isColorTrue && colors.footer_text,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(a)=>openTermsAndConditions(a,"Terms of Services and Privacy Policy")}
                  >
                
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  style={{
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    paddingBottom: "1px",
                    transition: "border-bottom 0.3s ease",
                    fontSize:"0.66rem",
                    color: isColorTrue && colors.footer_text,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleTermsOpen}
                  >
                T&C - Report inappropriate content
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Divider sx={{ background: colors.footer_text }} />
      {/* <div className="footer__div__line"  style={{backgroundColor:`${colors.footer_text}`,height:"0.5px"}} ></div> */}
      <div className="footer__div__bottom">
        <div className="footer__div__bottom__left">
          <span
            style={{ color: isColorTrue && colors.footer_text }}
          >{`Copyright © 2024 ${webDetails?.websiteInfo.store_name}. All rights reserved.`}</span>
          {/* <span> © The Vet Store</span> */}
        </div>
        <div className="footer__div__bottom__right">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <span style={{ color: isColorTrue && colors.footer_text }}>
              We accept:
            </span>
            <div style={{ width: "2.2rem", marginInlineStart: "5px" }}>
              <img
                src={amex}
                style={{
                  width: "100%",
                  height: "100%",
                  filter: !isDarkBackground
                    ? `drop-shadow(2px 4px 6px ${colors.footer_text})`
                    : "none",
                }}
                alt="amex"
              />
            </div>
            <div style={{ width: "2.2rem", marginInlineStart: "5px" }}>
              <img
                src={visa}
                style={{
                  width: "100%",
                  height: "100%",
                  filter: !isDarkBackground
                    ? `drop-shadow(2px 4px 6px ${colors.footer_text})`
                    : "none",
                }}
                alt="visa"
              />
            </div>
            <div style={{ width: "1.8rem", marginInlineStart: "5px" }}>
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  filter: !isDarkBackground
                    ? `drop-shadow(2px 4px 6px ${colors.footer_text})`
                    : "none",
                }}
                src={require("../../assets/images/mastercard.png")}
                alt="master"
              />
            </div>
            <div style={{ width: "2.2rem", marginInlineStart: "5px" }}>
              <img
                src={apple}
                alt="amex"
                style={{
                  width: "100%",
                  height: "100%",
                  filter: !isDarkBackground
                    ? `drop-shadow(2px 4px 6px ${colors.footer_text})`
                    : "none",
                }}
              />
            </div>
            <div style={{ width: "2.2rem" }}>
              <Capitec
                style={{
                  width: "100%",
                  height: "100%",
                  filter: !isDarkBackground
                    ? `drop-shadow(2px 4px 6px ${colors.footer_text})`
                    : "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {
        <PrivacyPolicy
          isOpen={isOpenPrivacy}
          openPrivacyPolicy={openPrivacyPolicy}
        />
      }
      {
        <TermsAndConditions
          isOpen={isOpenTerms}
          setHeader_text={header_text}
          openTermsAndConditions={openTermsAndConditions}
        />
      }
      
      {
        <InappropriateContent  termsOpen={termsOpen} handleTermsClose={handleTermsClose}/>
      }
       

    </footer>
  );
}

export default NewFooter;

// <div className="footer__div__top__right">
// <ul className="footer__div__top__right__notifications">
//   <li
//     className="footer__div__top__right__notifications__heading"
//     style={{ whiteSpace: "nowrap", }}
//   >
//     {/* TRUSTED AND SUPPORTED BY */}
//     Trusted and supported by
//   </li>
//   <div>
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "flex-start",
//         height: "40px",
//       }}
//     >
//       <img
//         src={ventureStudio}
//         style={{ width: "150px", height: "auto" }}
//         alt="venture"
//       />
//     </div>
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "flex-start",
//         height: "30px",
//       }}
//     >
//       <Shiprazor style={{ width: "150px", height: "30px" }} />
//     </div>
//     <div
//       style={{
//         display: "flex",
//         alignItems: "flex-start",
//         justifyContent: "flex-start",
//         height: "40px",
//         marginLeft: "-10px",
//       }}
//     >
//       <PeachPayment style={{ width: "80px", height: "auto" }} />
//     </div>
//   </div>
// </ul>
// </div>
