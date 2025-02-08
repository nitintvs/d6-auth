import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { WebStorageStateStore } from "oidc-react";
import Routes from "routes/route";
import store from "store/store";
import { ColorProvider } from "utils/UIContext";
import { LoaderProvider } from "Context/LoaderContext";
import FullScreenLoader from "Context/FullScreenLoader";
import { AuthProvider } from "oidc-react";
import { oidcConfig as initialOidcConfig } from "./oidc-config";
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
const oidcConfig = { ...initialOidcConfig };
if (tokenNonce) {
  oidcConfig.acr_values = `token_nonce:${tokenNonce}`;
  localStorage.setItem("token_nonce", tokenNonce);
  console.log("Updated OIDC Config with token_nonce:", oidcConfig);
}else{
  tokenNonce= localStorage.getItem("token_nonce");
}

// Determine which version of the app to render and handle mobile differently
const isAuthApp = window?.location?.host === "multid6auth.vercel.app";

// Detect various environments
const isIframe = window !== window.parent;
const isD6WebView = /D6Suite/.test(window.navigator.userAgent) || window?.ReactNativeWebView;
const isNativeApp = /d6app|d6mobile/i.test(window.navigator.userAgent) || // Check for D6 native app
                   window?.webkit?.messageHandlers || // iOS WKWebView
                   window?.Android || // Android WebView
                   isD6WebView;

// Get parent origin for iframe communication
const parentOrigin = isIframe ? document.referrer : null;
const isD6ParentDomain = parentOrigin ? /d6|zipalong/i.test(new URL(parentOrigin).hostname) : false;

// Configure authentication based on environment
if (isIframe || isNativeApp) {
  // In iframe or native app - use existing auth context
  oidcConfig.automaticSilentRenew = true;
  oidcConfig.monitorSession = true;
  oidcConfig.prompt = 'none';
  oidcConfig.silentRequestTimeout = 10000; // 10 seconds timeout for silent requests
  
  // Use localStorage for persistent auth in trusted environments
  oidcConfig.userStore = new WebStorageStateStore({ 
    store: window.localStorage 
  });

  // Allow iframe embedding
  if (isIframe) {
    // Remove X-Frame-Options if present
    if (window.top !== window.self) {
      const meta = document.createElement('meta');
      meta.setAttribute('content', 'ALLOWALL');
      meta.setAttribute('http-equiv', 'X-Frame-Options');
      document.head.appendChild(meta);
    }
  }
} else if (isMobile) {
  // Regular mobile browser
  oidcConfig.automaticSilentRenew = false;
  oidcConfig.monitorSession = false;
  oidcConfig.prompt = 'login';
  oidcConfig.userStore = new WebStorageStateStore({ 
    store: window.sessionStorage 
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

if (isAuthApp) {
  // Render Auth-enabled App
  alert(`auth app",${isMobile}, "tokenNonce",${tokenNonce}`)
  console.log("ismobile",isMobile)
  root.render(
    <React.StrictMode>
      <AuthProvider {...oidcConfig} autoSignIn={(tokenNonce||isMobile) ? true : false}>
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
       <AuthProvider {...oidcConfig} autoSignIn={false}>
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
