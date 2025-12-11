import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // ---------------------------------------------------------
    // TOKEN EXTRACTION
    // ---------------------------------------------------------
    let sessionId = null;

    const url = new URL(window.location.href);
    sessionId = url.searchParams.get("session_id");

    if (!sessionId && window.location.hash.includes("?")) {
      const hashParts = window.location.hash.split("?"); 
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        sessionId = hashParams.get("session_id");
      }
    }

    // ---------------------------------------------------------
    // SAVE & REDIRECT
    // ---------------------------------------------------------
    if (sessionId) {
      console.log("Session ID found:", sessionId);
      localStorage.setItem("session_id", sessionId);

      window.history.replaceState(null, "", "#/spots");

      window.location.reload();
    } else {
      console.warn("No session ID found, redirecting to home.");
      navigate("/spots");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
      <div className="text-sm font-medium text-slate-500 animate-pulse">
        Logging you in...
      </div>
    </div>
  );
}