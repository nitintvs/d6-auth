export const getAccessToken = () => {
    return localStorage.getItem('u-access-token')
} 

export const getDomain = () => {
    const { location } = window;
    console.log('Location ====== ', location)
}