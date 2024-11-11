import { authRouteConstants } from "constants/routeConstants"
import { useEffect } from "react"
import { updateUserDetail } from 'utils/auth';
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const doLogout = () => {
        updateUserDetail()
        localStorage.removeItem('u-access-token')
        localStorage.removeItem('u-refresh-token')
        navigate(authRouteConstants.HOME)
    }

    useEffect(() => {
        doLogout();
    }, [])
}

export default Logout