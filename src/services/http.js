/* Thin HTTP client used by RTK Query's baseQuery (and any future
   endpoint). It centralises auth headers, JSON serialisation, timeouts
   and unified error messages so the rest of the app never touches
   axios (or fetch) directly. */

import axios from 'axios'
import { API, makeHeaders } from '../config/app'

/** Reusable axios instance wired to the app's API config. */
export const http = axios.create({
  baseURL: API.baseUrl,
  timeout: API.timeoutMs,
  withCredentials: API.cors.allowCredentials,
  headers: makeHeaders({ auth: false }),
})

export async function apiFetch(
  path,
  { method = 'GET', body, headers, auth = true, timeout = API.timeoutMs } = {},
) {
  try {
    const res = await http.request({
      url: path,
      method,
      timeout,
      headers: makeHeaders({ headers, auth }),
      data: body == null ? undefined : body,
      validateStatus: () => true,
    })
    if (res.status === 204) return null
    const data = res.data
    if (res.status >= 400) {
      throw new Error(data?.message || data?.error || `Request failed (${res.status})`)
    }
    return data
  } catch (err) {
    if (err?.code === 'ECONNABORTED') throw new Error('Request timed out. Please try again.')
    throw err
  }
}

/** Pull a human-readable message out of any thrown value. */
export const errMsg = (err) => err?.message || err?.data?.message || 'Something went wrong.'