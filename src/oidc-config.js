// Function to detect incognito mode
const detectIncognito = async () => {
    try {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        return new Promise((resolve) => {
            if (!fs) {
                resolve(false);
                return;
            }
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
        });
    } catch {
        return false;
    }
};

// In-memory storage for incognito mode
const memoryStorage = new Map();

import { UserManager } from 'oidc-client-ts';

// Helper to detect if running on mobile
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const oidcConfig = {
    authority: "https://id.zipalong.tech",
    clientId: "webbieshop-wt",
    redirectUri: "https://multid6auth.vercel.app/login/callback",
    responseType: "code",
    scope: "openid profile",
    silent_redirect_uri: "https://multid6auth.vercel.app/login/callback",
    post_logout_redirect_uri: "https://multid6auth.vercel.app/login",
    response_mode: "query",  // Changed from fragment to query
    automaticSilentRenew: false,  // Disabled automatic renewal
    loadUserInfo: true,
    monitorSession: false,  // Disabled session monitoring
    prompt: "consent",  // Always ask for consent
    extraQueryParams: {
        display: isMobileDevice() ? 'touch' : 'page',
        max_age: 0,  // Force fresh authentication
        ui_locales: 'en',
    }
};

// Create UserManager instance
export const createUserManager = () => {
    const manager = new UserManager({
        ...oidcConfig,
        userStore: {
            get: async (key) => {
                const value = sessionStorage.getItem(key) || localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            },
            set: async (key, value) => {
                const strValue = JSON.stringify(value);
                try {
                    sessionStorage.setItem(key, strValue);
                } catch {
                    localStorage.setItem(key, strValue);
                }
            },
            remove: async (key) => {
                sessionStorage.removeItem(key);
                localStorage.removeItem(key);
            }
        }
    });

    // Handle storage events
    manager.events.addUserLoaded((user) => {
        console.log("User loaded", user);
    });

    manager.events.addSilentRenewError((error) => {
        console.error("Silent renew error", error);
    });

    manager.events.addUserSignedOut(() => {
        console.log("User signed out");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
    });

    return manager;
};