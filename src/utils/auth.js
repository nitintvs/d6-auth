import store from "store/store"

export const updateUserDetail = (user) => {
    store.dispatch({
        type: 'USER_DETAIL',
        value: user
    })
}

export const handleOpenAuthDialog = (isDialogOpen) => {
    store.dispatch({
        type: 'AUTH_OPEN',
        value: isDialogOpen
    })
}

export const handleLoginModal = (isLoginDialogOpen, setLoginDialog) => {
    store.dispatch({
        type: 'LOGIN_OPEN',
        value: {
            open: isLoginDialogOpen,
            handleLogin: setLoginDialog
        }
    })
}

export const refreshUserDetail = (refreshFlag) => {
    store.dispatch({
        type: 'REFRESH',
        value: refreshFlag
    })
}
