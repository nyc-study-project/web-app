// src/pages/SpotDetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpotFull, addReview, deleteReview } from "../api/composite"; // ✅ Import deleteReview
import { useUser } from "../lib/useUser";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Trash2 } from "lucide-react"; // ✅ Icon for delete

export default function SpotDetail({ user }) {
  const { id } = useParams();
  // const user = useUser();

  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ rating: "5", review: "" });
  const [submitting, setSubmitting] = useState(false);

  // Helper to refresh data
  async function loadData() {
     try {
        const json = await getSpotFull(id);
        setSpot(json.spot || null);
        setReviews(json.reviews || []);
        setUsers(json.users || []); 
        setRatingSummary(json.rating_summary || null);
     } catch (e) {
        console.error("Load error", e);
     }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const json = await getSpotFull(id);
        if (cancelled) return;
        setSpot(json.spot || null);
        setReviews(json.reviews || []);
        setUsers(json.users || []);
        setRatingSummary(json.rating_summary || null);
      } catch (e) {
        if (!cancelled) setError("Could not load spot details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !form.review) return;

    try {
      setSubmitting(true);
      const payload = {
        spot_id: id,
        user_id: user.id,
        rating: Number(form.rating),
        review: form.review,
      };
      
      const res = await addReview(payload);
      if (!res.ok) throw new Error("Failed");

      await loadData(); // Refresh list
      setForm((prev) => ({ ...prev, review: "" }));
    } catch (err) {
      alert("Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ NEW: Handle Delete
  async function handleDelete(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      await loadData(); // Refresh list
    } catch (err) {
      alert("Failed to delete review.");
    }
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading...</div>;
  if (!spot) return <div className="p-8 text-sm">Spot not found.</div>;

  const address = spot.address || {};
  const amenity = spot.amenity || {};

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{spot.name}</h1>
          <p className="text-sm text-muted-foreground">{address.street}, {address.city}</p>
        </div>
        <div className="flex gap-2">
            {amenity.wifi_available && <Badge variant="secondary">Wi-Fi</Badge>}
            {spot.hours?.open_now && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Open Now</Badge>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        
        {/* Left Column: Info */}
        <div className="space-y-4">
           <Card className="rounded-2xl bg-slate-50 border-none">
             <CardContent className="p-4">
               <h2 className="font-semibold text-sm mb-2">Amenities</h2>
               <div className="grid grid-cols-2 text-xs gap-y-2 text-slate-600">
                  <span>Wi-Fi: {amenity.wifi_available ? "Yes" : "No"}</span>
                  <span>Outlets: {amenity.outlets ? "Yes" : "Limited"}</span>
                  <span>Seating: {amenity.seating || "Standard"}</span>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Column: Reviews */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <h2 className="text-sm font-semibold">Reviews ({reviews.length})</h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {reviews.length === 0 && <p className="text-xs text-muted-foreground">No reviews yet.</p>}
                
                {reviews.map((r) => {
                  const reviewUser = users.find((u) => u.id === r.user_id);
                  const isMyReview = user && r.user_id === user.id;
                  
                  // NOTE: r.rating is usually undefined here because fetching reviews 
                  // doesn't join the ratings table. We show a generic star if missing.
                  const ratingVal = r.rating || r.data?.rating; 

                  return (
                    <div key={r.id || Math.random()} className="group border rounded-xl p-3 text-xs bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-slate-800">
                            {reviewUser?.username || "Anonymous"}
                        </div>
                        {isMyReview && (
                            <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-red-500">
                                <Trash2 className="h-3 w-3" />
                            </button>
                        )}
                      </div>
                      
                      {/* Star Display */}
                      <div className="text-amber-400 text-[10px] my-1">
                         {ratingVal ? "★".repeat(ratingVal) : "★ (Rating hidden)"}
                      </div>

                      <p className="text-slate-600">{r.review || r.comment || ""}</p>
                    </div>
                  );
                })}
              </div>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handleSubmit} className="border-t pt-3 mt-2 space-y-3">
                    <div className="text-xs font-medium">Post a review</div>
                    <div className="flex gap-2">
                        <select 
                           className="text-xs border rounded px-2 bg-white"
                           value={form.rating}
                           onChange={e => setForm(f => ({...f, rating: e.target.value}))}
                        >
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                        </select>
                        <input 
                           className="flex-1 text-xs border rounded px-2 py-1"
                           placeholder="Share your thoughts..."
                           value={form.review}
                           onChange={e => setForm(f => ({...f, review: e.target.value}))}
                           required
                        />
                        <Button size="sm" type="submit" disabled={submitting} className="h-8">
                            {submitting ? "..." : "Post"}
                        </Button>
                    </div>
                </form>
              ) : (
                <div className="text-xs text-center p-2 bg-slate-50 rounded">
                    Log in to add a review.
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}