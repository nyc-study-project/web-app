import React from "react";
import { publicClients } from "../api";
import { Link } from "react-router-dom";
import type { StudySpotRead } from "../generated/spots/models/StudySpotRead";

const HomePage: React.FC = () => {
  const [spots, setSpots] = React.useState<StudySpotRead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await publicClients.spotApi.listStudyspotsStudyspotsGet();
        setSpots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch study spots:", err);
        setError("Failed to load study spots. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    void fetchSpots();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading study spots...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">NYC Study Spots</h1>
      {spots.length === 0 ? (
        <p>No study spots available.</p>
      ) : (
        <ul className="space-y-3">
          {spots.map((s) => (
            <li
              key={s.id}
              className="border p-3 rounded hover:bg-gray-50 transition"
            >
              <Link
                to={`/spots/${s.id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {s.name}
              </Link>
              <p className="text-sm text-gray-600">
                {s.address?.neighborhood || "Unknown neighborhood"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
