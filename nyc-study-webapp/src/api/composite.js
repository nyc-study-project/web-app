// src/api/composite.js
import { COMPOSITE_BASE } from "./config";
import { authFetch } from "../lib/utils"; // ✅ Import authFetch

export async function getSpotFull(id) {
  const url = `${COMPOSITE_BASE}/composite/spots/${id}/full`;
  console.log("[getSpotFull] Fetching:", url);

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.error("[getSpotFull] Network error:", err);
    throw new Error("Network error");
  }

  const data = await res.json();

  if (!res.ok) {
    console.error("[getSpotFull] HTTP error:", res.status, data);
    const e = new Error(`Composite error ${res.status}`);
    e.status = res.status;
    throw e;
  }

  return data;
}

export async function addReview(payload) {
  const url = `${COMPOSITE_BASE}/api/reviews`;
  console.log("[addReview] POST", url, payload);

  // ✅ Use authFetch to pass session headers (good practice)
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("[addReview] Response status:", res.status);
  return res;
}

// ✅ NEW: Add Delete Function
export async function deleteReview(reviewId) {
  const url = `${COMPOSITE_BASE}/api/reviews/${reviewId}`;
  console.log("[deleteReview] DELETE", url);

  const res = await authFetch(url, {
    method: "DELETE",
  });

  console.log("[deleteReview] Response status:", res.status);
  return res;
}