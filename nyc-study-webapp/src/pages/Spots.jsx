// src/pages/Spots.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getSpots } from "../api/spots";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

// Fix default marker icons for Leaflet in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper: normalize whatever the API returns into a consistent shape
function normalizeSpot(raw) {
  const s = raw.data || raw;

  const addressObj = s.address || {};
  const amenityObj = s.amenity || {};

  const street =
    addressObj.street || s.street || s.address_street || "";
  const city =
    addressObj.city || s.city || s.address_city || "";
  const state =
    addressObj.state || s.state || s.address_state || "";
  const postal =
    addressObj.postal_code ||
    s.postal_code ||
    addressObj.zip ||
    s.zip ||
    "";

  const lat = s.latitude || addressObj.latitude || s.lat || null;
  const lng = s.longitude || addressObj.longitude || s.lng || null;

  return {
    id: s.id || s.spot_id || s.uuid,
    name: s.name || s.spot_name || "(Unnamed spot)",
    neighborhood: s.neighborhood || addressObj.neighborhood || "",
    address: {
      street,
      city,
      state,
      postal_code: postal,
    },
    latitude: lat,
    longitude: lng,
    hours: s.hours || { open_now: s.open_now },
    amenity: {
      wifi_available:
        amenityObj.wifi_available ?? s.wifi_available ?? false,
      wifi_network: amenityObj.wifi_network || s.wifi_network || "",
      outlets: amenityObj.outlets ?? s.outlets ?? false,
      seating: amenityObj.seating || s.seating || "",
    },
    _raw: s,
  };
}

export default function Spots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterOpenNow, setFilterOpenNow] = useState(false);

  // new filters
  const [wifiOnly, setWifiOnly] = useState(false);
  const [outletsOnly, setOutletsOnly] = useState(false);
  const [seatingOnly, setSeatingOnly] = useState(false);
  const [vibe, setVibe] = useState("all"); // all | library | cafe

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const json = await getSpots({ page: 1, page_size: 200 });
        const rawList = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const normalized = rawList.map(normalizeSpot);
        setSpots(normalized);
      } catch (err) {
        console.error("Failed to load spots:", err);
        setError("Could not load study spots. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredSpots = useMemo(() => {
    return spots.filter((s) => {
      const name = (s.name || "").toLowerCase();
      const neighborhood = (s.neighborhood || "").toLowerCase();
      const city = (s.address.city || "").toLowerCase();
      const q = search.toLowerCase();

      // search text
      const matchesSearch =
        !q || name.includes(q) || neighborhood.includes(q) || city.includes(q);

      // open now
      const openNow = s.hours?.open_now;
      const matchesOpen = !filterOpenNow || !!openNow;

      // amenity filters
      if (wifiOnly && !s.amenity.wifi_available) return false;
      if (outletsOnly && !s.amenity.outlets) return false;
      if (seatingOnly && !s.amenity.seating) return false;

      // vibe filter (very simple heuristics)
      if (vibe === "library" && !name.includes("library")) return false;
      if (
        vibe === "cafe" &&
        !(name.includes("cafe") || name.includes("coffee") || name.includes("pastry"))
      )
        return false;

      return matchesSearch && matchesOpen;
    });
  }, [
    spots,
    search,
    filterOpenNow,
    wifiOnly,
    outletsOnly,
    seatingOnly,
    vibe,
  ]);

  const selectedSpot = useMemo(
    () => filteredSpots.find((s) => s.id === selectedId),
    [filteredSpots, selectedId]
  );

  return (
    <div className="py-8 flex justify-center">
      {/* Wider, centered content block */}
      <div className="w-full max-w-screen-2xl px-6 space-y-6">
        {/* Header & filters */}
        <div className="flex flex-col gap-4 items-center text-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Study Spots in New York City (sadi dev2)
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Explore campus libraries, cafés, and quiet corners. Click a
              marker or a card to dive into details and reviews.
            </p>
          </div>

          {/* row 1: search + open now */}
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <input
              type="text"
              placeholder="Search by name or neighborhood…"
              className="px-4 py-2 rounded-full border border-input bg-background text-sm w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="button"
              variant={filterOpenNow ? "default" : "outline"}
              className={`text-xs rounded-full ${
                filterOpenNow
                  ? "bg-indigo-500 hover:bg-indigo-500 text-white"
                  : ""
              }`}
              onClick={() => setFilterOpenNow((v) => !v)}
            >
              {filterOpenNow ? "Showing open now" : "Filter: open now"}
            </Button>
          </div>

          {/* row 2: colorful filter chips */}
          <div className="flex flex-wrap gap-2 items-center justify-center text-xs">
            <FilterChip
              active={wifiOnly}
              color="indigo"
              onClick={() => setWifiOnly((v) => !v)}
            >
              Wi-Fi
            </FilterChip>
            <FilterChip
              active={outletsOnly}
              color="violet"
              onClick={() => setOutletsOnly((v) => !v)}
            >
              Outlets
            </FilterChip>
            <FilterChip
              active={seatingOnly}
              color="emerald"
              onClick={() => setSeatingOnly((v) => !v)}
            >
              Plenty of seating
            </FilterChip>

            <span className="mx-2 h-5 w-px bg-border" />

            <FilterChip
              active={vibe === "all"}
              color="slate"
              onClick={() => setVibe("all")}
            >
              All spots
            </FilterChip>
            <FilterChip
              active={vibe === "library"}
              color="sky"
              onClick={() => setVibe("library")}
            >
              Libraries
            </FilterChip>
            <FilterChip
              active={vibe === "cafe"}
              color="rose"
              onClick={() => setVibe("cafe")}
            >
              Cafés / coffee
            </FilterChip>
          </div>
        </div>

        {/* Main content: map + list */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] h-[560px]">
          {/* Map panel */}
          <Card className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-card shadow-lg shadow-indigo-100/60">
            <CardContent className="p-0 h-full">
              <MapContainer
                center={[40.8075, -73.9626]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {filteredSpots
                  .filter((s) => s.latitude && s.longitude)
                  .map((s) => (
                    <Marker
                      key={s.id}
                      position={[s.latitude, s.longitude]}
                      eventHandlers={{
                        click: () => setSelectedId(s.id),
                        dblclick: () => navigate(`/spots/${s.id}`),
                      }}
                    >
                      <Popup>
                        <div className="space-y-1 text-xs">
                          <div className="font-semibold">{s.name}</div>
                          <div className="text-muted-foreground">
                            {s.address.street}, {s.address.city}
                          </div>
                          <button
                            type="button"
                            className="mt-1 text-indigo-600 hover:underline"
                            onClick={() => navigate(`/spots/${s.id}`)}
                          >
                            View details →
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <div className="h-8 w-8 rounded-full border-2 border-indigo-300 border-t-indigo-500 animate-spin" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* List panel */}
          <Card className="rounded-3xl border border-border bg-card flex flex-col overflow-hidden shadow-sm">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {filteredSpots.length} study spots
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Click a card to highlight on the map or open its detail
                    page.
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-border/60">
                {error && (
                  <div className="px-4 py-3 text-xs text-destructive">
                    {error}
                  </div>
                )}

                {!loading && !error && filteredSpots.length === 0 && (
                  <div className="px-4 py-4 text-xs text-muted-foreground">
                    No spots match your filters.
                  </div>
                )}

                {filteredSpots.map((s) => {
                  const isSelected = selectedId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className={`w-full text-left px-4 py-3 text-sm transition ${
                        isSelected
                          ? "bg-indigo-50/80 border-l-2 border-l-indigo-400"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium truncate">
                            {s.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {s.address.street}, {s.address.city}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {s.hours?.open_now && (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/60 text-emerald-600 text-[10px] bg-emerald-50"
                            >
                              Open now
                            </Badge>
                          )}
                          <Link
                            to={`/spots/${s.id}`}
                            className="text-[11px] text-indigo-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Details →
                          </Link>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.amenity.wifi_available && (
                          <Pill color="indigo">Wi-Fi</Pill>
                        )}
                        {s.amenity.outlets && (
                          <Pill color="violet">Outlets</Pill>
                        )}
                        {s.amenity.seating && (
                          <Pill color="emerald">Seating</Pill>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedSpot && (
                <div className="px-4 py-3 border-t border-border/70 text-xs text-muted-foreground bg-slate-50">
                  <span className="font-semibold text-foreground">
                    {selectedSpot.name}
                  </span>
                  {" · "}
                  {selectedSpot.address.street},{" "}
                  {selectedSpot.address.city}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, color, children, onClick }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 cursor-pointer select-none transition";
  const activeStyles = {
    indigo:
      "bg-indigo-500/90 text-white shadow-sm shadow-indigo-300 hover:bg-indigo-500",
    violet:
      "bg-violet-500/90 text-white shadow-sm shadow-violet-300 hover:bg-violet-500",
    emerald:
      "bg-emerald-500/90 text-white shadow-sm shadow-emerald-300 hover:bg-emerald-500",
    sky: "bg-sky-500/90 text-white shadow-sm shadow-sky-300 hover:bg-sky-500",
    rose: "bg-rose-500/90 text-white shadow-sm shadow-rose-300 hover:bg-rose-500",
    slate:
      "bg-slate-800 text-white shadow-sm shadow-slate-400 hover:bg-slate-900",
  };
  const inactive =
    "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200";

    return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition
        ${
          active
            ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm"
            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
        }`}
    >
      {active && (
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
      )}
      {children}
    </button>
  );
}

function Pill({ children, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${colors[color]}`}
    >
      {children}
    </span>
  );
}
