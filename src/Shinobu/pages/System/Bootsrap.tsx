import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import ServiceLogo from "../../../components/Settings/Service/ServiceLogo";
import type { ServiceItem } from "../../../interfaces/Service";

type BootStep =
    | "init"
    | "connecting"
    | "auth-check"
    | "redirecting"
    | "error";

type ServicesStorage = {
    honoka: ServiceItem | null;
    shinobu: ServiceItem[];
};

const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const stepLabel: Record<BootStep, string> = {
    init: "Menyiapkan koneksi…",
    connecting: "Menghubungkan ke Shinobu…",
    "auth-check": "Memverifikasi akun…",
    redirecting: "Menyiapkan aplikasi…",
    error: "Terjadi kesalahan",
};

const stepIndex: Record<BootStep, number> = {
    init: 0,
    connecting: 1,
    "auth-check": 2,
    redirecting: 3,
    error: 3,
};

const ShinobuProgress = ({ step }: { step: BootStep }) => {
    const progress = ((stepIndex[step] + 1) / 4) * 100;

    return (
        <div className="w-full max-w-xs mt-4">
            <div className="h-[2px] w-full bg-white/10 rounded overflow-hidden">
                <div
                    className="h-full bg-[#C667F7] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-2 text-[11px] text-white/60 text-center">
                {stepLabel[step]}
            </p>
        </div>
    );
};

const ShinobuBootstrap = () => {
    const navigate = useNavigate();
    const { shinobuid } = useParams();

    const [services] = useLocalStorage<ServicesStorage>("services", {
        honoka: null,
        shinobu: [],
    });

    const [service, setService] = useState<ServiceItem | null>(null);
    const [step, setStep] = useState<BootStep>("init");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shinobuid) {
            navigate("/shinobu/", { replace: true });
            return;
        }

        const current = services.shinobu.find(
            (s) => s.id === shinobuid
        );

        if (!current) {
            navigate("/shinobu/", { replace: true });
            return;
        }

        let cancelled = false;
        setService(current);

        const run = async () => {
            try {
                /* INIT */
                await sleep(1000);
                if (cancelled) return;

                /* CONNECTING */
                setStep("connecting");
                localStorage.setItem(`${current.id}-x-app-key`, current.accessKey!);
                localStorage.setItem(`${current.id}-x-app-secret`, current.secretKey!);

                const info = await shinobuFetch<ServiceItem["info"]>(
                    `/info`,
                    {
                        baseUrl: current.url,
                        auth: false, 
                        localId: current.id
                    }
                );

                await sleep(1000);
                if (cancelled) return;

                setService((prev) =>
                    prev
                        ? {
                            ...prev,
                            info,
                            version:
                                prev.version ?? info?.versions?.[0],
                        }
                        : prev
                );

                /* AUTH CHECK */
                setStep("auth-check");
                await sleep(1000);
                if (cancelled) return;

                const token = localStorage.getItem(`${current.id}-auth-token`);
                if (!token) {
                    navigate(
                        `/shinobu/${current.id}/login`,
                        { replace: true }
                    );
                    return;
                }

                /* REDIRECT */
                setStep("redirecting");
                await sleep(1000);
                if (cancelled) return;

                navigate(
                    `/shinobu/${current.id}/app/home`
                );
            } catch (err) {
                setStep("error");
                setError(
                    err instanceof Error
                        ? err.message
                        : "Gagal terhubung ke Shinobu"
                );

                await sleep(2500);
                navigate("/shinobu/", { replace: true });
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [shinobuid, navigate, services.shinobu]);

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#101010] text-white">
            <div className="flex flex-col items-center text-center w-full max-w-xs sm:max-w-sm md:max-w-md px-4 sm:px-6 gap-3 sm:gap-4">
                {service?.info?.logo && (
                    <div className="scale-90 sm:scale-100 md:scale-110">
                        <ServiceLogo
                            baseUrl={service.url}
                            logo={service.info.logo}
                            logoData={service.logoData}
                            onLoad={() => { }}
                        />
                    </div>
                )}

                <h1 className="font-semibold text-base sm:text-lg md:text-xl">
                    {service?.info?.name ?? "Shinobu"}
                </h1>

                {service?.version && (
                    <span className="text-[10px] sm:text-xs opacity-60">
                        v{service.version.version}
                    </span>
                )}

                <ShinobuProgress step={step} />

                {error && (
                    <p className="text-[11px] sm:text-xs text-red-400 mt-1 max-w-xs">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ShinobuBootstrap;