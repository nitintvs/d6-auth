import _ from 'lodash';

/**
 * 
 * Cart Item
 * [{ 
 *      ...product,
 *      quantity: 2,
 * }]
 */

// Function to retrieve cart items from local storage
export const getCartItemsFromLocalStorage = () => {
    const cartItemsJson = localStorage.getItem('cartItems');
    return cartItemsJson ? JSON.parse(cartItemsJson) : [];
}

// Function to add cart items to local storage
export const addCartItemsToLocalStorage = (product) => {
    let cartItems = getCartItemsFromLocalStorage();
    let itemIndex = _.findIndex(cartItems, { id: product.id })
    if (itemIndex >= 0) {
        // console.log('Got product ', itemIndex)
        const quantity = cartItems[itemIndex].quantity
        cartItems[itemIndex] = {
            ...product,
            quantity: quantity + 1
        }
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        })
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to add cart items to local storage
export const updateCartItemsToLocalStorage = (product, action) => {
    let cartItems = getCartItemsFromLocalStorage();
    let itemIndex = _.findIndex(cartItems, { id: product.id })
    if (itemIndex >= 0) {
        const quantity = cartItems[itemIndex].quantity
        if (action == 1) 
            cartItems[itemIndex] = {
                ...product,
                quantity: quantity + 1
            }
        else if (action == 0 && quantity == 1) {
            removeCartItemsFromLocalStorage(product)
            return;
        } else if (action == 0) {
            cartItems[itemIndex] = {
                ...product,
                quantity: quantity - 1
            }
        }
    } else if (action == 1) {
        cartItems.push({
            ...product,
            quantity: 1
        })
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to remove cart items to local storage
export const removeCartItemsFromLocalStorage = (product) => {
    let cartItems = getCartItemsFromLocalStorage();
    let itemIndex = _.findIndex(cartItems, { id: product.id })
    if (itemIndex >= 0) {
        _.remove(cartItems, { id: cartItems[itemIndex].id })
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Example usage: adding an item to the cart
export const getCartCountFromLocalStorage = (item) => {
    let cartItems = getCartItemsFromLocalStorage();
    let count = 0;
    for (let item of cartItems) {
        count = count + item.quantity
    }
    return count;
}

// Example usage: clear cart
export const clearCart = (item) => {
    localStorage.setItem('cartItems', '');
}

// Example usage: calculate cart summary
export const getCartSummaryFromLocalStorage = (item) => {
    let cartItems = getCartItemsFromLocalStorage();
    let subTotal = 0;
    for (let item of cartItems) {
        if (item.count != 0 && item.count >= item.quantity)
            subTotal = subTotal + parseInt(item.price)*item.quantity
    }
    return {
        cart_total: subTotal
    };
}

// Example usage: adding an item to the cart
export const addToCart = (item) => {
    let cartItems = getCartItemsFromLocalStorage();
    cartItems.push(item);
    addCartItemsToLocalStorage(cartItems);
}

// Example usage: retrieving cart items
// const cartItems = getCartItemsFromLocalStorage();
// console.log(cartItems);