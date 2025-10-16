import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { AutoForm } from "../components/core/AutoForm";
import { publicClients, makeClients } from "../api";
import type { StudySpotRead } from "../generated/spots/models/StudySpotRead";
import type { ReviewCreate } from "../generated/reviews/models/ReviewCreate";
import type { RatingCreate } from "../generated/reviews/models/RatingCreate";
// 1. ✅ Import models needed for display
import type { ReviewRead } from "../generated/reviews/models/ReviewRead";
import type { RatingRead } from "../generated/reviews/models/RatingRead";

// Define a type for the average rating response for cleaner code
type AverageRating = {
    spotId: string;
    average_rating: number;
    rating_count: number;
};

const SpotDetailPage: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const { isAuthenticated, user, token } = useAuth();
  const clients = useMemo(() => makeClients(token), [token]);

  // --- 1. DATA FETCHING HOOKS (NEW & EXISTING) ---

  // Fetch Spot Details (Existing)
  const fetchSpotDetails = useCallback(
    () => publicClients.spotApi.getStudyspotStudyspotsStudyspotIdGet(spotId!),
    [spotId]
  );
  const { data: spot, isLoading, error } = useApi<StudySpotRead>(fetchSpotDetails);

  // 2. ✅ Hook to fetch Average Rating (Summary)
  const fetchAverageRating = useCallback(
    () => publicClients.reviewApi.getAverageRatingRatingsSpotIdAverageGet(spotId!),
    [spotId]
  );
  const { data: averageData } = useApi<AverageRating>(fetchAverageRating);
  
  // 3. ✅ Hook to fetch all Reviews
  const fetchReviews = useCallback(
    () => publicClients.reviewApi.getReviewsReviewsSpotIdGet(spotId!),
    [spotId]
  );
  // The API returns { "reviews": ReviewRead[] }
  const { data: reviewResponse, refetch: refetchReviews } = useApi<{ reviews: ReviewRead[] }>(fetchReviews);
  const reviews = useMemo(() => reviewResponse?.reviews || [], [reviewResponse]);
  
  // 4. ✅ Hook to fetch all Ratings (for potential display)
  const fetchRatings = useCallback(
    () => publicClients.reviewApi.getRatingsRatingsSpotIdGet(spotId!),
    [spotId]
  );
  const { data: ratingResponse, refetch: refetchRatings } = useApi<{ ratings: RatingRead[] }>(fetchRatings);
  const ratings = useMemo(() => ratingResponse?.ratings || [], [ratingResponse]);


  // --- Submission Logic ---

  // Review Submission (Existing, with fix)
  const { execute: submitReview, isLoading: isReviewSubmitting } = useApi<
    any,
    [string, string, ReviewCreate]
  >(clients?.reviewApi.addReviewReviewSpotIdUserUserIdPost, { lazy: true });

  const handleReviewSubmit = async (formData: ReviewCreate) => {
    if (!user?.id || !clients || !spotId) return;
    const payload: ReviewCreate = { review: formData.review };
    const { success } = await submitReview(spotId, user.id, payload as ReviewCreate);
    
    if (success) {
      alert("Review submitted successfully!");
      void refetchReviews(); // Refresh the list of reviews
    } else {
      alert("Failed to submit review.");
    }
  };

  // Rating Submission (Existing, with fix)
  const { execute: submitRating, isLoading: isRatingSubmitting } = useApi<
    any,
    [string, string, RatingCreate]
  >(clients?.reviewApi.addRatingRatingSpotIdUserUserIdPost, { lazy: true });

  const handleRatingSubmit = async (formData: RatingCreate) => {
    if (!user?.id || !clients || !spotId) return;
    const payload: RatingCreate = { rating: formData.rating };

    const { success } = await submitRating(spotId, user.id, payload as RatingCreate);

    if (success) {
        alert("Rating submitted successfully!");
        void refetchRatings(); // Refresh ratings list and summary
        void fetchAverageRating();
    } else {
        alert("Failed to submit rating.");
    }
  };
  
  // --- Rendering ---

  if (isLoading) return <div className="p-6">Loading spot details...</div>;
  if (error) return <div className="p-6">Error: {(error as Error).message}</div>;
  if (!spot) return <div className="p-6">Spot not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{spot.name}</h1>
      <p className="text-gray-700">{spot.address?.street}</p>

      {/* 5. ✅ RENDER SUMMARY */}
      {averageData && (
          <div className="my-4 p-3 bg-blue-50 border-l-4 border-blue-400">
              <h3 className="text-lg font-semibold text-blue-800">Average Rating: {averageData.average_rating || 'N/A'}</h3>
              <p className="text-sm text-blue-700">Based on {averageData.rating_count} ratings.</p>
          </div>
      )}

      <hr className="my-4" />
      
      {isAuthenticated ? (
        <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Leave Feedback</h2>
            
            {/* RATING FORM */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">Leave a Rating (1-5)</h3>
                <AutoForm<RatingCreate>
                    defaultValues={{ rating: 1 } as RatingCreate} 
                    onSubmit={handleRatingSubmit}
                />
                {isRatingSubmitting && <p>Submitting rating...</p>}
            </div>

            {/* REVIEW FORM */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
                <AutoForm<ReviewCreate>
                    defaultValues={{ review: "" } as ReviewCreate}
                    onSubmit={handleReviewSubmit}
                />
                {isReviewSubmitting && <p>Submitting review...</p>}
            </div>
        </div>
      ) : (
        <p className="mb-8">Please log in to leave a rating and review.</p>
      )}

      <hr className="my-4" />
      
      {/* 6. ✅ RENDER REVIEWS (Scrollable List) */}
      <h2 className="text-2xl font-bold mb-4">User Reviews ({reviews.length})</h2>
      
      {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
      ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {reviews.map((review) => {
                  // Find the corresponding rating for display (optional)
                  const matchingRating = ratings.find(r => r.user_id === review.user_id);
                  const formattedDate = review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A';

                  return (
                      <div key={review.id} className="p-4 border rounded-lg shadow-sm bg-white">
                          <div className="flex justify-between items-start">
                              <p className="font-semibold text-lg">Review by User ID: {review.user_id?.slice(0, 8)}...</p>
                              {matchingRating && (
                                  <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-2 py-1 rounded">
                                      Rating: {matchingRating.rating} / 5
                                  </span>
                              )}
                          </div>
                          <p className="text-gray-600 mt-1">{review.review}</p>
                          <p className="text-sm text-gray-400 mt-2">Posted on: {formattedDate}</p>
                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default SpotDetailPage;