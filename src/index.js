// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import { BrowserRouter, HashRouter } from "react-router-dom";

// import { SnackbarProvider } from 'notistack';
// import Routes from "routes/route";
// import store from "store/store";
// import { ColorProvider } from "utils/UIContext";
// import { LoaderProvider } from "Context/LoaderContext";
// import FullScreenLoader from "Context/FullScreenLoader";
// import { AuthProvider } from 'oidc-react';
// import { oidcConfig as initialOidcConfig } from "./oidc-config";

// // Helper function to get URL parameters
// const getParameterByName = (name, url) => {
//     name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
//     const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
//     const results = regex.exec(url || window.location.href);
//     return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
//   };
  
//   // Check for token_nonce in URL
//   const tokenNonce = getParameterByName("token_nonce");
  
//   // Clone and update the OIDC config with token_nonce if present
//   const oidcConfig = { ...initialOidcConfig };
//   if (tokenNonce) {
//     oidcConfig.acr_values = `token_nonce:${tokenNonce}`;
//     console.log("Updated OIDC Config with token_nonce:", oidcConfig);
//   }
  

// const root = ReactDOM.createRoot(document.getElementById("root"));
// console.log("location",window.location?.host==="d6auth.vercel.app")
// // console.log("location",window.location?.host==="sticitt.webbieshop.com")
// // sticiit.webbieshop.com
// root.render(
//     <React.StrictMode> 
//     <AuthProvider {...oidcConfig} autoSignIn={true} >
//         <Provider store={store}>
//             <ColorProvider>
//             <LoaderProvider>
//             <SnackbarProvider autoHideDuration={3000} maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
//                 <BrowserRouter>
//                 <FullScreenLoader/>
//                     <Routes />
//                 </BrowserRouter>
//             </SnackbarProvider>
//             </LoaderProvider>
//             </ColorProvider>
//         </Provider>
//     </AuthProvider>
//     </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Routes from "routes/route";
import store from "store/store";
import { ColorProvider } from "utils/UIContext";
import { LoaderProvider } from "Context/LoaderContext";
import FullScreenLoader from "Context/FullScreenLoader";

import { AuthProvider } from "oidc-react";
import { oidcConfig as initialOidcConfig } from "./oidc-config";
import { isMobile } from "react-device-detect";

// Helper function to get URL parameters
const getParameterByName = (name, url) => {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(url || window.location.href);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// Check for token_nonce in URL
const tokenNonce = getParameterByName("token_nonce");

// Clone and update the OIDC config with token_nonce if present
const oidcConfig = { ...initialOidcConfig };
if (tokenNonce) {
  oidcConfig.acr_values = `token_nonce:${tokenNonce}`;
  console.log("Updated OIDC Config with token_nonce:", oidcConfig);
}

// Determine which version of the app to render
const isAuthApp = window?.location?.host === "multid6auth.vercel.app";

const root = ReactDOM.createRoot(document.getElementById("root"));

if (isAuthApp) {
  // Render Auth-enabled App
  root.render(
    <React.StrictMode>
      <AuthProvider {...oidcConfig} autoSignIn={(isMobile || tokenNonce) ? true : false}>
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
