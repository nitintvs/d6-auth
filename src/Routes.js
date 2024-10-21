import React from 'react';
import { useAuth } from 'oidc-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import CallbackPage from './components/CallbackPage';
import SilentRenew from './components/SilentRenew';

const AppRoutes = () => {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <Router>
      <Routes>
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
        <Route path="/silent-renew" element={<SilentRenew />} />
        <Route path="/login/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
