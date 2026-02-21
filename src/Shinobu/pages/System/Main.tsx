import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa6";
import { v4 as uuid } from "uuid";

import ServiceLogo from "../../components/Settings/Service/ServiceLogo";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { shinobuFetch } from "../../utils/fetchShinobu";
import type { ServiceItem } from "../../interfaces/Service";

type ServiceKind = "honoka" | "shinobu";

type ServicesStorage = {
  honoka: ServiceItem | null;
  shinobu: ServiceItem[];
};

const ServicesManager = () => {
  const navigate = useNavigate();
  const fetchedRef = useRef<Set<string>>(new Set());

  const [services, setServices] = useLocalStorage<ServicesStorage>("services", {
    honoka: null,
    shinobu: [],
  });

  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKind, _] = useState<ServiceKind>("shinobu");
  const [urlInput, setUrlInput] = useState("");
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* ================= SAFE FETCH ================= */

  useEffect(() => {
    services.shinobu.forEach((service) => {
      if (
        fetchedRef.current.has(service.id) ||
        service.info ||
        !service.enabled
      )
        return;

      fetchedRef.current.add(service.id);
      setLoadingIds((prev) => new Set(prev).add(service.id));

      (async () => {
        try {
          localStorage.setItem(`${service.id}-x-app-key`, service.accessKey!);
          localStorage.setItem(
            `${service.id}-x-app-secret`,
            service.secretKey!
          );

          const info = await shinobuFetch<ServiceItem["info"]>("/info", {
            baseUrl: service.url,
            auth: false,
            localId: service.id,
          });

          setServices((prev) =>
            prev
              ? {
                  ...prev,
                  shinobu: prev.shinobu.map((s) =>
                    s.id === service.id
                      ? {
                          ...s,
                          info,
                          version: s.version ?? info?.versions?.[0],
                          error: undefined,
                        }
                      : s
                  ),
                }
              : prev
          );
        } catch (err) {
          setServices((prev) =>
            prev
              ? {
                  ...prev,
                  shinobu: prev.shinobu.map((s) =>
                    s.id === service.id
                      ? {
                          ...s,
                          error:
                            err instanceof Error
                              ? err.message
                              : "Gagal mengambil info",
                        }
                      : s
                  ),
                }
              : prev
          );
        } finally {
          setLoadingIds((prev) => {
            const next = new Set(prev);
            next.delete(service.id);
            return next;
          });
        }
      })();
    });
  }, [services.shinobu.length]); // 🔥 hanya tergantung jumlah

  /* ================= ADD SERVICE ================= */

  const submitService = () => {
    if (!urlInput.trim()) {
      setError("URL wajib diisi");
      return;
    }

    if (selectedKind === "shinobu") {
      if (!accessKeyInput.trim() || !secretKeyInput.trim()) {
        setError("Access Key & Secret Key wajib diisi");
        return;
      }
    }

    const newService: ServiceItem = {
      id: uuid(),
      url: urlInput.trim(),
      kind: selectedKind,
      enabled: true,
      ...(selectedKind === "shinobu"
        ? {
            accessKey: accessKeyInput.trim(),
            secretKey: secretKeyInput.trim(),
          }
        : {}),
    };

    setServices((prev) =>
      prev
        ? {
            ...prev,
            shinobu: [...prev.shinobu, newService],
          }
        : prev
    );

    setModalOpen(false);
  };

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-8 bg-[#121212] text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold">Services Manager</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#C667F7]
          text-black px-4 py-2 rounded-lg font-medium
          hover:brightness-110 transition"
        >
          <FaPlus /> Tambah Service
        </button>
      </div>

      {/* GRID FULL WIDTH RESPONSIVE */}
      <div
        className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
      >
        {services.shinobu.map((service) => {
          const loading = loadingIds.has(service.id);

          return (
            <div
              key={service.id}
              className="
                bg-[#1b1b1b]
                border border-white/5
                rounded-2xl
                p-5
                flex flex-col
                gap-4
                hover:border-[#C667F7]/40
                transition
              "
            >
              <div className="flex items-center gap-4">
                {service.info?.logo && (
                  <ServiceLogo
                    baseUrl={service.url}
                    logo={service.info.logo}
                    logoData={service.logoData}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {service.info?.name ?? service.url}
                  </p>

                  {service.version && (
                    <p className="text-xs opacity-60">
                      v{service.version.version}
                    </p>
                  )}
                </div>
              </div>

              {loading && (
                <p className="text-xs opacity-60 animate-pulse">
                  Mengambil info...
                </p>
              )}

              {service.error && (
                <p className="text-xs text-red-400">
                  {service.error}
                </p>
              )}

              <button
                disabled={!!service.error}
                onClick={() =>
                  navigate(`/shinobu/${service.id}`, { replace: true })
                }
                className={`
                  mt-auto
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  transition
                  ${
                    service.error
                      ? "bg-[#303030] text-zinc-500"
                      : "bg-[#C667F7] text-black hover:brightness-110"
                  }
                `}
              >
                Masuk
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Tambah Shinobu</h2>

            <input
              type="url"
              placeholder="URL Service"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-[#2a2a2a] p-3 rounded-lg text-sm"
            />

            <input
              type="text"
              placeholder="Access Key"
              value={accessKeyInput}
              onChange={(e) => setAccessKeyInput(e.target.value)}
              className="w-full bg-[#2a2a2a] p-3 rounded-lg text-sm"
            />

            <input
              type="password"
              placeholder="Secret Key"
              value={secretKeyInput}
              onChange={(e) => setSecretKeyInput(e.target.value)}
              className="w-full bg-[#2a2a2a] p-3 rounded-lg text-sm"
            />

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalOpen(false)}>
                Batal
              </button>

              <button
                onClick={submitService}
                className="bg-[#C667F7] text-black px-4 py-2 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;