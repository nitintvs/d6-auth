import React from 'react';

const LoginPage = ({ handleLogin }) => {

    const handlSingin =(e)=>{
        e.preventDefault();
        handleLogin();
    }
  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={(e)=>handlSingin(e)}>Login</button>
    </div>
  );
};

export default LoginPage;
