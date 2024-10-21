import React from 'react';

const HomePage = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default HomePage;
