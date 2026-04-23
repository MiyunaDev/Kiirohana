import { FaPalette } from "react-icons/fa6";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import SettingMenu from "../../components/Settings/SettingMenu";
import ServiceCard from "../../components/Settings/Service/ServiceCard";
import { useLocalStorage } from "../../Shinobu/hooks/useLocalStorage";
import type { ServiceItem } from "../../Shinobu/interfaces/Service";

type ServiceKind = "honoka" | "shinobu";

type ServicesStorage = {
  honoka: ServiceItem | null;
  shinobu: ServiceItem[];
};

const Settings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKind, setSelectedKind] = useState<ServiceKind>("shinobu");

  const [urlInput, setUrlInput] = useState("");
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [secretKeyInput, setSecretKeyInput] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useLocalStorage<ServicesStorage>("services", {
    honoka: null,
    shinobu: [],
  });

  const openModal = (kind: ServiceKind) => {
    setSelectedKind(kind);
    setUrlInput("");
    setAccessKeyInput("");
    setSecretKeyInput("");
    setError(null);
    setModalOpen(true);
  };

  const submitService = () => {
    if (!urlInput.trim()) {
      setError("URL wajib diisi");
      return;
    }

    if (selectedKind === "shinobu") {
      if (!accessKeyInput.trim() || !secretKeyInput.trim()) {
        setError("Access Key dan Secret Key wajib diisi");
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

    setServices((prev) => {
      if (!prev) return prev;

      if (selectedKind === "honoka") {
        if (prev.honoka) {
          setError("Honoka hanya boleh satu");
          return prev;
        }

        return { ...prev, honoka: newService };
      }

      return {
        ...prev,
        shinobu: [...prev.shinobu, newService],
      };
    });

    setModalOpen(false);
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-4">
          <SettingMenu icon={<FaPalette />} name="Appearance" />

          <button
            onClick={() => openModal("shinobu")}
            className="relative bg-[#404040] group overflow-hidden
              flex items-center gap-3
              px-4 py-3 rounded-lg text-sm
              before:absolute before:left-0 before:top-0 before:h-full before:w-0
              before:transition-all before:duration-500 before:bg-[#C667F7]
              hover:before:w-full hover:shadow hover:shadow-[#C667F7]/40"
          >
            <span className="z-10 font-medium transition-all duration-300 group-hover:text-[#101010]">
              + Tambah Shinobu
            </span>
          </button>

          <button
            onClick={() => openModal("honoka")}
            disabled={!!services?.honoka}
            className="relative bg-[#404040] group overflow-hidden
              flex items-center gap-3
              px-4 py-3 rounded-lg text-sm disabled:opacity-50
              before:absolute before:left-0 before:top-0 before:h-full before:w-0
              before:transition-all before:duration-500 before:bg-[#C667F7]
              hover:before:w-full hover:shadow hover:shadow-[#C667F7]/40"
          >
            <span className="z-10 font-medium transition-all duration-300 group-hover:text-[#101010]">
              + Tambah Honoka
            </span>
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4">
          {services.honoka && (
            <ServiceCard
              service={services.honoka}
              onUpdate={(updated) => {
                setServices((prev) =>
                  prev ? { ...prev, honoka: updated ?? null } : prev
                );
              }}
            />
          )}

          <hr />

          {services.shinobu.length === 0 ? (
            <div className="bg-[#404040] rounded p-4 text-sm text-zinc-400 border border-dashed border-[#C667F7]/40">
              Belum ada service Shinobu
            </div>
          ) : (
            services.shinobu.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onUpdate={(updated) => {
                  setServices((prev) => {
                    if (!prev) return prev;

                    if (!updated) {
                      return {
                        ...prev,
                        shinobu: prev.shinobu.filter(
                          (s) => s.id !== service.id
                        ),
                      };
                    }

                    return {
                      ...prev,
                      shinobu: prev.shinobu.map((s) =>
                        s.id === updated.id ? updated : s
                      ),
                    };
                  });
                }}
                onDelete={() => {
                  setServices((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      shinobu: prev.shinobu.filter(
                        (s) => s.id !== service.id
                      ),
                    };
                  });
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-[#404040]
            shadow-lg shadow-[#C667F7]/40 overflow-hidden animate-scale-in"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-[#C667F7]" />

            <div className="p-4 border-b border-white/10 flex justify-between">
              <h3 className="font-semibold">
                Tambah {selectedKind === "shinobu" ? "Shinobu" : "Honoka"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-[#C667F7]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <input
                type="url"
                placeholder="URL Service"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded-md bg-[#303030] border border-white/10
            px-4 py-2 text-sm
            focus:outline-none focus:border-[#C667F7]
            focus:ring-1 focus:ring-[#C667F7]"
              />

              {selectedKind === "shinobu" && (
                <>
                  <input
                    type="text"
                    placeholder="Access Key"
                    value={accessKeyInput}
                    onChange={(e) => setAccessKeyInput(e.target.value)}
                    className="w-full rounded-md bg-[#303030] border border-white/10
            px-4 py-2 text-sm
            focus:outline-none focus:border-[#C667F7]
            focus:ring-1 focus:ring-[#C667F7]"
                  />
                  <input
                    type="password"
                    placeholder="Secret Key"
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    className="w-full rounded-md bg-[#303030] border border-white/10
            px-4 py-2 text-sm
            focus:outline-none focus:border-[#C667F7]
            focus:ring-1 focus:ring-[#C667F7]"
                  />
                </>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-[#303030] px-4 py-2 rounded text-sm"
              >
                Batal
              </button>

              <button
                onClick={submitService}
                className="relative bg-[#404040] group overflow-hidden
                  px-4 py-2 rounded text-sm hover:shadow hover:shadow-[#C667F7]"
              >
                <span className="absolute inset-0 w-0 bg-[#C667F7]
                  transition-all duration-500 group-hover:w-full" />
                <span className="relative z-10 group-hover:text-[#101010]">
                  Simpan
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;