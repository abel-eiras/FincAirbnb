export function isExternalApiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_EXTERNAL_API === "true";
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000/api";
