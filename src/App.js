import React, { useState, useEffect } from 'react';
import authService from './services/authService'; // Authentication service
import HomePage from './components/HomePage';     // Home component after login
import LoginPage from './components/LoginPage';   // Login page component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    authService.getUser().then((currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        // Try silent login, if it fails, redirect to login page
        authService.silentLogin().catch(() => {
          authService.login(); // Full login redirect
        });
      }
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <HomePage user={user} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
