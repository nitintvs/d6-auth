import React from 'react';
import { useAuth, User } from 'oidc-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import CallbackPage from './components/CallbackPage';
import SilentRenew from './components/SilentRenew';

const AppRoutes = () => {
  const auth = useAuth();
console.log("user",auth)
  const handleLogin = () => {
    auth.signIn();
  };

  const handleLogout = () => {
    auth.signOutRedirect({post_logout_redirect_uri:"https://d6auth.vercel.app/login"});
  };

  return (
    <Router>
      <Routes>
       {auth.userData? <Route
          path="/"
          element={
            <div>
              <HomePage user={auth.userData.profile} />
              <button onClick={handleLogout}>Logout</button>
            </div>
          }
        />:
        <Route
          path="/login"
          element={<LoginPage handleLogin={handleLogin} />}
        />}
        <Route path="/silent-renew" element={<SilentRenew />} />
        <Route path="/login/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
