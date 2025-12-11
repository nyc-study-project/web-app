import { useEffect, useState } from "react";
import { addReview } from "../api/composite";
import { authFetch } from "../lib/utils";

export default function AddReviewForm({ spotId }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // Logged-in user
  const [user, setUser] = useState(null);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_USER_MANAGEMENT_BASE}/auth/me`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser);
  }, []);

  // Block form if not logged in
  if (!user) {
    return <div className="mt-4">Please login to submit a review.</div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await authFetch(
      `${import.meta.env.VITE_COMPOSITE_BASE}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spot_id: spotId,
          user_id: user.id, // real logged-in user
          review: comment,
          rating: Number(rating),
        }),
      }
    );

    if (response.status === 201) alert("Review added!");
    else alert("Review failed");
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Rating 1–5"
        className="border p-2 w-full"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      />

      <textarea
        placeholder="Write review..."
        className="border p-2 w-full mt-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded mt-2">
        Submit
      </button>
    </form>
  );
}
