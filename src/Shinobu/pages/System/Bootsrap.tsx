import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { shinobuFetch } from "../../utils/fetchShinobu";
import ServiceLogo from "../../components/Settings/Service/ServiceLogo";
import type { ServiceItem } from "../../interfaces/Service";
import { useShiNavigate } from "../../utils/shiNavigate";

/* ================= TYPES ================= */

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

/* ================= UTILS ================= */

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

/* ================= UI ================= */

const ShinobuProgress = ({ step }: { step: BootStep }) => {
  const progress = ((stepIndex[step] + 1) / 4) * 100;

  return (
    <div className="w-full max-w-xs mt-4">
      <div className="h-[2px] bg-white/10 rounded overflow-hidden">
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

/* ================= BOOTSTRAP ================= */

const ShinobuBootstrap = () => {
  const { shinobuid } = useParams<{ shinobuid: string }>();

  // 🔑 scoped navigator → BASE = /shinobu/:shinobuid
  const navigate = useShiNavigate(shinobuid);

  const [services] = useLocalStorage<ServicesStorage>("services", {
    honoka: null,
    shinobu: [],
  });

  const [service, setService] = useState<ServiceItem | null>(null);
  const [step, setStep] = useState<BootStep>("init");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* ================= GUARD ================= */

    if (!shinobuid) {
      navigate("..", { replace: true });
      return;
    }

    const current = services.shinobu.find(
      (s) => s.id === shinobuid
    );

    if (!current) {
      navigate("..", { replace: true });
      return;
    }

    let cancelled = false;
    setService(current);

    const run = async () => {
      try {
        /* INIT */
        await sleep(600);
        if (cancelled) return;

        /* CONNECTING */
        setStep("connecting");

        localStorage.setItem(
          `${current.id}-x-app-key`,
          current.accessKey ?? ""
        );
        localStorage.setItem(
          `${current.id}-x-app-secret`,
          current.secretKey ?? ""
        );

        const info = await shinobuFetch<ServiceItem["info"]>(
          "/info",
          {
            baseUrl: current.url,
            auth: false,
            localId: current.id,
          }
        );

        await sleep(600);
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
        await sleep(600);
        if (cancelled) return;

        const token = localStorage.getItem(
          `${current.id}-auth-token`
        );

        if (!token) {
          // ✅ RELATIVE
          navigate("login", { replace: true });
          return;
        }

        /* REDIRECT */
        setStep("redirecting");
        await sleep(600);
        if (cancelled) return;

        // ✅ RELATIVE
        navigate("app/home", { replace: true });
      } catch (err) {
        if (cancelled) return;

        setStep("error");
        setError(
          err instanceof Error
            ? err.message
            : "Gagal terhubung ke Shinobu"
        );

        await sleep(2000);
        navigate("..", { replace: true });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [shinobuid, services.shinobu]);

  /* ================= RENDER ================= */

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#101010] text-white">
      <div className="flex flex-col items-center text-center max-w-xs px-4 gap-3">
        {service?.info?.logo && (
          <ServiceLogo
            baseUrl={service.url}
            logo={service.info.logo}
            logoData={service.logoData}
            onLoad={() => {}}
          />
        )}

        <h1 className="font-semibold text-lg">
          {service?.info?.name ?? "Shinobu"}
        </h1>

        {service?.version && (
          <span className="text-xs opacity-60">
            v{service.version.version}
          </span>
        )}

        <ShinobuProgress step={step} />

        {error && (
          <p className="text-xs text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShinobuBootstrap;