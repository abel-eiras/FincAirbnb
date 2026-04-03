import { API_BASE_URL } from "./runtime";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface ApiResult<T> {
  success: boolean;
  data: T;
  message?: string;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("fincairbnb_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = (await response.json()) as ApiResult<T>;
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Erro na chamada á API");
  }

  return payload.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body)
};
