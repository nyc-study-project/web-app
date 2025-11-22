import { SPOTS_BASE } from "./config";

export async function getSpots({ page = 1, page_size = 10, city = "", open_now = "" }) {
  const url = `${SPOTS_BASE}/studyspots?page=${page}&page_size=${page_size}&city=${city}&open_now=${open_now}`;
  const res = await fetch(url);
  return res.json();
}

export async function geocodeSpot(id) {
  const res = await fetch(`${SPOTS_BASE}/studyspots/${id}/geocode`, {
    method: "POST"
  });
  return res;
}

export async function getJobStatus(jobUrl) {
  const res = await fetch(jobUrl);
  return res.json();
}
