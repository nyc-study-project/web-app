// src/api/spots.js
import { SPOTS_BASE } from "./config";

export async function getSpots({
  page = 1,
  page_size = 10,
  city,
  open_now, // true / false if you ever want to send it
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", String(page_size));

  // Only include filters when they actually have values
  if (city) {
    params.set("city", city);
  }
  if (open_now !== undefined && open_now !== null) {
    params.set("open_now", String(open_now));
  }

  const url = `${SPOTS_BASE}/studyspots?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load spots: ${res.status}`);
  }

  return res.json(); // expects { data: [...] }
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
