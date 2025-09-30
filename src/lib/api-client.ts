import { ApiResponse } from "@shared/types";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init });
  const json: ApiResponse<T> = await res.json();
  if (json.success === false) {
    // TypeScript now knows that `json` has the `error` property.
    throw new Error(json.error || 'Request failed');
  }
  if (json.success === true) {
    // TypeScript now knows that `json` has the `data` property.
    if (json.data === undefined) {
      throw new Error('Response data is undefined');
    }
    return json.data;
  }
  // Fallback for unexpected response shapes
  throw new Error('Invalid API response structure');
}