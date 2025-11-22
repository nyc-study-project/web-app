import { useState } from "react";
import { addReview } from "../api/composite";

export default function AddReviewForm({ spotId }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await addReview({
      spot_id: spotId,
      user_id: 1,   // TEMP until login works
      rating,
      comment
    });

    if (response.status === 201) alert("Review added!");
    else alert("Review failed");
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Rating 1-5"
        className="border p-2 w-full"
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
