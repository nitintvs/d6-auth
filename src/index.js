import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import Routes from "routes/route";
import store from "store/store";
import { ColorProvider } from "utils/UIContext";
import { LoaderProvider } from "Context/LoaderContext";
import FullScreenLoader from "Context/FullScreenLoader";
import { AuthProvider } from "oidc-react";
import { oidcConfig, createUserManager } from "./oidc-config";
import { isMobile } from "react-device-detect";
import SilentRenewToken from "AuthWrapper";

// Helper function to get URL parameters
const getParameterByName = (name, url) => {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(url || window.location.href);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// Check for token_nonce in URL
let tokenNonce = getParameterByName("token_nonce");

// Update the OIDC config with token_nonce if present
const finalOidcConfig = { ...oidcConfig };
if (tokenNonce) {
  finalOidcConfig.acr_values = `token_nonce:${tokenNonce}`;
  localStorage.setItem("token_nonce", tokenNonce);
} else if (localStorage.getItem("token_nonce")) {
  tokenNonce = localStorage.getItem("token_nonce");
  finalOidcConfig.acr_values = `token_nonce:${tokenNonce}`;
}

console.log('OIDC Config:', finalOidcConfig); // Debug log

const userManager = createUserManager(finalOidcConfig);

// Determine which version of the app to render
const isAuthApp = window?.location?.host === "multid6auth.vercel.app";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Render Auth App
if (isAuthApp) {
  root.render(
    <React.StrictMode>
      <AuthProvider {...finalOidcConfig} userManager={userManager} autoSignIn={(tokenNonce || isMobile)? true : false}>
        <SilentRenewToken />
        <Provider store={store}>
          <ColorProvider>
            <LoaderProvider>
              <SnackbarProvider autoHideDuration={3000} maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
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
} else {
  // Render Regular App
  root.render(
    <React.StrictMode>
      <AuthProvider {...finalOidcConfig} userManager={userManager}>
        <Provider store={store}>
          <ColorProvider>
            <LoaderProvider>
              <SnackbarProvider autoHideDuration={3000} maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
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
}
