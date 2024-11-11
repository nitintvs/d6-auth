import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils';
import { authRouteConstants } from 'constants/routeConstants';

export const AuthorisedRoute = (props) => {
  const token = getAccessToken()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!token) {
      navigate(authRouteConstants.HOME)
    }
  }, [token])

  return props.children;
};
