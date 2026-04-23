import { useEffect, useState } from "react";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShinobu } from "../../hooks/useShinobu";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type Account = {
    id: string;
    username: string;
    avatar?: string;
    role?: string;
};

type AccountCenterStorage = {
    activeAccount: Account | null;
    accounts: Account[];
    token: string | null;
};


const MAX_ACCOUNTS = 2;

const AccountCenterPage = () => {
    const { service, user, refresh } = useShinobu();

    const mapUserToAccount = (u: typeof user | null): Account | null => {
        if (!u) return null;
        return {
            id: u._id,
            username: u.username,
            avatar: u.avatarUrl,
            role: u.role,
        };
    };

    const initialAccount = mapUserToAccount(user);

    const [data, setData] = useLocalStorage<AccountCenterStorage>(
        `${service?.id}-account-center`,
        {
            activeAccount: initialAccount,
            accounts: initialAccount ? [initialAccount] : [],
            token: null,
        }
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    /* ================= FETCH ACCOUNTS ================= */
    const fetchAccounts = async () => {
        if (!service) return;

        try {
            setLoading(true);
            setError(null);

            const res = await shinobuFetch<{ accounts: Account[] }>(
                `/${service.version?.endpoint}/auth/account-center`,
                {
                    baseUrl: service.url,
                    method: "GET",
                    auth: true,
                    localId: service.id,
                }
            );

            setData((prev) => ({
                ...prev,
                accounts: res.accounts,
                activeAccount: prev.activeAccount ?? res.accounts[0] ?? null,
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat akun");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [service]);

    /* ================= SWITCH ACCOUNT ================= */
    const handleSwitchAccount = async (accountId: string) => {
        if (!service) return;

        try {
            setLoading(true);
            setError(null);

            const res = await shinobuFetch<{ token: string; user: Account }>(
                `/${service.version?.endpoint}/auth/switch-account`,
                {
                    baseUrl: service.url,
                    method: "POST",
                    auth: true,
                    localId: service.id,
                    body: { accountId },
                }
            );

            localStorage.setItem(`${service.id}-auth-token`, res.token);
            refresh()
            setData((prev) => ({
                ...prev,
                activeAccount: res.user
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal ganti akun");
        } finally {
            setLoading(false);
        }
    };

    /* ================= ADD NEW ACCOUNT ================= */
    const handleAddAccount = async () => {
        if (!service) return;
        if (data.accounts.length >= MAX_ACCOUNTS) {
            setError(`Maksimal ${MAX_ACCOUNTS} akun saja`);
            return;
        }
        if (!newUsername || !newPassword) {
            setError("Username dan password wajib diisi");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await shinobuFetch<{ token: string; user: Account }>(
                `/${service.version?.endpoint}/auth/register`,
                {
                    baseUrl: service.url,
                    method: "POST",
                    auth: true,
                    localId: service.id,
                    body: { username: newUsername, password: newPassword },
                }
            );

            setData((prev) => ({
                ...prev,
                accounts: [...prev.accounts, res.user],
                activeAccount: res.user
            }));

            setNewUsername("");
            setNewPassword("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menambahkan akun");
        } finally {
            setLoading(false);
        }
    };

    /* ================= RENDER ================= */
    return (
        <div className="p-4 sm:p-6 max-w-md mx-auto text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Account Center</h1>

            {error && (
                <div className="bg-red-700/50 text-red-300 p-2 rounded mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            {/* AKUN AKTIF */}
            <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Akun Aktif:</h2>
                {data.activeAccount ? (
                    <div className="flex items-center gap-3 bg-gray-800 p-3 rounded shadow-sm">
                        <img
                            src={data.activeAccount.avatar ?? `https://api.dicebear.com/8.x/identicon/svg?seed=${data.activeAccount?.username}`}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border-2 border-purple-500"
                        />
                        <span className="font-medium">{data.activeAccount.username}</span>
                    </div>
                ) : (
                    <p className="text-gray-400">Belum ada akun aktif</p>
                )}
            </div>

            {/* SWITCH ACCOUNT */}
            {data.accounts.length > 1 && (
                <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">Switch Account:</h2>
                    <ul className="space-y-2">
                        {data.accounts.map((acc) => {
                            console.log(acc)
                            const activeId = data.activeAccount?.id;
                            return (
                                <li key={acc.id}>
                                    <button
                                        className={`w-full flex items-center gap-2 px-4 py-2 rounded transition-colors ${activeId === acc.id ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
                                            }`}
                                        onClick={() => handleSwitchAccount(acc.id)}
                                        disabled={loading || activeId === acc.id}
                                    >
                                        <img src={acc.avatar ?? `https://api.dicebear.com/8.x/identicon/svg?seed=${acc?.username}`} alt="avatar" className="w-8 h-8 rounded-full" />
                                        <span>{acc.username}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* ADD NEW ACCOUNT */}
            {data.accounts.length < MAX_ACCOUNTS && (
                <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">Tambah Akun Baru:</h2>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                        <button
                            className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700 transition"
                            onClick={handleAddAccount}
                            disabled={loading}
                        >
                            {loading ? "Menambahkan…" : "Tambah Akun"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountCenterPage;