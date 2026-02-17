import { useState } from "react";
import { useParams } from "react-router";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import ServiceLogo from "../../../components/Settings/Service/ServiceLogo";
import type { ServiceItem } from "../../../interfaces/Service";
import { useShiNavigate } from "../../utils/shiNavigate";

type Account = {
    id: string;
    username: string;
    avatar?: string;
};

type ServicesStorage = {
    honoka: ServiceItem | null;
    shinobu: ServiceItem[];
};

type AccountCenterLocalStorage = {
    token: string;
    activeAccount: Account | null;
    accounts: Account[];
};

const ShinobuLogin = () => {
    const { shinobuid } = useParams<{ shinobuid: string }>();
    const navigate = useShiNavigate(shinobuid);

    const [services] =
        useLocalStorage<ServicesStorage>("services", {
            honoka: null,
            shinobu: [],
        });

    const service = services.shinobu.find((s) => s.id === shinobuid);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
    const [showEmailForm, setShowEmailForm] = useState(false);

    /* ================= INVALID SERVICE ================= */
    if (!service) {
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
            setEmailError(null);

            const res = await shinobuFetch<{
                token: string;
                user: {
                    id: string;
                    username: string;
                    avatar?: string;
                    accounts: Account[];
                };
                migrated?: boolean;
                emailRequired?: boolean;
            }>(`/${service.version?.endpoint}/auth/login`, {
                baseUrl: service.url,
                auth: false,
                method: "POST",
                body: { username, password },
                localId: service.id,
            });

            // simpan token
            localStorage.setItem(`${service.id}-auth-token`, res.token);

            // simpan akun aktif & daftar akun di localStorage
            const accountData: AccountCenterLocalStorage = {
                token: res.token,
                activeAccount: {
                    id: res.user.id,
                    username: res.user.username,
                    avatar: res.user.avatar,
                },
                accounts: res.user.accounts,
            };
            localStorage.setItem(`${service.id}-account-center`, JSON.stringify(accountData));

            // jika migrasi membutuhkan email, tampilkan form
            if (res.emailRequired) {
                setShowEmailForm(true);
                return;
            }

            // login sukses, navigasi ke home
            navigate("app/home", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login gagal");
        } finally {
            setLoading(false);
        }
    };

    /* ================= SUBMIT EMAIL ================= */
    const handleSubmitEmail = async () => {
        if (!email) {
            setEmailError("Email wajib diisi");
            return;
        }

        // opsional validasi email
        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Format email tidak valid");
            return;
        }

        try {
            setLoading(true);
            setEmailError(null);

            const res = await shinobuFetch<{ email: string }>(
                `/${service.version?.endpoint}/auth/account-center/email`,
                {
                    method: "PUT",
                    auth: true, // pakai token login
                    baseUrl: service.url,
                    body: { newEmail: email },
                    localId: service.id,
                }
            );

            setEmailSuccess(`Email berhasil diperbarui: ${res.email}`);
            setShowEmailForm(false);

            // navigasi ke home setelah update
            navigate("app/home", { replace: true });
        } catch (err) {
            setEmailError(err instanceof Error ? err.message : "Gagal memperbarui email");
        } finally {
            setLoading(false);
        }
    };

    /* ================= RENDER ================= */
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#101010] text-white">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md px-4 sm:px-6 flex flex-col items-center gap-4 text-center">
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

                {/* FORM LOGIN ATAU EMAIL */}
                <div className="w-full flex flex-col gap-2 mt-2">
                    {showEmailForm ? (
                        <>
                            <input
                                type="email"
                                placeholder="Masukkan email Anda"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#1f1f1f] border border-[#2a2a2a] text-sm outline-none focus:border-[#C667F7]"
                            />
                            {emailError && (
                                <p className="text-[11px] text-red-400 mt-1">{emailError}</p>
                            )}
                            {emailSuccess && (
                                <p className="text-[11px] text-green-400 mt-1">{emailSuccess}</p>
                            )}
                            <button
                                onClick={handleSubmitEmail}
                                disabled={loading}
                                className={`mt-2 py-2 rounded-md text-sm font-medium transition ${
                                    loading
                                        ? "bg-[#303030] text-zinc-500"
                                        : "bg-[#C667F7] text-black hover:brightness-110"
                                }`}
                            >
                                {loading ? "Menyimpan…" : "Simpan Email"}
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#1f1f1f] border border-[#2a2a2a] text-sm outline-none focus:border-[#C667F7]"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-[#1f1f1f] border border-[#2a2a2a] text-sm outline-none focus:border-[#C667F7]"
                            />
                            {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className={`mt-2 py-2 rounded-md text-sm font-medium transition ${
                                    loading
                                        ? "bg-[#303030] text-zinc-500"
                                        : "bg-[#C667F7] text-black hover:brightness-110"
                                }`}
                            >
                                {loading ? "Masuk…" : "Masuk"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShinobuLogin;