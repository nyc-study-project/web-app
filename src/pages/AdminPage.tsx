import React from "react";
import { useAuth } from "../hooks/useAuth";
import { makeClients } from "../api";
import { AutoForm } from "../components/core/AutoForm";
import type { StudySpotCreate } from "../generated/spots/models/StudySpotCreate";
import type { StudySpotRead } from "../generated/spots/models/StudySpotRead";
import { Neighborhood } from "../generated/spots/models/Neighborhood";
import { Seating } from "../generated/spots/models/Seating";

export default function AdminPage() {
  const { token } = useAuth();
  const clients = React.useMemo(() => makeClients(token), [token]);

  const [spots, setSpots] = React.useState<StudySpotRead[]>([]);
  const [editingSpot, setEditingSpot] = React.useState<StudySpotRead | null>(null);
  const [creating, setCreating] = React.useState(false);

  const loadSpots = React.useCallback(async () => {
    if (!clients) return;
    const data = await clients.spotApi.listStudyspotsStudyspotsGet();
    setSpots(Array.isArray(data) ? data : []);
  }, [clients]);

  React.useEffect(() => {
    void loadSpots();
  }, [loadSpots]);

  // Handle both create and edit actions
  const handleSubmit = async (data: StudySpotCreate) => {
    if (!clients) return;

    if (editingSpot) {
      await clients.spotApi.updateStudyspotStudyspotsStudyspotIdPatch(
        editingSpot.id,
        data as any
      );
      setEditingSpot(null);
    } else {
      await clients.spotApi.createStudyspotStudyspotsPost(data);
      setCreating(false);
    }

    await loadSpots();
  };

  if (!token)
    return <div className="p-6">Please log in to access admin dashboard.</div>;

  const baseFormDefaults: StudySpotCreate = {
    name: "",
    address: {
      street: "",
      city: "",
      state: "NY",
      postal_code: "",
      neighborhood: Neighborhood.MIDTOWN,
    } as any,
    amenity: {
      wifi_available: false,
      wifi_network: "",
      outlets: false,
      seating: Seating["RANGE_1_5"] || "1-5",
      refreshments: "",
      environment: [],
    } as any,
    hour: {
      open_time: "08:00",
      close_time: "22:00",
      days_open: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    } as any,
  };

  const enums = {
    "address.neighborhood": Object.values(Neighborhood),
    "amenity.seating": ["1-5", "6-10", "11-20", "20+"],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={() => setCreating(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Create New Spot
      </button>

      {(creating || editingSpot) && (
        <div className="my-4 border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">
            {editingSpot ? `Edit ${editingSpot.name}` : "Create New Spot"}
          </h2>

          <AutoForm<StudySpotCreate>
            defaultValues={editingSpot || baseFormDefaults}
            enums={enums}
            onSubmit={handleSubmit}
          />

          <button
            onClick={() => {
              setCreating(false);
              setEditingSpot(null);
            }}
            className="mt-2 text-gray-600 underline"
          >
            Cancel
          </button>
        </div>
      )}

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Neighborhood</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {spots.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-3">
                No study spots found.
              </td>
            </tr>
          ) : (
            spots.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.address?.neighborhood || "—"}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setEditingSpot(s)}
                    className="text-blue-600 hover:underline text-sm mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        confirm(`Delete study spot "${s.name}"? This cannot be undone.`)
                      ) {
                        await clients.spotApi.deleteStudyspotsStudyspotsStudyspotIdDelete(
                          s.id
                        );
                        await loadSpots();
                      }
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
