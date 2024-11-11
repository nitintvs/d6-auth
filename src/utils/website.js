import store from "store/store"

export const setAllCategoryList = (categories) => {
    store.dispatch({
        type: 'CATEGORIES',
        value: categories
    })
}

export const updateWebsiteDetail = (website) => {
    store.dispatch({
        type: 'WEBSITE',
        value: website
    })
}

export const updateCartCount = (refreshFlag) => {
    // store.dispatch({
    //     type: 'CART_COUNT',
    //     value: count
    // })
    store.dispatch({
        type: 'REFRESH_CART_COUNT',
        value: refreshFlag
    })
}

export const refreshCartCount = (refreshFlag) => {
    store.dispatch({
        type: 'REFRESH_CART_COUNT',
        value: refreshFlag
    })
}