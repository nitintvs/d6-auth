import React, { useEffect, useRef, useState } from "react";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  InputBase,
  Autocomplete,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Popper,
  Divider,
} from "@mui/material";

import { blue } from "@mui/material/colors";
import CallIcon from "@mui/icons-material/Call";
import AppsIcon from "@mui/icons-material/Apps";
import axiosInstance from "configs/axiosConfig";
import Person from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import ShoppingCart from "@mui/icons-material/ShoppingCart";
import {
  APIRouteConstants,
  authRouteConstants,
} from "constants/routeConstants";
import {
  setAllCategoryList,
  updateCartCount,
  updateWebsiteDetail,
} from "utils/website";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

import _ from "lodash";
import SecondaryAppBar from "containers/SecondaryAppBar";
import SecondaryAppBar1 from "containers/SecondaryAppBar/index1";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "inherit",
  display: "flex",
  padding: theme.spacing(0, 1, 0, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,

  "& .MuiInputBase-root": {
    transition: theme.transitions.create("width"),
    width: "100%",
    color: "white",
  },
  "& .MuiAutocomplete-endAdornment": {
    // display: 'none',
    border: "none",
    "& .MuiAutocomplete-popupIndicator": {
      color: "white",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "white",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent", // Remove outline color when focused
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent", // Remove outline color on hover
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent", // Remove default outline color
    },
  },
}));

function SearchAppBar({
  pages = [],
  settings = [],
  showToggleMenu,
  appTitle = "",
  logo,
  iconItems = [],
  user = null,
  searchProductList,
  productList,
  handleOpenAuthDialog,
}) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const [cartCount, setCartCount] = useState();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleOpenCategory = (event) => {
    setAnchorElCategory(event.currentTarget);
  };

  const handleCloseCategory = () => {
    setAnchorElCategory(null);
  };

  const navItems = [
    {
      title: "About",
      icon: <InfoIcon />,
      path: "/about",
    },
    {
      title: "Categories",
      icon: <CategoryIcon />,
      handleClick: handleOpenCategory,
      isDropdown: true,
      isMobileView: false,
      path: "/products",
    },
    {
      title: "Shop",
      icon: <ShoppingBagIcon />,
      path: "/products",
    },
  ];

  const [loader, setLoader] = useState(false);
  const webDetails = useSelector((state) => state.webDetails);
  const colors = {header_bg:webDetails?.websiteInfo?.header_bg?webDetails?.websiteInfo?.header_bg:"#000", header_text:webDetails?.websiteInfo?.header_text?webDetails?.websiteInfo?.header_text:"#fff"};
  const { allCategories, websiteInfo, refreshCart } = webDetails;
  const [filteredCategories, setFilteredCategory] = useState({
    categories: [],
    type: "nested",
  });
  const [anchorElCategory, setAnchorElCategory] = useState(null);
  const [searchStr, setSearchStr] = useState("");
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [openmenu, setmenuOpen] = useState(false);
  const filterCategory = (categories) => {
    let _categories = [];
    let _filteredCategories = [];
    let categoryTypeSimple = true;
    for (let category of categories) {
      if (!category.parent) {
        _categories.push(category);
      }
    }
    for (let category of _categories) {
      let list = _.filter(categories, { parent: category.id });
      if (list.length > 0) categoryTypeSimple = false;
      _filteredCategories.push({
        ...category,
        child: list,
      });
    }

    setFilteredCategory({
      categories: _filteredCategories,
      type: categoryTypeSimple ? "simple" : "nested",
    });
  };

  const getCategoryList = async () => {
    setLoader(true);
    let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.ALL_CATEGORY);
    let { data, response } = res;

    if (data) {
      setAllCategoryList(data);
    }
    setLoader(false);
  };
  useEffect(() => {
    if (!allCategories.length) getCategoryList();
    else {
      filterCategory(allCategories);
    }
  }, [allCategories]);

  useEffect(() => {
    if (inputValue) searchProductList(inputValue, setSearchLoading);
    else searchProductList(null, setSearchLoading);
  }, [inputValue]);

  const rightNavItems = [
    {
      title: "Contact Us",
      icon: <CallIcon />,
      path: "/contact",
    },
  ];

  const userSettings = [
    {
      title: "My Account",
      icon: <AccountCircle />,
      path: "/user-setting",
    },
    {
      title: "My Order",
      icon: <AppsIcon />,
      path: "/order-history",
    },
    {
      title: "Logout",
      icon: <LogoutIcon />,
      path: authRouteConstants.LOGOUT,
    },
  ];
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [underline, setUnderline] = useState("transparent");
  
  useEffect(()=>{
    setUnderline("#fff")
  },[])


  // useEffect(() => {
  //   const accesstokendata = sessionStorage.getItem("oidc.user:https://id.zipalong.tech:webbieshop-wt");
    
  //   if (accesstokendata) {
  //     try {
  //       const parsedData = JSON.parse(accesstokendata); // Parse the JSON string
  //       if (parsedData?.access_token) {
  //         localStorage.setItem("D6-access-token", parsedData.access_token); // Store in localStorage
  //         console.log("Access token saved in localStorage:", parsedData.access_token);
  //       } else {
  //         console.warn("Access token not found in accesstokendata.");
  //       }
  //     } catch (error) {
  //       console.error("Error parsing accesstokendata:", error);
  //     }
  //   } else {
  //     console.warn("No accesstokendata found in sessionStorage.");
  //   }
  // }, []);

  const CustomPopper = styled(Popper)(({ theme }) => ({
    width: "100% !important",
    padding:"10px",
    // margin:"10px",
    margin:"auto",
    minWidth: "150px !important",
  }));

  console.log("filtercategory1", websiteInfo);
  return (
    <AppBar
      position="static"
      sx={{ p: 0, background: colors.header_bg }}
      className="search-navbar"
    >
      <Container maxWidth="xl" style={{ p: 0 }}>
        <Toolbar disableGutters>
          <SecondaryAppBar1
            navItems={navItems}
            colors={colors}
            rightNavItems={rightNavItems}
            anchor="left"
            settings={userSettings}
            user={user}
            handleOpenAuthDialog={() => handleOpenAuthDialog(true)}
            iconItems={[
              {
                title: "Cart",
                icon: cartCount ? (
                  <Badge
                    badgeContent={cartCount}
                    showZero={!cartCount}
                    color="info"
                  >
                    <Typography fontSize="xl">
                      <ShoppingCart
                        sx={{ color: blue[200], fontSize: "1.6rem" }}
                      />
                    </Typography>
                  </Badge>
                ) : (
                  <ShoppingCart sx={{ color: blue[200], fontSize: "1.6rem" }} />
                ),
                path: "/cart",
                helpText: "Open Cart",
                isMobileView: true,
                isAuth: false,
              },
            ]}
          />
          <div
            className="logo-wrapper"
            onClick={() => {
              if (webDetails?.websiteInfo?.store_name === "The Vet Store") {
                window.open("https://thevetstore.co.za/", "_blank");
              }
              navigate("/");
            }}
          >
           
            <img
              src={logo || require("../../../assets/images/logo.png")}
              alt="logo"
            />
          </div>
          <Typography
            variant="h5"
            noWrap
            component="span"
            onClick={() => {
              console.log("user",websiteInfo)
              if (webDetails?.websiteInfo?.store_name === "The Vet Store") {
                window.open("https://thevetstore.co.za/", "_blank");
              }else {
                navigate("/");
              }
            }}
            sx={{
              mr: 2,
              display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 600,
              fontSize: "1.1rem",
              letterSpacing: ".2rem",
              color: colors.header_text,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {appTitle}
          </Typography>
          <Box
            width={"50%"}
            className="link-bar"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                flexGrow: 0,
                textAlign: "center",
                display: { xs: "none", sm: "none", md: "flex" },
              }}
            >
              <Link
                style={{
                  textDecoration: isHovered1 ? "underline" : "none",
                  textDecorationColor: isHovered1
                    ? colors.header_text
                    : "transparent", // Underline color on hover
                  color: colors.header_text,
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  transition: "text-decoration-color 0.3s",
                  // Smooth transition for underline color
                }}
                onMouseEnter={() => setIsHovered1(true)}
                onMouseLeave={() => setIsHovered1(false)}
                to={"/about"}
              >
                About us
              </Link>
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "none", sm: "none", md: "flex" },
              }}
            >
              {
                // <Menu
                //   sx={{ mt: "45px" }}
                //   id="menu-appbar"
                //   anchorEl={anchorElCategory}
                //   anchorOrigin={{
                //     vertical: "top",
                //     horizontal: "right",
                //   }}
                //   keepMounted
                //   transformOrigin={{
                //     vertical: "top",
                //     horizontal: "right",
                //   }}
                //   open={Boolean(anchorElCategory)}
                //   onClose={handleCloseCategory}
                // >
                //   <Grid container spacing={0} sx={{ padding: 0 }} >
                //     {filteredCategories.type === "simple" ? (
                //       <Grid item xs={12} >
                //         <Box
                //           sx={{
                //             display: "flex",
                //             flexDirection: "row",
                //             alignItems: "center",
                //           }}
                //         >
                //           {filteredCategories.categories.map((parent) => (
                //             <MenuItem
                //               key={parent.id}
                //               onClick={() => {
                //                 navigate(`/products?category=${parent.name}`);
                //               }}
                //               sx={{ width: "100%", justifyContent: "center" }}
                //             >
                //               <Typography
                //                 textAlign="center"
                //                 color={"#00000099"}
                //                 fontSize={"0.8rem"}
                //               >
                //                 {parent.name}
                //               </Typography>
                //             </MenuItem>
                //           ))}
                //         </Box>
                //       </Grid>
                //     ) : (
                //       filteredCategories.categories.map((parent) => (
                //         <Grid item xs={12} key={parent.id}>
                //           <Box
                //             sx={{
                //               display: "flex",
                //               flexDirection: "row",
                //               alignItems: "center",
                //             }}
                //           >
                //             <MenuItem
                //               onClick={() => {
                //                 navigate(`/products?category=${parent.name}`);
                //               }}
                //               sx={{
                //                 width: "100%",
                //                 justifyContent: "center",
                //                 marginBottom: 1,
                //               }}
                //             >
                //               <Typography textAlign="center">
                //                 {parent.name}
                //               </Typography>
                //             </MenuItem>
                //             {parent.child.length > 0 && (
                //               <Box
                //                 sx={{
                //                   display: "flex",
                //                   flexDirection: "column",
                //                   alignItems: "center",
                //                 }}
                //               >
                //                 {parent.child.map((category) => (
                //                   <MenuItem
                //                     key={category.id}
                //                     onClick={() => {
                //                       navigate(
                //                         `/products?category=${category.name}`
                //                       );
                //                     }}
                //                     sx={{
                //                       width: "100%",
                //                       justifyContent: "center",
                //                     }}
                //                   >
                //                     <Typography textAlign="center">
                //                       {category.name}
                //                     </Typography>
                //                   </MenuItem>
                //                 ))}
                //               </Box>
                //             )}
                //           </Box>
                //         </Grid>
                //       ))
                //     )}
                //   </Grid>
                // </Menu>
              }
              <Menu
                sx={{ mt: "45px", maxWidth: "350px" }}
                id="menu-appbar"
                anchorEl={anchorElCategory}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={Boolean(anchorElCategory)}
                onClose={handleCloseCategory}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    "& > .MuiGrid-item": {
                      marginLeft: "12px",
                      marginTop: "2px",
                      padding: "2px",
                    },
                  }}
                >
                  {filteredCategories.type === "simple" ? (
                    <Grid item xs={12}>
                      {filteredCategories.categories.map((parent) => (
                        <MenuItem
                          key={parent.id}
                          onClick={() => {
                            navigate(`/products?category=${parent.name}`);
                          }}
                          sx={{
                            justifyContent: "flex-start",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                        >
                           <Typography
                              textAlign={"left"}
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: "#000000DE",
                              }}
                            >
                              {parent.name}
                            </Typography>
                        </MenuItem>
                      ))}
                    </Grid>
                  ) : (
                    filteredCategories.categories.map((parent) => (
                      <Grid item xs={12} key={parent.id}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate(`/products?category=${parent.name}`);
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "flex-start",
                              width: "100%",
                              // borderRadius: "8px",
                              "&:hover": {
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                          >
                            <Typography
                              textAlign={"left"}
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: "#000000DE",
                              }}
                            >
                              {parent.name}
                            </Typography>
                          </MenuItem>
                          {parent.child.length > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                width: "100%",
                                flexDirection: "column",
                                // paddingLeft: "20px",
                              }}
                            >
                              {parent.child.map((category) => (
                                <MenuItem
                                  key={category.id}
                                  onClick={() => {
                                    navigate(
                                      `/products?category=${category.name}`
                                    );
                                  }}
                                  sx={{
                                    padding: "4px 26px",
                                    // borderRadius: "8px",
                                    "&:hover": {
                                      backgroundColor: "#f0f0f0",
                                    },
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.7rem",
                                      fontWeight: "400",
                                    }}
                                  >
                                    {category.name}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Menu>

              <Button
                variant="text"
                sx={{
                  color: colors.header_text,
                  fontSize: "0.72rem",
                  textTransform: "none",
                  fontWeight: "700",
                  "&:hover": {
                    textDecoration: "underline",
                    textDecorationColor: colors.header_text, // Set the color of the underline
                  },
                }}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleOpenCategory}
              >
                Categories
              </Button>
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "none", sm: "none", md: "flex" },
              }}
            >
              <Link
                style={{
                  textDecoration: isHovered ? "underline" : "none",
                  textDecorationColor: isHovered
                    ? colors.header_text
                    : "transparent", // Underline color on hover
                  color: colors.header_text,
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  transition: "text-decoration-color 0.3s", // Smooth transition for underline color
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                to="/products"
              >
                Shop
              </Link>
            </Box>
          </Box>

          {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} /> */}

          <Search
            sx={{ display: { xs: "none", md: "flex" } }}
            // sx={{ display: { xs: "none", md: "flex" },boxShadow:`0.5px 0.1px 0.1px 0.01px ${colors.header_text}`}}
            className="search-bar"
          >
            <SearchIconWrapper className="search-icon">
              <SearchIcon style={{ color: colors.header_text }} />
            </SearchIconWrapper>
            <Autocomplete
              id="product-search"
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
              }
              filterOptions={(x) => x}
              options={productList}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              size="small"
              loading={searchLoading}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "0.7rem",
                  color: colors.header_text,
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.8rem",
                  color: colors.header_text,
                },
              }}
              noOptionsText={
                <Typography sx={{ fontSize: "0.7rem", width: "100%" }}>
                  Search products, store or brands{" "}
                </Typography>
              }
              style={{
                width: "100%",
                display: "flex",
              }}
              onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <StyledInputBase
                  placeholder="Search products, store or brands "
                  {...params}
                  fullWidth
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      fontSize: "0.7rem",
                    },
                  }}
                  style={{}}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                return (
                  <li {...props} className="auto-search-item-wrapper">
                    <Grid
                      onClick={() => {
                        navigate(`/product/${option.id}`);
                      }}
                      container
                      alignItems="center"
                      className="auto-search-item-container"
                    >
                      <Grid
                        item
                        sx={{ display: "flex", width: "55px" }}
                        className="auto-search-item-img"
                      >
                        <img src={option.product_image} alt={option.name} />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          width: "calc(100% - 55px)",
                          wordWrap: "break-word",
                        }}
                        className="auto-search-item-detail"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {/* <b>{option.category_name}</b>{" - "}{option.name} */}
                          <b>{option.name}</b>
                          {" in "}
                          {option.category_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />
          </Search>

          {/* Display Mobile */}
          {showToggleMenu && (
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", sm: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                // keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", sm: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {!showSearch && (
            <Typography
              variant="span"
              className="logo-title"
              noWrap
              component="a"
              onClick={() => navigate("/")}
              sx={{
                mr: 2,
                display: { xs: "flex", sm: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,

                letterSpacing: ".2rem",
                color: colors.header_text,
                textDecoration: "none",
                fontFamily: "'Mulish', sans-serif",
                fontSize: {
                  xs: "1.2rem !important",
                  sm: "1.5rem !important",
                },
              }}
            >
              {appTitle}
            </Typography>
          )}

          {!showSearch && (
            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              aria-label="search"
              onClick={handleSearch}
              color="inherit"
            >
              <SearchIcon style={{ color: colors.header_text }} />
            </IconButton>
          )}

          {showSearch && (
            <Search
              sx={{ display: { xs: "flex", md: "none" }, mr: 0 }}
              className="search-bar"
            >
              <SearchIconWrapper className="search-icon">
                <SearchIcon />
              </SearchIconWrapper>
              <Autocomplete
                id="product-search"
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                PopperComponent={CustomPopper}
                filterOptions={(x) => x}
                options={productList}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                size="small"
                loading={searchLoading}
                noOptionsText="Search product ... "
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: "0.7rem",
                  },
                }}
                onBlur={() => {
                  handleSearch();
                }}
                onChange={(event, newValue) => {
                  setOptions(newValue ? [newValue, ...options] : options);
                  setValue(newValue);
                  handleSearch();
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <StyledInputBase
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  return (
                    <li {...props} className="auto-search-item-wrapper">
                      <Grid
                        onClick={() => {
                          navigate(`/product/${option.id}`);
                        }}
                        container
                        alignItems="center"
                        className="auto-search-item-container"
                      >
                        <Grid
                          item
                          sx={{ display: "flex", width: "55px" }}
                          className="auto-search-item-img"
                        >
                          <img src={option.product_image} alt={option.name} />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: "calc(100% - 55px)",
                            wordWrap: "break-word",
                          }}
                          className="auto-search-item-detail"
                        >
                          <Typography variant="body2" color="text.secondary">
                            {/* <b>{option.category_name}</b>{" - "}{option.name} */}
                            <b>{option.name}</b>
                            {" in "}
                            {option.category_name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </li>
                  );
                }}
              />
            </Search>
          )}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "baseline" }}>
            {iconItems.map((item, i) =>
              (item.isAuth && user) || !item.isAuth ? (
                <Tooltip title={item.helptext}>
                  <Box
                    sx={{
                      display: {
                        xs: item.isMobileView ? "flex" : "none",
                        md: "flex",
                      },
                    }}
                  >
                    <IconButton
                      onClick={item.handleClick}
                      sx={{ p: 0, color: colors.header_text }}
                      className="icon-wrapper"
                    >
                      {item.icon}
                    </IconButton>
                  </Box>
                </Tooltip>
              ) : (
                ""
              )
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", sm: "none", md: "flex" },
            }}
          >
            {!user ? (
              <Button
                sx={{
                  color: colors.header_text,
                  marginLeft: "1rem",
                  fontSize: "0.72rem",
                  textTransform: "none",
                  fontWeight: "700",
                  "&:hover": {
                    textDecoration: "underline",
                    textDecorationColor: colors.header_text, // Set the color of the underline
                  },
                }}
                onClick={handleOpenAuthDialog}
              >
                Login
              </Button>
            ) : (
              ""
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", sm: "none", md: "flex" },
            }}
          >
            {/* <Link
              style={{
                textDecoration: "none",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: "500",
                whiteSpace:"nowrap"
              }}
              sx={{
                color: "#fff",
                marginLeft: "1rem",
                textDecoration: "none",
              }}
            >
              Contact us
            </Link> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default SearchAppBar;
