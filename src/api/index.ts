import { DefaultService as SpotApi, OpenAPI as SpotOpenAPI } from "../generated/spots";
import { DefaultService as UserApi, OpenAPI as UserOpenAPI } from "../generated/users";
import { DefaultService as ReviewApi, OpenAPI as ReviewOpenAPI } from "../generated/reviews";

/** Base URLs for each microservice (override via Vite env vars) */
export const basePaths = {
  spot: import.meta.env.VITE_SPOT_API_URL ?? "http://localhost:8000",
  user: import.meta.env.VITE_USER_API_URL ?? "http://localhost:8010",
  review: import.meta.env.VITE_REVIEW_API_URL ?? "http://localhost:8020",
};

/** Configure base URLs for unauthenticated clients */
UserOpenAPI.BASE = basePaths.user;
SpotOpenAPI.BASE = basePaths.spot;
ReviewOpenAPI.BASE = basePaths.review;

/** Public (unauthenticated) clients */
export const publicClients = {
  userApi: UserApi,
  spotApi: SpotApi,
  reviewApi: ReviewApi,
};

/**
 * Create authenticated API clients.
 * Each service shares the same bearer token headers.
 */
export const makeClients = (token?: string) => {
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}` };
  SpotOpenAPI.HEADERS = headers;
  UserOpenAPI.HEADERS = headers;
  ReviewOpenAPI.HEADERS = headers;
  return { spotApi: SpotApi, userApi: UserApi, reviewApi: ReviewApi };
};

console.log("🌍 Loaded API base paths:", basePaths);
