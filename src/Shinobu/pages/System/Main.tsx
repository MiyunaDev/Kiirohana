import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { ServiceItem } from "../../../interfaces/Service";
import ServiceLogo from "../../../components/Settings/Service/ServiceLogo";
import { shinobuFetch } from "../../../utils/fetchShinobu";

type ServicesStorage = {
    honoka: ServiceItem | null;
    shinobu: ServiceItem[];
};

const InstalledShinobu = () => {
    const navigate = useNavigate();

    const [services, setServices] =
        useLocalStorage<ServicesStorage>("services", {
            honoka: null,
            shinobu: [],
        });

    const [loading, setLoading] = useState(false);

    const updateService = (updated: ServiceItem) => {
        setServices((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                shinobu: prev.shinobu.map((s) =>
                    s.id === updated.id ? updated : s
                ),
            };
        });
    };

    /* ================= FETCH INFO ================= */

    useEffect(() => {
        if (!services || services.shinobu.length === 0) return;

        let cancelled = false;
        setLoading(true);

        Promise.all(
            services.shinobu.map(async (service) => {
                try {
                    if (!service.accessKey || !service.secretKey) {
                        throw new Error("Credential Shinobu tidak lengkap");
                    }

                    localStorage.setItem(`${service.id}-x-app-key`, service.accessKey);
                    localStorage.setItem(`${service.id}-x-app-secret`, service.secretKey);

                    const info = await shinobuFetch<ServiceItem["info"]>(
                        "/info",
                        {
                            baseUrl: service.url,
                            auth: false, 
                            localId: service.id
                        }
                    );

                    if (cancelled) return service;

                    return {
                        ...service,
                        info,
                        version:
                            service.version ?? info?.versions?.[0],
                        error: undefined,
                    };
                } catch (err) {
                    if (cancelled) return service;

                    return {
                        ...service,
                        info: undefined,
                        error:
                            err instanceof Error
                                ? err.message
                                : "Gagal mengambil info Shinobu",
                    };
                }
            })
        )
            .then((updated) => {
                if (!cancelled) {
                    setServices({
                        ...services,
                        shinobu: updated,
                    });
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    /* ================= RENDER ================= */

    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
            <header className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-5 my-4">
                    <button className="bg-[#202020] py-2 px-3 rounded-lg" onClick={() => navigate(-1)}>Kembali</button>
                    <h2 className="text-lg sm:text-xl font-semibold">
                        Shinobu Services Mode
                    </h2>
                </div>
                <p className="text-xs sm:text-sm opacity-60">
                    Daftar service Shinobu Media Server yang telah terhubung
                </p>
            </header>

            {loading && (
                <p className="text-xs opacity-60">
                    Memuat informasi Shinobu...
                </p>
            )}

            {services.shinobu.length === 0 && (
                <div className="bg-[#404040] rounded p-4 text-sm text-zinc-400
                        border border-dashed border-[#C667F7]/40">
                    Belum ada Shinobu yang terpasang
                </div>
            )}

            {/* RESPONSIVE GRID */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {services.shinobu.map((service) => {
                    const hasError = Boolean(service.error);

                    return (
                        <div
                            key={service.id}
                            className="bg-[#1f1f1f] border border-[#2a2a2a]
                         rounded-xl p-4 flex flex-col gap-3"
                        >
                            {/* HEADER */}
                            <div className="flex items-center gap-3">
                                {service.info?.logo && (
                                    <ServiceLogo
                                        baseUrl={service.url}
                                        logo={service.info.logo}
                                        logoData={service.logoData}
                                        onLoad={(data) =>
                                            updateService({
                                                ...service,
                                                logoData: data,
                                            })
                                        }
                                    />
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                        {service.info?.name ??
                                            "Unknown Shinobu"}
                                    </p>
                                    {service.version && (
                                        <span className="text-xs opacity-70">
                                            v{service.version.version}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-xs opacity-70 line-clamp-2">
                                {service.info?.description}
                            </p>

                            {/* ERROR */}
                            {service.error && (
                                <span className="text-xs text-red-400">
                                    {service.error}
                                </span>
                            )}

                            {/* ACTION */}
                            <button
                                disabled={hasError}
                                onClick={() =>
                                    navigate(
                                        `/shinobu/${service.id}/`
                                    )
                                }
                                className={`mt-auto text-xs px-3 py-2 rounded-md
                  transition
                  ${hasError
                                        ? "bg-[#303030] text-zinc-500 cursor-not-allowed"
                                        : "bg-[#C667F7] text-black hover:brightness-110"
                                    }`}
                            >
                                Masuk Shinobu
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InstalledShinobu;