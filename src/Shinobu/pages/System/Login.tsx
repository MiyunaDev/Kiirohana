import { useState } from "react";
import { useParams } from "react-router";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import ServiceLogo from "../../../components/Settings/Service/ServiceLogo";
import type { ServiceItem } from "../../../interfaces/Service";
import { useShiNavigate } from "../../utils/shiNavigate";

type ServicesStorage = {
    honoka: ServiceItem | null;
    shinobu: ServiceItem[];
};

const ShinobuLogin = () => {
    const { shinobuid } = useParams<{ shinobuid: string }>();

    // scoped navigator: BASE = /shinobu/:shinobuid
    const navigate = useShiNavigate(shinobuid);

    const [services] =
        useLocalStorage<ServicesStorage>("services", {
            honoka: null,
            shinobu: [],
        });

    const service = services.shinobu.find(
        (s) => s.id === shinobuid
    );

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ================= INVALID SERVICE ================= */

    if (!service) {
        // ⛔ JANGAN pakai "/shinobu"
        navigate("..", { replace: true });
        return null;
    }

    /* ================= LOGIN ================= */

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Username dan password wajib diisi");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await shinobuFetch<{
                token: string;
            }>(`/${service.version?.endpoint}/auth/login`, {
                baseUrl: service.url,
                auth: false,
                method: "POST",
                body: {
                    username,
                    password,
                },
                localId: service.id,
            });

            localStorage.setItem(
                `${service.id}-auth-token`,
                res.token
            );

            // ✅ RELATIVE ke /shinobu/:id
            navigate("app/home", { replace: true });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Login gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ================= RENDER ================= */

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#101010] text-white">
            <div
                className="
                    w-full max-w-xs sm:max-w-sm md:max-w-md
                    px-4 sm:px-6
                    flex flex-col items-center gap-4
                    text-center
                "
            >
                {/* LOGO */}
                {service.info?.logo && (
                    <div className="scale-90 sm:scale-100">
                        <ServiceLogo
                            baseUrl={service.url}
                            logo={service.info.logo}
                            logoData={service.logoData}
                            onLoad={() => {}}
                        />
                    </div>
                )}

                <h1 className="text-base sm:text-lg font-semibold">
                    Masuk ke {service.info?.name ?? "Shinobu"}
                </h1>

                {/* FORM */}
                <div className="w-full flex flex-col gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        className="
                            w-full px-3 py-2 rounded-md
                            bg-[#1f1f1f] border border-[#2a2a2a]
                            text-sm outline-none
                            focus:border-[#C667F7]
                        "
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="
                            w-full px-3 py-2 rounded-md
                            bg-[#1f1f1f] border border-[#2a2a2a]
                            text-sm outline-none
                            focus:border-[#C667F7]
                        "
                    />

                    {error && (
                        <p className="text-[11px] text-red-400 mt-1">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`
                            mt-2 py-2 rounded-md text-sm font-medium
                            transition
                            ${
                                loading
                                    ? "bg-[#303030] text-zinc-500"
                                    : "bg-[#C667F7] text-black hover:brightness-110"
                            }
                        `}
                    >
                        {loading ? "Masuk…" : "Masuk"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShinobuLogin;