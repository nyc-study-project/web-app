import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");

    if (sessionId) {
      localStorage.setItem("session_id", sessionId);
    }

    navigate("/spots");
  }, []);

  return <div>Logging you in...</div>;
}
