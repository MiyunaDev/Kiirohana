/* ===============================
 * Shinobu Fetch Utils (TypeScript)
 * =============================== */

import { ShinobuAuthError, ShinobuBackendError, ShinobuNetworkError } from "./handleShinobu";

export interface ShinobuFetchOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: Record<string, string>;
  auth?: boolean;
  baseUrl?: string;
  localId: string; // WAJIB
}

interface ShinobuErrorResponse {
  message?: string;
}

/* ---------- Helpers ---------- */

const getAppCredentials = (localId: string) => ({
  appKey: localStorage.getItem(`${localId}-x-app-key`),
  appSecret: localStorage.getItem(`${localId}-x-app-secret`),
});

const getAuthToken = (localId: string): string | null =>
  localStorage.getItem(`${localId}-auth-token`);

const redirectTo = (path: string): void => {
  window.location.href = path;
};

/* ---------- Core Fetch ---------- */

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

  /**
   * ❗ Jangan set Content-Type untuk FormData
   */
  if (!isFormData) {
    requestHeaders["Content-Type"] ??= "application/json";
  }

  let response: Response;
  let data: TResponse | ShinobuErrorResponse | null = null;

  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body:
        body == null
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
    });

    const text = await response.text();
    data = text ? JSON.parse(text) : null;

  } catch (error) {
    console.error("Shinobu Network Error:", error);

    throw new ShinobuNetworkError(
      "Tidak dapat terhubung ke server. Periksa koneksi atau konfigurasi aplikasi."
    );
  }

  /* ---------- Error Handling ---------- */

  if (!response.ok) {
    const message =
      (data as ShinobuErrorResponse)?.message ??
      `Server error (${response.status})`;

    if (
      message ===
      "Akses ditolak: kredensial aplikasi tidak lengkap"
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

    throw new ShinobuBackendError(message, response.status);
  }

  return data as TResponse;
}