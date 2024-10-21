import React from 'react';

const LoginPage = ({ handleLogin }) => {
  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={()=>handleLogin();}>Login</button>
    </div>
  );
};

export default LoginPage;
