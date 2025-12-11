// src/api/composite.js
import { COMPOSITE_BASE } from "./config";

export async function getSpotFull(id) {
  const url = `${COMPOSITE_BASE}/composite/spots/${id}/full`;
  console.log("[getSpotFull] Fetching:", url);

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.error("[getSpotFull] Network error:", err);
    const e = new Error("Network error");
    e.kind = "network";
    throw e;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON error; we'll still throw with status
  }

  if (!res.ok) {
    console.error("[getSpotFull] HTTP error:", res.status, data);
    const e = new Error(`Composite error ${res.status}`);
    e.kind = "http";
    e.status = res.status;
    e.body = data;
    throw e;
  }

  console.log("[getSpotFull] Success:", data);
  return data;
}

export async function addReview(payload) {
  const url = `${COMPOSITE_BASE}/api/reviews`;
  console.log("[addReview] POST", url, payload);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[addReview] Network error:", err);
    const e = new Error("Network error");
    e.kind = "network";
    throw e;
  }

  console.log("[addReview] Response status:", res.status);
  return res;
}
