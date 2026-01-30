import { FaPalette } from "react-icons/fa6"
import SettingMenu from "../../components/Settings/SettingMenu";
import ServiceCard from "../../components/Settings/Service/ServiceCard";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid"
import { loadServices, saveServices, ServicesState } from "../../utils/service/serviceManager";

const Settings = () => {
  const [services, setServices] = useState<ServicesState>(() => loadServices());

  type ServiceKind = "honoka" | "shinobu";

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKind, setSelectedKind] = useState<ServiceKind>("shinobu");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openModal = (kind: ServiceKind) => {
    setSelectedKind(kind);
    setUrlInput("");
    setError(null);
    setModalOpen(true);
  };

  const submitService = () => {
    if (!urlInput.trim()) {
      setError("URL wajib diisi");
      return;
    }

    if (selectedKind === "honoka") {
      if (services.honoka) {
        setError("Honoka hanya boleh satu");
        return;
      }
      addHonoka(urlInput);
    } else {
      addShinobu(urlInput);
    }

    setModalOpen(false);
  };


  useEffect(() => {
    saveServices(services);
  }, [services]);

  /* ================= HONOKA ================= */

  const addHonoka = (url: string) => {
    if (services.honoka) return;
    if (!url) return;
    if (!url.trim()) return;

    setServices((prev) => ({
      ...prev,
      honoka: {
        id: uuid(),
        kind: "honoka",
        enabled: true,
        url: url
      }
    }));
  };

  /* ================= SHINOBU ================= */

  const addShinobu = (url: string) => {
    if (!url) return;
    if (!url.trim()) return;

    setServices((prev) => ({
      ...prev,
      shinobu: [
        ...prev.shinobu,
        {
          id: uuid(),
          kind: "shinobu",
          enabled: true,
          url: url
        },
      ],
    }));
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="grid gap-4 lg:grid-cols-2">


        {/* LEFT PANEL */}
        <div className="flex flex-col gap-4">

          {/* Header (pakai SettingMenu biar konsisten) */}
          <SettingMenu
            icon={<FaPalette />}
            name="Appearance"
          />

          {/* Action Buttons */}
          <button
            onClick={() => openModal("shinobu")}
            className="
relative bg-[#404040] group overflow-hidden
flex items-center gap-3
px-4 py-3 sm:py-3.5
rounded-lg text-sm
before:absolute before:left-0 before:top-0 before:h-full before:w-0
before:transition-all before:duration-500 before:bg-[#C667F7]
hover:before:w-full
hover:shadow hover:shadow-[#C667F7]/40
"
          >
            <span className="z-10 font-medium transition-all duration-300
          group-hover:text-[#101010]">
              + Tambah Shinobu
            </span>
          </button>

          <button
            onClick={() => openModal("honoka")}
            disabled={!!services.honoka}
            className="
relative bg-[#404040] group overflow-hidden
flex items-center gap-3
px-4 py-3 sm:py-3.5
rounded-lg text-sm
before:absolute before:left-0 before:top-0 before:h-full before:w-0
before:transition-all before:duration-500 before:bg-[#C667F7]
hover:before:w-full
hover:shadow hover:shadow-[#C667F7]/40
"
          >
            <span className="z-10 font-medium transition-all duration-300
          group-hover:text-[#101010]">
              + Tambah Honoka
            </span>
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4">
          {!services.honoka ? (
            <div className="bg-[#404040] rounded p-4 text-sm text-zinc-400 border border-dashed border-[#C667F7]/40">
              Belum ada service Honoka
            </div>
          ) : (
            <ServiceCard
              key={services.honoka?.id}
              service={services.honoka}
              onUpdate={(updated) => {
                if (!updated) return;
                setServices((prev) => ({
                  ...prev,
                  honoka: updated
                }));
              }}
            />
          )}
          <hr></hr>
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
                  if (!updated) return;
                  setServices((prev) => ({
                    ...prev,
                    shinobu: prev.shinobu.map((s) =>
                      s.id === updated.id ? updated : s
                    ),
                  }));
                }}
              />
            ))
          )}
        </div>

      </div>

      {/* FLOATING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Box */}
          <div
            className="relative z-10 w-full max-w-md rounded-xl bg-[#404040]
      shadow-lg shadow-[#C667F7]/40 overflow-hidden
      animate-scale-in"
          >
            {/* Accent Bar */}
            <div className="absolute top-0 left-0 h-1 w-full bg-[#C667F7]" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-base font-semibold tracking-wide">
                Tambah {selectedKind === "shinobu" ? "Shinobu" : "Honoka"}
              </h3>

              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-[#C667F7] transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3">
              <input
                type="url"
                placeholder="Masukkan URL service"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded-md bg-[#303030] border border-white/10
            px-4 py-2 text-sm
            focus:outline-none focus:border-[#C667F7]
            focus:ring-1 focus:ring-[#C667F7]"
              />

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 flex justify-end gap-3 border-t border-white/10">

              {/* Cancel */}
              <button
                onClick={() => setModalOpen(false)}
                className="relative bg-[#303030] px-4 py-2 rounded
            text-sm transition hover:bg-[#353535]"
              >
                Batal
              </button>

              {/* Save — neon sweep */}
              <button
                onClick={submitService}
                className="relative bg-[#404040] group overflow-hidden
            px-4 py-2 rounded text-sm font-medium
            hover:shadow hover:shadow-[#C667F7]"
              >
                <span
                  className="absolute inset-0 w-0 bg-[#C667F7]
            transition-all duration-500 group-hover:w-full"
                />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[#101010]">
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