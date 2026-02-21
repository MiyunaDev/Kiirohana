import toast from "react-hot-toast";

export class ShinobuNetworkError extends Error {
  type = "network";
}

export class ShinobuBackendError extends Error {
  type = "backend";
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export class ShinobuAuthError extends Error {
  type = "auth";
}

export function handleShinobuError(error: unknown) {
  if (error instanceof ShinobuNetworkError) {
    toast.error(
      "❌ Tidak bisa terhubung ke server.\n" +
      "Cek koneksi, SSL, atau konfigurasi Cordova."
    );
    return;
  }

  if (error instanceof ShinobuAuthError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof ShinobuBackendError) {
    toast.error(
      `⚠️ Backend error: ${error.message}`
    );
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error("Terjadi kesalahan tidak diketahui");
}