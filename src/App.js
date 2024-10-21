import React from 'react';
import { AuthProvider } from 'oidc-react';
import { oidcConfig } from './oidc-config';
import Routes from './Routes';

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <Routes />
    </AuthProvider>
  );
}

export default App;
