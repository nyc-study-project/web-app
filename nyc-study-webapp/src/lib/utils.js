import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function authFetch(url, options = {}) {
  const sessionId = localStorage.getItem("session_id");

  const headers = {
    ...(options.headers || {}),
    ...(sessionId ? { auth: `Bearer ${sessionId}` } : {})
  };

  return fetch(url, { ...options, headers });
}
