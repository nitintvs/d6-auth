import React, { useEffect } from 'react';
import { useAuth } from 'oidc-react';
import { useHistory, useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const auth = useAuth();
  const history = useNavigate();

  useEffect(() => {
    if (auth && auth.userData) {
      history.push('/'); // Redirect after successful login
    }
  }, [auth, history]);

  return <div>Loading...</div>;
};

export default CallbackPage;
