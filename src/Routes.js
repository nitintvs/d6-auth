import React from 'react';
import { useAuth } from 'oidc-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import CallbackPage from './components/CallbackPage';
import SilentRenew from './components/SilentRenew';

const AppRoutes = () => {
  const auth = useAuth();
  
  const handleLogin = (e) => {
    e.prventDefault();
    auth.signIn(); // Trigger login flow only when the button is clicked
  };

  const handleLogout = () => {
    auth.signOutRedirect({ post_logout_redirect_uri: "https://d6auth.vercel.app/login" });
  };

  return (
    <Router>
      <Routes>
        {/* Show HomePage if authenticated, otherwise show LoginPage */}
        <Route 
          path="/" 
          element={
            auth.userData ? (
              <div>
                <HomePage user={auth.userData.profile} />
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <LoginPage handleLogin={handleLogin} />
            )
          } 
        />
        
        {/* Handle OIDC callbacks */}
        <Route path="/silent-renew" element={<SilentRenew />} />
        <Route path="/login/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
