// -------------------------------
// Cloud Production Endpoints
// -------------------------------

// Composite Gateway (Cloud Run)
export const COMPOSITE_BASE =
  "https://composite-gateway-642518168067.us-east1.run.app";

// Spot Management (Direct atomic service — still used for geocode job polling)
export const SPOTS_BASE =
  "https://spot-management-642518168067.us-east1.run.app";

// Reviews Service (STILL USED FOR REVERSE-COMPAT CORNERS)
export const REVIEWS_BASE =
  "https://reviews-api-c73xxvyjwq-ue.a.run.app";

// User Management (FastAPI on GCE VM + Cloud SQL MySQL)
export const USERS_BASE = "http://34.139.134.144:8002";
