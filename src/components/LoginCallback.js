import React, { useEffect } from 'react';
import authService from '../services/authService';
import { useHistory } from 'react-router-dom';

const LoginCallback = () => {
  const history = useHistory();

  useEffect(() => {
    authService.userManager.signinRedirectCallback().then(() => {
      history.push('/');
    }).catch(err => {
      console.error(err);
    });
  }, [history]);

  return <div>Logging you in...</div>;
};

export default LoginCallback;
