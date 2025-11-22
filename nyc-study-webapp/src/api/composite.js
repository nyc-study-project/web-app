import { COMPOSITE_BASE } from "./config";

export async function getSpotFull(id) {
  const res = await fetch(`${COMPOSITE_BASE}/composite/spots/${id}/full`);
  return res.json();
}

export async function addReview(data) {
  const res = await fetch(`${COMPOSITE_BASE}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res;
}
