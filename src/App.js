// src/App.js
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ColorProvider } from "utils/UIContext";
import { LoaderProvider } from "Context/LoaderContext";
import FullScreenLoader from "Context/FullScreenLoader";
import Routes from "routes/route";
import store from "store/store";
import { AuthProvider } from "oidc-react";
import SilentRenewToken from "AuthWrapper";

const App = ({ oidcConfig, isAuthApp, tokenNonce, isMobile }) => {
  // Auto sign-in if tokenNonce is present OR on mobile
  const autoSignIn = isAuthApp && (tokenNonce || isMobile);

  return (
    <React.StrictMode>
      <AuthProvider {...oidcConfig} autoSignIn={autoSignIn}>
        {isAuthApp && <SilentRenewToken />}
        <Provider store={store}>
          <ColorProvider>
            <LoaderProvider>
              <SnackbarProvider
                autoHideDuration={3000}
                maxSnack={3}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <BrowserRouter>
                  <FullScreenLoader />
                  <Routes />
                </BrowserRouter>
              </SnackbarProvider>
            </LoaderProvider>
          </ColorProvider>
        </Provider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
