import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { COMPOSITE_BASE } from "../api/config";

export default function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${COMPOSITE_BASE}/composite/spots/${id}/full`);
        const json = await res.json();

        setSpot(json.spot);
        setReviews(json.reviews || []);
        setUsers(json.users || []);
      } catch (e) {
        console.error("Error:", e);
      }
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <p>Loading spot details...</p>;
  if (!spot) return <p>Spot not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-semibold">{spot.name}</h1>

      <div className="space-y-2">
        <h2 className="text-xl font-medium">Address</h2>
        <p>
          {spot.address.street}, {spot.address.city}, {spot.address.state}{" "}
          {spot.address.postal_code}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-medium">Amenities</h2>
        <ul className="list-disc pl-6">
          <li>Wifi: {spot.amenity.wifi_available ? "Yes" : "No"}</li>
          <li>Network: {spot.amenity.wifi_network}</li>
          <li>Outlets: {spot.amenity.outlets ? "Yes" : "No"}</li>
          <li>Seating: {spot.amenity.seating}</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-medium">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <p className="font-semibold">Rating: {rev.rating || "?"}/5</p>
              <p className="text-sm">{rev.review || rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
