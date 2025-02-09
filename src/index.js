import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Routes from "routes/route";
import store from "store/store";
import { ColorProvider } from "utils/UIContext";
import { LoaderProvider } from "Context/LoaderContext";
import FullScreenLoader from "Context/FullScreenLoader";

import { AuthProvider, useAuth } from "oidc-react";
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

// Clone and update the OIDC config with token_nonce if present
const oidcConfig = { ...oidcConfig };
if (tokenNonce) {
  oidcConfig.acr_values = `token_nonce:${tokenNonce}`;
  localStorage.setItem("token_nonce", tokenNonce);
  console.log("Updated OIDC Config with token_nonce:", oidcConfig);
}else{
  tokenNonce= localStorage.getItem("token_nonce");
  oidcConfig.acr_values = `token_nonce:${tokenNonce}`;
}

const userManager = createUserManager();

// Determine which version of the app to render
const isAuthApp = window?.location?.host === "multid6auth.vercel.app";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (isAuthApp) {
  // Render Auth-enabled App
  alert(`auth app"tokenNonce",${tokenNonce}`)
  alert(`window location",${window.location}`)
  alert(`oidc config",${oidcConfig}`)
  console.log("ismobile",isMobile)
  root.render(
    <React.StrictMode>
      <AuthProvider {...oidcConfig} userManager={userManager} autoSignIn={(tokenNonce||isMobile) ? true : false}>
      <SilentRenewToken />
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
} else {
  // Render Regular App
  root.render(
    <React.StrictMode>
       <AuthProvider {...oidcConfig} userManager={userManager} autoSignIn={false}>
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
}
