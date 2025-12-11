// src/pages/SpotDetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpotFull, addReview } from "../api/composite";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function SpotDetail() {
  const { id } = useParams();

  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    user_id: "",
    rating: "5",
    review: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function loadSpotWithTimeout(spotId, timeoutMs = 10000) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
    });

    return Promise.race([getSpotFull(spotId), timeoutPromise]);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        console.log("[SpotDetail] loading spot", id);

        const json = await loadSpotWithTimeout(id);

        if (cancelled) return;

        setSpot(json.spot || null);
        setReviews(json.reviews || []);
        setUsers(json.users || []);
        setRatingSummary(json.rating_summary || null);
      } catch (e) {
        console.error("[SpotDetail] Error loading spot:", e);

        if (cancelled) return;

        if (e.message === "Request timed out") {
          setError(
            "The composite service took too long to respond. Please try again in a moment."
          );
        } else if (e.kind === "network") {
          setError(
            "Your browser could not reach the composite service (possible CORS or network issue). Check the console for details."
          );
        } else if (e.kind === "http") {
          if (e.status === 404) {
            setError("The composite service returned 404 (spot not found).");
          } else {
            setError(
              `Composite service returned HTTP ${e.status}. Check the console for the response body.`
            );
          }
        } else {
          setError("Could not load this spot. Please try again.");
        }

        setSpot(null);
        setRatingSummary(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.user_id || !form.review) return;

    try {
      setSubmitting(true);
      const payload = {
        spot_id: id,
        user_id: form.user_id,
        rating: Number(form.rating),
        review: form.review,
      };
      const res = await addReview(payload);
      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      // Re-fetch composite so reviews + rating summary stay in sync
      const json = await getSpotFull(id);
      setSpot(json.spot || null);
      setReviews(json.reviews || []);
      setUsers(json.users || []);
      setRatingSummary(json.rating_summary || null);
      setForm((prev) => ({ ...prev, review: "" }));
    } catch (err) {
      console.error("[SpotDetail] Error submitting review:", err);
      alert("Could not submit review. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Render states ----------

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6 min-h-[calc(100vh-80px)] flex items-center text-sm text-muted-foreground">
        Loading spot details…
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6 min-h-[calc(100vh-80px)] flex flex-col gap-3 justify-center text-sm">
        <p className="text-muted-foreground">
          Spot not found or could not be loaded.
        </p>
        {error && (
          <p className="text-destructive text-xs bg-destructive/10 border border-destructive/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <Link
          to="/spots"
          className="text-xs text-indigo-600 hover:underline w-fit"
        >
          ← Back to all spots
        </Link>
      </div>
    );
  }

  const address = spot.address || {};
  const amenity = spot.amenity || {};

  const hasAverage =
    ratingSummary &&
    ratingSummary.average_rating !== null &&
    ratingSummary.average_rating !== undefined;

  // ---------- Main layout ----------

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/spots"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            ← Back to all spots
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">
            {spot.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {address.street}, {address.city}, {address.state}{" "}
            {address.postal_code}
          </p>

          {hasAverage && (
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-amber-500">
                <span className="text-sm font-semibold">
                  {Number(ratingSummary.average_rating).toFixed(1)}
                </span>
                <span>★</span>
              </span>
              <span className="text-muted-foreground">
                ({ratingSummary.rating_count} rating
                {ratingSummary.rating_count === 1 ? "" : "s"})
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 text-xs">
          {spot.neighborhood && (
            <Badge variant="outline">{spot.neighborhood}</Badge>
          )}
          {amenity.wifi_available && (
            <Badge variant="secondary">Wi-Fi available</Badge>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] min-h-[420px]">
        {/* Left: overview + amenities + hours */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <h2 className="text-sm font-semibold">Overview</h2>
              <p className="text-sm text-muted-foreground">
                A place to study and work near{" "}
                <span className="font-medium">
                  {spot.neighborhood || address.city || "New York"}
                </span>
                . Built on our microservices architecture (spots, users,
                reviews, composite gateway).
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Tag active={amenity.wifi_available}>Wi-Fi</Tag>
                <Tag active={amenity.outlets}>Outlets</Tag>
                <Tag active={amenity.seating}>Seating</Tag>
                <Tag active={Boolean(spot.hours?.open_now)}>Open now</Tag>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-sm font-semibold">Amenities</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <dt className="text-muted-foreground">Wi-Fi</dt>
                <dd>{amenity.wifi_available ? "Yes" : "No"}</dd>

                <dt className="text-muted-foreground">Network</dt>
                <dd>{amenity.wifi_network || "—"}</dd>

                <dt className="text-muted-foreground">Outlets</dt>
                <dd>{amenity.outlets ? "Plenty" : "Limited / none"}</dd>

                <dt className="text-muted-foreground">Seating</dt>
                <dd>{amenity.seating || "—"}</dd>
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-sm font-semibold">Hours</h2>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Open now:</span>{" "}
                {spot.hours?.open_now ? "Yes" : "No"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: reviews + form */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <h2 className="text-sm font-semibold">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No reviews yet. Be the first to share your experience.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {reviews.map((r) => {
                    const user = users.find((u) => u.id === r.user_id);

                    // Fallbacks in case composite returns nested shapes
                    const text =
                      r.review ||
                      r.comment ||
                      r.data?.review ||
                      r.data?.comment ||
                      "";
                    const ratingValue =
                      r.rating ??
                      r.data?.rating ??
                      0;
                    const postDate =
                      r.post_date ||
                      r.postDate ||
                      r.data?.postDate ||
                      r.data?.post_date;

                    return (
                      <div
                        key={r.id || r.data?.id}
                        className="border border-border rounded-xl px-3 py-2 text-xs bg-card"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium">
                            {user?.username || "Anonymous"}
                          </span>
                          <span className="text-amber-400 text-[11px]">
                            {"★".repeat(Math.max(0, ratingValue || 0))}
                          </span>
                        </div>
                        <p className="text-foreground mb-1">{text}</p>
                        {postDate && (
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(postDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Add a review</h3>
              {users.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No users available from the User service yet, so you can’t
                  attach a review. Once user-management is fully populated,
                  select a user and post.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">User</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                      value={form.user_id}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, user_id: e.target.value }))
                      }
                      required
                    >
                      <option value="">Select a user…</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.username} ({u.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <div className="space-y-1 w-24">
                      <label className="text-xs font-medium">Rating</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                        value={form.rating}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, rating: e.target.value }))
                        }
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} ★
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium">Review</label>
                      <Textarea
                        rows={3}
                        className="text-xs"
                        value={form.review}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, review: e.target.value }))
                        }
                        placeholder="What did you think of this spot?"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting}
                    className="mt-1"
                  >
                    {submitting ? "Submitting…" : "Post review"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Tag({ active, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
        active
          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/40"
          : "bg-muted text-muted-foreground border border-border/60"
      }`}
    >
      {children}
    </span>
  );
}
