import React, { useEffect } from "react";
import { useAuth } from "oidc-react";
import { useNavigate } from "react-router-dom";

const SilentRenew = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const renewD6Token = async () => {
      try {
        const user = await auth.signinSilent(); // 🔄 Silent renewal
        if (user) {
          console.log("D6 Token successfully renewed:", user.access_token);

          // ✅ Store new d6AccessToken
          localStorage.setItem("d6AccessToken", user.access_token);

          // 🚀 Redirect to Callback Component to complete login flow (Only if in Login Flow)
          if (window.location.pathname === "/silent-renew") {
            navigate("/login/callback"); // ⬅️ Redirect only if needed
          }
        }
      } catch (error) {
        console.error("Silent renewal failed", error);
      }
    };

    renewD6Token();
  }, [auth, navigate]);

  return <div>Loading...</div>; // This component should be invisible
};

export default SilentRenew;
