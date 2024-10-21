import React from 'react';

const HomePage = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user?.profile?.name || 'User'}!</h1>
      <p>This is the Home Page after successful login.</p>
    </div>
  );
};

export default HomePage;
