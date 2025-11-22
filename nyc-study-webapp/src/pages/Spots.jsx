import React, { useEffect, useState } from "react";
import { COMPOSITE_BASE } from "../api/config";
import { Link } from "react-router-dom";

export default function Spots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${COMPOSITE_BASE}/api/spots`);
        const json = await res.json();

        // Composite returns { data: [...] }
        setSpots(json.data || []);
      } catch (err) {
        console.error("Failed to load spots:", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Loading spots...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Study Spots</h1>

      {spots.map((spot, index) => {
        const s = spot.data || spot; // safety

        return (
          <div
            key={s.id || index}
            className="p-4 rounded-xl border bg-white shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <p className="text-sm text-gray-600">
              {s.address.street}, {s.address.city}
            </p>

            <Link
              to={`/spots/${s.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View Details →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
