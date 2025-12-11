import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // ---------------------------------------------------------
    // 1. ROBUST TOKEN EXTRACTION
    // ---------------------------------------------------------
    let sessionId = null;

    // Method A: Check standard query string (e.g. ?session_id=123)
    const url = new URL(window.location.href);
    sessionId = url.searchParams.get("session_id");

    // Method B: Check INSIDE the hash (e.g. /#/callback?session_id=123)
    // This is common with HashRouter if the provider appends params at the end
    if (!sessionId && window.location.hash.includes("?")) {
      const hashParts = window.location.hash.split("?"); 
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        sessionId = hashParams.get("session_id");
      }
    }

    // ---------------------------------------------------------
    // 2. SAVE & REDIRECT
    // ---------------------------------------------------------
    if (sessionId) {
      localStorage.setItem("session_id", sessionId);

      // Force a hard reload so TopNav and the rest of the app 
      // re-initialize with the new user state.
      window.location.href = "/#/spots";
      window.location.reload();
    } else {
      // If validation fails, send them back to the start
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