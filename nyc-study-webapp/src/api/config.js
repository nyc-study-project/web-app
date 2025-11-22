// -------------------------------
// Cloud Production Endpoints
// -------------------------------

// Spot Management (Cloud Run + Cloud SQL Postgres)
export const SPOTS_BASE =
  "https://spot-management-642518168067.us-east1.run.app";

// Reviews Service (Cloud Run)
export const REVIEWS_BASE =
  "https://reviews-api-c73xxvyjwq-ue.a.run.app";

// User Management (FastAPI on GCE VM + Cloud SQL MySQL)
export const USERS_BASE = "http://34.139.134.144:8002";

// Composite Gateway (not provided yet)
export const COMPOSITE_BASE = "";
