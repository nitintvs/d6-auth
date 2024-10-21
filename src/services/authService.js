import { UserManager } from 'oidc-client-ts';
import oidcConfig from '../oidc-config';  // Your OIDC client config

class AuthService {
  constructor() {
    this.userManager = new UserManager(oidcConfig);

    // Automatically renew tokens when expired
    this.userManager.events.addAccessTokenExpired(() => {
      this.login();
    });
  }

  // Login with redirect
  login() {
    return this.userManager.signinRedirect();
  }

  // Silent login attempt
  silentLogin() {
    return this.userManager.signinSilent();
  }

  // Logout
  logout() {
    return this.userManager.signoutRedirect();
  }

  // Get user details
  getUser() {
    return this.userManager.getUser();
  }
}

const authService = new AuthService();
export default authService;
