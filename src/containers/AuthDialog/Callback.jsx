import React, { useEffect } from 'react';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
console.log("auth",auth)


useEffect(() => {
  if (auth && auth.isAuthenticated && auth.userData && auth.userData.access_token) {
    // Store the token in local storage
    localStorage.setItem("u-access-token", auth.userData.access_token);
    console.log("Token saved to local storage:", auth.userData.access_token);
    
    // Navigate to a specific route
    navigate('/');
  } else {
    //     // Handle errors or redirect back to login if authentication fails
        console.error('Authentication failed');
        navigate('/');
      }
}, [auth, navigate]);
  // useEffect(() => {
  //   if (auth.isAuthenticated) {
  //     // Navigate to home after successful login
  //     navigate('/');
  //   } else {
  //     // Handle errors or redirect back to login if authentication fails
  //     console.error('Authentication failed');
  //     navigate('/');
  //   }
  // }, [auth, navigate]);

  return <div>Processing login...</div>;
};

export default CallbackPage;
