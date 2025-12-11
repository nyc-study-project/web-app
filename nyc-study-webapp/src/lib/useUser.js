import { useEffect, useState } from "react";
import { authFetch } from "./utils";
import { COMPOSITE_BASE } from "../api/config";

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      setUser(null);
      return;
    }

    authFetch(`${COMPOSITE_BASE}/auth/me`)
      .then((res) => res.ok ? res.json() : null)
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}
