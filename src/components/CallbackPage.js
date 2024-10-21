import React, { useEffect } from 'react';
import { useAuth } from 'oidc-react';
import { useHistory, useNavigate } from 'react-router-dom';
import { useOidcAccessToken, useOidcUser } from 'oidc-react';
const CallbackPage = () => {

  const auth = useAuth();
  const { accessToken } = useOidcAccessToken();
  const { userData } = useOidcUser();
  const history = useNavigate();
console.log("auth",auth,accessToken,userData)
  useEffect(() => {
    if (auth && auth.userData) {
      history.push('/');
    }
  }, [auth, history]);

  return <div>Loading...</div>;
};

export default CallbackPage;
