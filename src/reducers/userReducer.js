export default function getUser(state = {
    user: null,
    doLogin: {
        open: false,
        handleLogin: undefined
    },
    isAuthOpen: false,
    refresh: false
}, action) {
    switch (action.type) {
        case "USER_DETAIL":
            return { ...state, user: action.value };
        case "LOGIN_OPEN":
            return { ...state, doLogin: action.value };
        case "AUTH_OPEN":
            return { ...state, isAuthOpen: action.value}
        case "REFRESH":
            return {...state, refresh: action.value}
        default:
            return state;
    }
}
