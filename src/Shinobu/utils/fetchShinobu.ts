/* ===============================
 * Shinobu Fetch Utils with Axios (TypeScript)
 * =============================== */

import axios, { AxiosRequestConfig } from "axios";
import { ShinobuAuthError, ShinobuBackendError, ShinobuNetworkError } from "./handleShinobu";

export interface ShinobuFetchOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: Record<string, string>;
  auth?: boolean;
  baseUrl?: string;
  localId: string; // WAJIB
}

const getAppCredentials = (localId: string) => ({
  appKey: localStorage.getItem(`${localId}-x-app-key`),
  appSecret: localStorage.getItem(`${localId}-x-app-secret`),
});

const getAuthToken = (localId: string): string | null =>
  localStorage.getItem(`${localId}-auth-token`);

const redirectTo = (path: string): void => {
  window.location.href = path;
};

export async function shinobuFetch<
  TResponse = unknown,
  TBody = unknown
>(
  endpoint: string,
  options: ShinobuFetchOptions<TBody>
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    baseUrl = "",
    localId,
  } = options;

  if (!localId) {
    throw new Error("localId wajib disertakan pada shinobuFetch");
  }

  const { appKey, appSecret } = getAppCredentials(localId);
  const token = getAuthToken(localId);

  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  /* ---------- Headers ---------- */
  const requestHeaders: Record<string, string> = {
    ...(appKey ? { "x-app-key": appKey } : {}),
    ...(appSecret ? { "x-app-secret": appSecret } : {}),
    ...(auth && token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...headers,
  };

  if (!isFormData) {
    requestHeaders["Content-Type"] ??= "application/json";
  }

  const axiosConfig: AxiosRequestConfig = {
    url: `${baseUrl}${endpoint}`,
    method,
    headers: requestHeaders,
    data: isFormData ? body : body ?? undefined,
  };

  try {
    const response = await axios(axiosConfig);
    return response.data as TResponse;
  } catch (error: any) {
    if (error.response) {
      // Error dari server
      const status = error.response.status;
      const message = error.response.data?.message ?? `Server error (${status})`;

      if (
        message === "Akses ditolak: kredensial aplikasi tidak lengkap"
      ) {
        redirectTo("/settings/service");
        throw new ShinobuAuthError(message);
      }

      if (
        message === "User tidak valid" ||
        message === "Token autentikasi tidak ditemukan"
      ) {
        localStorage.removeItem(`${localId}-auth-token`);
        redirectTo("/shinobu/signin");
        throw new ShinobuAuthError(message);
      }

      throw new ShinobuBackendError(message, status);
    } else if (error.request) {
      // Tidak ada respons dari server
      console.error("Shinobu Network Error:", error);
      throw new ShinobuNetworkError(
        "Tidak dapat terhubung ke server. Periksa koneksi atau konfigurasi aplikasi."
      );
    } else {
      // Error lain
      throw error;
    }
  }
}