import React, { useEffect } from 'react';
import { useAuth } from 'oidc-react';
import { useHistory, useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const auth = useAuth();
  const history = useNavigate();
console.log("auth",auth)
  useEffect(() => {
    if (auth && auth.userData) {
      history.push('/');
    }
  }, [auth, history]);

  return <div>Loading...</div>;
};

export default CallbackPage;
