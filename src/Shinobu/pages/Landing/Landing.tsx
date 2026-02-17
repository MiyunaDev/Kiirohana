import { useEffect, useState } from "react";
import { useShinobu } from "../../../hooks/useShinobu";
import { ServiceItem } from "../../../interfaces/Service";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useShiNavigate } from "../../utils/shiNavigate";
import Media from "../../../interfaces/Media";
import { Chapter } from "../../../types/Series";

/* ===================== Types ===================== */

/* --- Latest Media --- */
interface ApiMediaWrapper {
    _id: string;
    title: string;
    alternativeTitle?: string[];
    description?: string | null;
    genres?: { name: string }[];
    coverImage?: string;
    bannerImage?: string;
    status?: "ONGOING" | "COMPLETED" | "HIATUS";
    type: "COMIC" | "NOVEL" | "TV";
    releaseDate?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LatestMediaResponseWrapper {
    success: boolean;
    fetchedAt: string;
    source: string[];
    status: ApiLatestStatus;
    result: ApiMediaWrapper[];
}

export interface ApiLatestStatus {
    refreshed: number;
    cooldown: number;
    fail: number;
}

interface MangaItem {
    id: string;
    title: string;
    cover?: string;
    genres?: string[];
    description?: string | null;
    type: "COMIC" | "NOVEL" | "TV";
}

const mapApiMediaWrapperToManga = (m: ApiMediaWrapper): MangaItem => ({
    id: m._id,
    title: m.title,
    cover: m.coverImage,
    genres: m.genres?.map((g) => g.name) ?? [],
    description: m.description,
    type: m.type,
});

/* --- User History --- */
type UserHistoryItem = {
    media: Media;
    chapter?: Chapter | null;
    createdAt: string;
};

/* ===================== Manga Card ===================== */
const MangaCard = ({ manga, service }: { manga: MangaItem; service: ServiceItem }) => {
    const navigate = useShiNavigate(service.id);

    return (
        <div
            onClick={() => navigate(`/detail/${manga.id}`)}
            className="flex flex-col min-w-[120px] max-w-[180px] mx-auto cursor-pointer"
        >
            <div className="relative w-full">
                <img
                    src={manga.cover ?? `${service.url}/assets/noimage.png`}
                    alt={manga.title}
                    className="w-full aspect-[2/3] object-cover bg-gray-300 rounded-xl"
                    loading="lazy"
                />
                <span className="absolute bottom-0 w-full text-xs text-center py-1 bg-gradient-to-t from-black/80 to-transparent">
                    Shinobu
                </span>
            </div>

            <span className="mt-1 text-xs font-semibold text-center line-clamp-2">
                {manga.title}
            </span>
        </div>
    );
};

/* ===================== Landing Page ===================== */
const Landing = () => {
    const { service, user } = useShinobu();
    const navigate = useShiNavigate(service?.id);

    const [time, setTime] = useState<string>();
    const [latestData, setLatestData] = useState<MangaItem[]>([]);
    const [latestLoading, setLatestLoading] = useState(false);

    const [historyData, setHistoryData] = useState<UserHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const [_, setError] = useState<string | null>(null);

    /* ===== Fetch Latest Media ===== */
    const fetchLatest = async () => {
        if (!service || latestLoading) return;

        try {
            setLatestLoading(true);
            setError(null);

            localStorage.setItem(`${service.id}-x-app-key`, service.accessKey!);
            localStorage.setItem(`${service.id}-x-app-secret`, service.secretKey!);

            const res = await shinobuFetch<LatestMediaResponseWrapper>(
                `/${service.version?.endpoint}/media/latest`,
                { baseUrl: service.url, localId: service.id, auth: true }
            );

            setLatestData(res.result.map(mapApiMediaWrapperToManga));
        } catch {
            setError("Gagal memuat data");
        } finally {
            setLatestLoading(false);
        }
    };

    /* ===== Fetch User History ===== */
    const fetchHistory = async () => {
        if (!service) return;
        setHistoryLoading(true);

        try {
            const res = await shinobuFetch<{ data: UserHistoryItem[] }>(
                `/${service.version?.endpoint}/user/me/history?byTitle=true`,
                { baseUrl: service.url, localId: service.id, auth: true }
            );
            setHistoryData(res.data);
        } catch {
            setHistoryData([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    /* ===== Initial Load ===== */
    useEffect(() => {
        if (!service) return;
        setLatestData([]);
        setHistoryData([]);
        fetchLatest();
        fetchHistory();
    }, [service]);

    /* ===== Clock ===== */
    useEffect(() => {
        const interval = setInterval(() => {
            const d = new Date();
            setTime(`${d.getHours()} : ${d.getMinutes()} : ${d.getSeconds()}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="lg:p-10">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 gap-4 rounded-lg">
                {/* ===== USER INFO ===== */}
                <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                    <div onClick={() => navigate(`/profile`)} className="flex-shrink-0">
                        <img
                            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer"
                            src={
                                user?.avatarUrl ??
                                `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.username}`
                            }
                            alt={`${user?.username}'s avatar`}
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="font-bold text-base sm:text-lg truncate">
                            Welcome Kak {user?.displayName ?? user?.username}!
                        </span>

                        {/* ===== LEVEL & XP ===== */}
                        {user?.stats && (
                            <div className="flex flex-col gap-1 text-xs text-slate-300">
                                <div className="flex flex-row items-center gap-2 truncate">
                                    <span className="font-semibold text-purple-400">
                                        Lv. {user.stats.level}
                                    </span>
                                    <span className="truncate">
                                        {user.stats.currentXp} / {user.stats.xpToNextLevel} XP
                                    </span>
                                </div>

                                <div className="w-full sm:w-48 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300"
                                        style={{
                                            width: `${Math.min(Math.max(user.stats.progress * 100, 0), 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== TIME ===== */}
                <div className="mt-2 sm:mt-0 flex justify-center md:justify-start sm:justify-end w-full sm:w-auto">
                    <span className="text-lg font-bold">{time}</span>
                </div>
            </div>


            {/* ================= TERBARU ================= */}
            <section>
                <div className="flex flex-row gap-5 items-center">
                    <span className="text-lg font-semibold">Terbaru</span>
                    <div
                        className="py-2 px-3 rounded-xl bg-[#202020] cursor-pointer"
                        onClick={() => navigate("/app/search/latest")}
                    >
                        Cek lainnya
                    </div>
                </div>

                <div className="w-full flex flex-row overflow-y-scroll gap-3 mt-4">
                    {service &&
                        latestData.slice(0, 7).map((m) => (
                            <MangaCard key={m.id} manga={m} service={service} />
                        ))}
                </div>
            </section>

            {/* ================= LANJUTKAN MEMBACA ================= */}
            <section className="mt-10">
                <span className="text-lg font-semibold">Lanjutkan Membaca</span>

                {historyLoading && (
                    <div className="text-slate-400 text-sm mt-2">Loading...</div>
                )}

                {!historyLoading && historyData.length === 0 && (
                    <div className="text-slate-500 text-sm mt-2">
                        Tidak ada riwayat membaca.
                    </div>
                )}

                {!historyLoading && historyData.length > 0 && service && (
                    <div className="w-full flex flex-row overflow-y-scroll gap-3 mt-4">
                        {historyData.slice(0, 7).map((item) => (
                            <MangaCard
                                key={item.media._id}
                                manga={{
                                    id: item.media._id as string,
                                    title: item.media.title,
                                    cover: item.media.coverImage ?? undefined,
                                    type: item.media.type,
                                }}
                                service={service}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Landing;