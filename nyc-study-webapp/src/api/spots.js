// src/api/spots.js

// 1. CHANGE THIS IMPORT
// FROM: import { SPOTS_BASE } from "./config";
// TO:
import { COMPOSITE_BASE } from "./config"; 

export async function getSpots({
  page = 1,
  page_size = 10,
  city,
  open_now, 
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", String(page_size));

  if (city) {
    params.set("city", city);
  }
  if (open_now !== undefined && open_now !== null) {
    params.set("open_now", String(open_now));
  }

  // 2. CHANGE THIS URL
  // We switch from SPOTS_BASE (Direct) to COMPOSITE_BASE (Gateway).
  // NOTE: Ensure your Gateway actually routes "/api/spots" to the spot service!
  
  // OLD: const url = `${SPOTS_BASE}/studyspots?${params.toString()}`;
  const url = `${COMPOSITE_BASE}/api/spots?${params.toString()}`;

  console.log("[getSpots] Fetching via Gateway:", url); // Add logging for debug

  const res = await fetch(url);

  if (!res.ok) {
    // This will now catch 404s (Path errors) or 500s (Gateway errors)
    throw new Error(`Failed to load spots: ${res.status}`);
  }

  return res.json(); 
}

export async function geocodeSpot(id) {
  const res = await fetch(`${SPOTS_BASE}/studyspots/${id}/geocode`, {
    method: "POST",
  });
  return res;
}

export async function getJobStatus(jobUrl) {
  const res = await fetch(jobUrl);
  return res.json();
}
