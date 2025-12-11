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
    // Good for normal redirects
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
      console.log("Session ID found:", sessionId);
      localStorage.setItem("session_id", sessionId);

      // ✅ CRITICAL FIX: Instantly swap the URL hash before reloading.
      // This changes the browser URL from ".../callback" to ".../spots" immediately.
      // If we don't do this, window.location.reload() reloads the callback page, causing a loop.
      window.history.replaceState(null, "", "#/spots");

      // Force a hard reload so the main app (App.jsx) re-initializes 
      // and picks up the new 'session_id' from localStorage.
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