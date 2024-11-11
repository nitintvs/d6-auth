export default function getWebsiteData(state = {
    allCategories: [],
    websiteInfo: {},
    refreshCart: false,
    cartCount: 0
}, action) {
    switch (action.type) {
        case "CATEGORIES":
            return {...state, allCategories: action.value };
        case "WEBSITE":
            return {...state, websiteInfo: action.value };
        case "REFRESH_CART_COUNT":
            return {...state, refreshCart: action.value };
        case "CART_COUNT":
            return {...state, cartCount: action.value };
        default:
            return state;
    }
}
