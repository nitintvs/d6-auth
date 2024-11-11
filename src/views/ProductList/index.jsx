import { useEffect, useState, forwardRef } from "react";

import { 
    Card, 
    CardContent, 
    Typography, 
    CardActions,
    Grid,
    Divider,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    Button,
    DialogContent,
    Slide,
    DialogContentText,
    DialogTitle,
    TablePagination
} from '@mui/material';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useMemo } from "react-router-dom";

import ShoppingCart from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

import CustomLayout from "views/CustomLayout";
import CustomBreadcrumbs from "components/Breadcrumbs";
import DropdownMenu from "components/DropdownMenu";
import DynamicFilter from "containers/DynamicFilter";
import Loader from 'components/Loader';
import axiosInstance from "configs/axiosConfig";
import { APIRouteConstants } from 'constants/routeConstants';

import { filterCategory } from 'constants/appData/filters'
import { productList } from 'constants/appData/productList'
// import { handleOpenAuthDialog } from "utils/auth";
import { getAccessToken } from "utils";
import { updateCartCount } from "utils/website";
import { addCartItemsToLocalStorage } from "utils/cart";
import { useSnackbar } from "notistack";
import { GLOBAL_CURRENCY } from "constants/appConstants";
import { ReactComponent as NoData } from 'assets/svgs/NoData.svg';
import { isMobile } from "react-device-detect";
import FilterDropdown from "containers/DynamicFilter/FilterDropdown";
import FlagContent from "components/InappropriateContent";
// import FlagContent from "components/InappropriateContent";

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: GLOBAL_CURRENCY.code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const FilterBar = ({
  totalCount,
  pageCount,
  handleChangePage,
  selectSort,
  sorting,
  filterCategory,
}) => (
  <Grid container className="filter-bar-wrapper">
    <Grid item xs={2} sm={3}  >
      <DropdownMenu
        name="Sort"
        menuList={[
          {
            value: "new",
            label: "What's New",
          },
          {
            value: "most_popular",
            label: "Most Popular",
          },
          {
            value: "price_low_to_high",
            label: "Price: Low to High",
          },
          {
            value: "price_high_to_low",
            label: "Price: High to Low",
          },
        ]}
        handleSelect={(e) => {
          selectSort(e);
        }}
        selectedMenu={sorting}
      />
    </Grid>
    <Grid item xs={3} sm={3}>
      <FilterDropdown filterCategory={filterCategory} type={"filter"} />
    </Grid>
    <Grid item xs={7} sm={6}>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={totalCount}
        rowsPerPage={totalCount < 10 ? totalCount : 10}
        page={pageCount}
        onPageChange={handleChangePage}
      />
    </Grid>
  </Grid>
);

const ProductCard = ({product, count, image, name, brand, price, handleClick, handleAddToCart }) => (
    <Card className="content-card" onClick={handleClick} style={{border:"1px solid #f7f7f7",filter: "drop-shadow(5px 5px 5px #f7f7f7)"}}>
        <div className="overlay-card-wrapper">
            <div className="content-media" style={{ height: isMobile && "250px" }}>
                <img src={image} alt={name} />
            </div>
            {!count ?
            <div className='overlay-card'>
                <Button style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} variant="outlined" color="error">
                    <b>Out of Stock</b>
                </Button>
            </div>
            : '' }
        </div> 
        <CardContent>
            <Typography  sx={{fontSize:{xs:"1.1rem",sm:"",md:"",lg:""},  minHeight:"3.5rem",maxHeight:"3.5rem"}}>
            {_.truncate(_.trim(brand), { length: 25 })}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
                {name}
            </Typography>
            <Typography variant="subtitle2" className="price">
                <b>{formatCurrency.format(price || 0)}</b>
            </Typography>
        </CardContent>
        <CardActions align="center" sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {count ?
            <Tooltip title="Add to Cart">
            <IconButton 
            onClick={e => {
                e.stopPropagation();
                handleAddToCart();
            }}>
                <ShoppingCart color='success'/>
            </IconButton>
            </Tooltip> :
            <Button style={{  width: '100%' }} size="small" variant="outlined">View</Button> }
            {/* <Button color="success" size="small" variant="outlined">Add To Cart</Button> */}
            <FlagContent productName={name} product={product} />
        </CardActions>
    </Card>
)

function queryStringToJSON(search) {
    if (!search) return {}
    var qs = search.slice(1);

    var pairs = qs.split('&');
    var result = {};
    pairs.forEach(function(p) {
        var pair = p.split('=');
        var key = pair[0];
        var value = decodeURIComponent(pair[1] || '');

        if( result[key] ) {
            if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                result[key].push( value );
            } else {
                result[key] = [ result[key], value ];
            }
        } else {
            result[key] = value;
        }
    });

    return JSON.parse(JSON.stringify(result));
};

const ProductList = ({ breadcrumbs }) => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const webDetails = useSelector(state => state.webDetails);
    const { allCategories } = webDetails;
    const loggedInUser = useSelector(state => state.userDetails);
    const { doLogin, isAuthOpen } = loggedInUser
    const [filteredCategories, setFilteredCategory] = useState([]);
    const [selectedCategory, selectCategory] = useState();
    const [allProducts, setProductList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    // const [askLogin, openAskLogin] = useState(false);
    const queryString = useLocation();
    const query = queryStringToJSON(queryString.search);
    const [sorting, selectSort] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const { search } = query;

    var token = getAccessToken();

    const filterCategory = (categories) => {
        let _categories = []
        let _filteredCategories = [];
        let categoryTypeSimple = true;
        for (let category of categories) {
            if (!category.parent) {
                _categories.push(category)
            }
        }
        for (let category of _categories) {
            let list = _.filter(categories, { parent: category.id})
            if (list.length > 0) categoryTypeSimple = false
            _filteredCategories.push({
                ...category,
                child: list
            })
        }

        setFilteredCategory({
            categories: _filteredCategories,
            type: categoryTypeSimple ? 'checkbox' : 'nested'
        })
    }

    useEffect(() => {
        if (allCategories.length > 0) {
            filterCategory(allCategories)
        }
    }, [allCategories.length])

    const getProductList = async (category) => {
        setLoader(true)
        let queryParams = {
            page: pageCount + 1
        }
        if (category) queryParams['category_name'] = category;
        if (sorting) queryParams['sort'] = sorting
        if (search) queryParams['query'] = search
        let res = await axiosInstance.get(APIRouteConstants.DASHBOARD.ALL_PRODUCT, {
            params: queryParams
        });
        let { data, response } = res;
    
        if (data && data.results) {
            setProductList(data.results)
            setTotalCount(data.count);
            setPageCount(data.current_page - 1);
        }
        setLoader(false)
    }

    useEffect(() => {
        if (!_.isEmpty(query.category)) {
            selectCategory(query.category)
        }
    }, [query.category])

    useEffect(() => {
        if (!_.isEmpty(selectedCategory)) {
            getProductList(selectedCategory)
        } else getProductList()
    }, [selectedCategory, pageCount, sorting, search])

    const handleChangePage = (event, newPage) => {
        console.log("newpage",newPage,)
        setPageCount(newPage)
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const addToCart = async (product) => {
        setLoader(true)
        if (!token) {
            addCartItemsToLocalStorage(product)
            getProductList()
            updateCartCount(true)
            // await delay(5000);
            enqueueSnackbar('Hey, this feels great! Product has been added to the cart.', { variant: 'success' })
        } else {
            let res = await axiosInstance.post(APIRouteConstants.DASHBOARD.ADD_TO_CART, {
                product_id: product.id
            });
            let { data, response } = res;

            if (response 
                && response.status === 400
                && response.data ) {
                    if (response.data.error) {
                        enqueueSnackbar(response.data.error, { variant: 'error' })
                    } else
                        for (let i in response.data) {
                            enqueueSnackbar(_.capitalize(i) + ': ' + response.data[i][0], { variant: 'error' });
                        }
            }

            if (data) {
                enqueueSnackbar('Hey, this feels great! Product has been added to the cart.', { variant: 'success' })
                updateCartCount(true)
            }
        }
        setLoader(false)
    }

    return (
        <CustomLayout>
            <Loader open={loader} />
            <div className="catalog-wrapper content-container">
                <CustomBreadcrumbs list={breadcrumbs} name="Products" />
                <Divider className="divider"/>
                <Grid container spacing={1} className="main-content-wrapper">
                    <Grid item md={3} className="category-wrapper">
                        <DynamicFilter 
                            filterCategory={[{
                                title: "Categories",
                                type: filteredCategories.type,
                                items: filteredCategories.categories || [],
                                selectedItem: selectedCategory,
                                handleSelect: (category) => {
                                    selectCategory(category)
                                    if (!_.isEmpty(query.category) && query.category != category) {
                                        navigate(`/products`)
                                    }
                                }
                            }]} 
                            />
                    </Grid>
                    <Grid item md={9} className="catalog-list-wrapper">
                        <div className="filter-wrapper">
                            <FilterBar 
                                totalCount={totalCount}
                                pageCount={pageCount}
                                handleChangePage={handleChangePage}
                                selectSort={selectSort}
                                sorting={sorting}
                                filterCategory={[{
                                    title: "Categories",
                                    type: filteredCategories.type,
                                    items: filteredCategories.categories || [],
                                    selectedItem: selectedCategory,
                                    handleSelect: (category) => {
                                        selectCategory(category)
                                        if (!_.isEmpty(query.category) && query.category != category) {
                                            navigate(`/products`)
                                        }
                                    }
                                }]} 
                            />
                            {/* <FilterDropdown 
                            filterCategory={[{
                                title: "Categories",
                                type: filteredCategories.type,
                                items: filteredCategories.categories || [],
                                selectedItem: selectedCategory,
                                handleSelect: (category) => {
                                    selectCategory(category)
                                    if (!_.isEmpty(query.category) && query.category != category) {
                                        navigate(`/products`)
                                    }
                                }
                            }]} 
                            /> */}
                        </div>
                        <Grid container className="catalog-list">
                            {allProducts.length > 0 ? allProducts.map((product, i) => (
                                <>
                                    {isMobile ? <Grid item xl={3} lg={4} md={6} sm={6} xs={6}>
                                        <ProductCard
                                            product={product}
                                            image={product.product_image}
                                            brand={product.category_name}
                                            name={_.truncate(_.trim(product.name, { length: 28 }))}
                                            price={product.price}
                                            mrp={product.price}
                                            discount={product.discount}
                                            count={product.count}
                                            handleClick={() => {
                                                navigate(`/product/${product.id}`)
                                            }}
                                            handleAddToCart={() => {
                                                addToCart(product)
                                            }}
                                        />
                                    </Grid> : <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
                                        <ProductCard
                                            product={product}
                                            image={product.product_image}
                                            brand={product.category_name}
                                            name={_.truncate(_.trim(product.name, { length: 28 }))}
                                            price={product.price}
                                            mrp={product.price}
                                            discount={product.discount}
                                            count={product.count}
                                            handleClick={() => {
                                                navigate(`/product/${product.id}`)
                                            }}
                                            handleAddToCart={() => {
                                                addToCart(product)
                                            }}
                                        />
                                    </Grid>
                                    }
                                </>
                            )) : <Grid container className="empty-wrapper">
                            <div className="icon-wrapper">
                                <NoData /> 
                            </div>
                            <span className="title">
                                No Product Available
                            </span> <br />
                            {/* <span className="description">
                                Please add some products to your shopping cart before proceeding to checkout. 
                            </span> */}
                            <span className="description">
                                Browse our shop categories to discover new arrivals and special offers. 
                            </span>
                            {/* <div className='button-wrapper'>
                                <Button variant="contained" href='/products'>
                                    RETURN TO SHOP
                                </Button>
                            </div> */}
                        </Grid>}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </CustomLayout>
    );
};

export default ProductList;
