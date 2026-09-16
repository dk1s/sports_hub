/* ------------------------------------------------------------------
   Central app configuration.
   No `.env` files by design — everything the client needs is declared
   here so the build is deterministic and reviewers can verify values
   at a glance. Values marked "goes live" are wired for the future real
   backend; today every endpoint resolves through the mock localStorage
   layer, but this file is the single source of truth for how the
   network layer (headers, CORS, timeouts) will behave.
------------------------------------------------------------------- */

export const APP = {
  name: 'Sports Hub, Purnea',
  tagline: 'Gear · Apparel · Custom Print Studio',
  version: '1.0.0',
  supportEmail: 'hello@sportshubpurnea.com',
}

export const API = {
  /* Point this at the backend server when it goes live, e.g.
     https://api.sportshubpurnea.com/api/v1
     RTK Query (src/services/apiSlice.js) routes every request through
     this base before hitting the real network. */
  baseUrl: '/api/v1',
  timeoutMs: 12000,

  /* When calling a cross-origin API the browser enforces CORS. The
     server MUST respond to preflight (OPTIONS) with:
       Access-Control-Allow-Origin  : the site origin (never *)
       Access-Control-Allow-Credentials : true
       Access-Control-Allow-Methods : GET, POST, PATCH, PUT, DELETE, OPTIONS
       Access-Control-Allow-Headers : Content-Type, Authorization, X-Client-Version
       Access-Control-Max-Age       : 86400
   The block below documents that contract; the actual headers live on
   the server, while the client sends `credentials: include`. */
  cors: {
    allowCredentials: true,
    allowedMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Version'],
  },

  /* Default JSON headers attached to every outgoing request. */
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Version': APP.version,
  },
}

/* localStorage keys owned by the auth layer (see services/api.js). */
export const AUTH_KEYS = { session: 'sh:session' }

/** Read the current bearer token from the stored session. */
export const getAuthToken = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.session)
    const s = raw ? JSON.parse(raw) : null
    return s?.token || null
  } catch {
    return null
  }
}

/**
 * Compose the final request headers for any outbound call.
 * – opts.headers  : extra headers to merge in
 * – opts.auth     : set false to omit the Authorization header
 */
export const makeHeaders = (opts = {}) => {
  const headers = { ...API.headers, ...(opts.headers || {}) }
  const token = opts.auth === false ? null : getAuthToken()
  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`
  return headers
}