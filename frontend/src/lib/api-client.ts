// import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
// import type { ApiErrorBody } from "@/types";

// export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// const ACCESS_KEY = "sv_access_token";
// const REFRESH_KEY = "sv_refresh_token";

// // The backend hands back raw tokens in the JSON body instead of httpOnly cookies
// // (see AuthController.signin/signup), so there's no safer place to keep them than
// // storage. localStorage is used here for simplicity; swapping this module for one
// // backed by an httpOnly cookie is the main thing to change if the API is hardened later.
// export const tokenStore = {
//   getAccess: () => localStorage.getItem(ACCESS_KEY),
//   getRefresh: () => localStorage.getItem(REFRESH_KEY),
//   set: (accessToken: string, refreshToken?: string) => {
//     localStorage.setItem(ACCESS_KEY, accessToken);
//     if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
//   },
//   clear: () => {
//     localStorage.removeItem(ACCESS_KEY);
//     localStorage.removeItem(REFRESH_KEY);
//   },
// };

// export const apiClient = axios.create({ baseURL: API_URL });

// apiClient.interceptors.request.use((config) => {
//   const token = tokenStore.getAccess();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// let refreshInFlight: Promise<string> | null = null;

// async function refreshAccessToken(): Promise<string> {
//   const refreshToken = tokenStore.getRefresh();
//   if (!refreshToken) throw new Error("No refresh token available");

//   const res = await axios.post<{ data: { accessToken: string } }>(
//     `${API_URL}/auth/refresh`,
//     {},
//     { headers: { Authorization: `Bearer ${refreshToken}` } },
//   );
//   const { accessToken } = res.data.data;
//   tokenStore.set(accessToken, refreshToken);
//   return accessToken;
// }

// apiClient.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError<ApiErrorBody>) => {
//     const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
//     const status = error.response?.status;
//     const isAuthRoute = original?.url?.includes("/auth/signin") || original?.url?.includes("/auth/signup");

//     if (status === 401 && original && !original._retried && !isAuthRoute) {
//       original._retried = true;
//       try {
//         refreshInFlight ??= refreshAccessToken().finally(() => {
//           refreshInFlight = null;
//         });
//         const newToken = await refreshInFlight;
//         original.headers.Authorization = `Bearer ${newToken}`;
//         return apiClient(original);
//       } catch {
//         tokenStore.clear();
//         window.location.assign("/login");
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// /** Normalizes whatever the backend's error envelope contains into a readable message. */
// export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
//   if (axios.isAxiosError<ApiErrorBody>(error)) {
//     return error.response?.data?.details ?? error.response?.data?.message ?? fallback;
//   }
//   return fallback;
// }

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorBody } from "@/types";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
// The backend returns asset paths (e.g. avatar) as root-relative, like
// "/uploads/avatars/xxx.jpg" — meant to be resolved against the API server,
// not the frontend's own origin. new URL('/api', 'http://localhost:3000/api')
// resolves relative to the origin, so stripping '/api' gives the API origin.
export const API_ORIGIN = new URL(API_URL).origin;

/** Turns a backend-relative asset path into an absolute URL. Leaves already-absolute URLs (e.g. Google avatars) untouched. */
export function resolveAssetUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_ORIGIN}${pathOrUrl}`;
}

const ACCESS_KEY = "sv_access_token";
const REFRESH_KEY = "sv_refresh_token";

// The backend hands back raw tokens in the JSON body instead of httpOnly cookies
// (see AuthController.signin/signup), so there's no safer place to keep them than
// storage. localStorage is used here for simplicity; swapping this module for one
// backed by an httpOnly cookie is the main thing to change if the API is hardened later.
export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const apiClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await axios.post<{ data: { accessToken: string } }>(
    `${API_URL}/auth/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );
  const { accessToken } = res.data.data;
  tokenStore.set(accessToken, refreshToken);
  return accessToken;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const status = error.response?.status;
    const isAuthRoute =
      original?.url?.includes("/auth/signin") ||
      original?.url?.includes("/auth/signup");

    if (status === 401 && original && !original._retried && !isAuthRoute) {
      original._retried = true;
      try {
        refreshInFlight ??= refreshAccessToken().finally(() => {
          refreshInFlight = null;
        });
        const newToken = await refreshInFlight;
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        tokenStore.clear();
        window.location.assign("/login");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

/** Normalizes whatever the backend's error envelope contains into a readable message. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.details ?? error.response?.data?.message ?? fallback
    );
  }
  return fallback;
}
