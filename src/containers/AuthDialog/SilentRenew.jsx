import { useEffect } from "react";
import { useAuth } from "oidc-react";

const SilentRenew = () => {
  const auth = useAuth();

  useEffect(() => {
    console.log("Silent renew initiated...", auth);

    const renewD6Token = async () => {
      if (!auth.userManager) return; // Ensure userManager is available

      try {
        const user = await auth.userManager.signinSilent(); // 🔄 Silent renewal
        if (user) {
          console.log("D6 Token successfully renewed:", user.access_token);
          localStorage.setItem("d6AccessToken", user.access_token); // ✅ Store new token
        }
      } catch (error) {
        console.error("Silent renewal failed", error);
      }
    };

    renewD6Token();
  }, []); // ✅ No unnecessary re-renders

  return <div style={{ display: "none" }}>Silent Renewing...</div>; // Invisible Component
};

export default SilentRenew;
