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
            className="flex flex-col min-w-[120px] max-w-[180px] mx-auto"
        >
            <div className="relative w-full">
                <img
                    src={manga?.cover ?? `${service.url}/assets/noimage.png`}
                    alt={manga.title}
                    className="w-full aspect-[2/3] object-cover bg-gray-300 rounded-xl"
                    loading="lazy"
                />
                <span className="absolute bottom-0 w-full text-xs text-center py-1 bg-gradient-to-t from-black/80 to-transparent">
                    Shinobu
                </span>
            </div>

            <a className="w-1/2 rounded-br-2xl px-0.5 py-1 text-xs text-center bg-[#C667F7]">
                {manga.type}
            </a>

            <span className="mt-1 text-xs font-semibold text-center line-clamp-2">{manga.title}</span>
        </div>
    );
};

/* ===================== Landing Page ===================== */
const Landing = () => {
    const { service, user } = useShinobu();
    const [time, setTime] = useState<string>();
    const [latestData, setLatestData] = useState<MangaItem[]>([]);
    const [latestLoading, setLatestLoading] = useState(false);

    const [historyData, setHistoryData] = useState<UserHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const [_, setError] = useState<string | null>(null);

    const navigate = useShiNavigate(service?.id);

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

            const mapped = res.result.map(mapApiMediaWrapperToManga);
            setLatestData(mapped);
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
        } catch (err) {
            console.error("Failed to fetch history", err);
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
            const dateObject = new Date();
            setTime(
                `${dateObject.getHours()} : ${dateObject.getMinutes()} : ${dateObject.getSeconds()}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="lg:p-10">
            {/* HEADER */}
            <div className="grid grid-cols-2">
                <div className="flex flex-row items-center p-4 gap-4">
                    <div onClick={() => navigate(`/profile`)}>
                        <img
                            className="min-w-10 min-h-10 w-10 h-10 aspect-square rounded-full object-cover"
                            src={
                                user?.avatarUrl ??
                                `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.username}`
                            }
                        />
                    </div>
                    <a className="lg:text-lg font-bold">
                        Wellcome Kak {user?.displayName ?? user?.username}!
                    </a>
                </div>
                <div className="hidden lg:flex flex-row items-center justify-end gap-4">
                    <a className="text-lg font-bold">{time}</a>
                </div>
            </div>

            {/* TERBARU */}
            <section>
                <div className="flex flex-row gap-5 items-center">
                    <a className="text-lg font-semibold">Terbaru</a>
                    <div className="py-2 px-3 rounded-xl bg-[#202020]" onClick={() => navigate("search/latest")}>
                        Cek lainnya
                    </div>
                </div>
                <div className="w-full flex flex-row overflow-y-scroll gap-3 mt-4">
                    {(service && latestData.length > 0) &&
                        latestData.slice(0, 7).map((m) => <MangaCard manga={m} service={service} />)
                    }
                </div>
            </section>

            {/* LANJUTKAN MEMBACA */}
            <section className="mt-10">
                <div className="flex flex-row gap-5 items-center">
                    <a className="text-lg font-semibold">Lanjutkan Membaca</a>
                </div>

                {historyLoading && <div className="text-slate-400 text-sm mt-2">Loading...</div>}
                {!historyLoading && historyData.length === 0 && (
                    <div className="text-slate-500 text-sm mt-2">Tidak ada riwayat membaca.</div>
                )}

                {/* Responsive: mobile scroll, desktop grid 3 kolom */}
                {!historyLoading && historyData.length > 0 && service && (
                    <div className="w-full flex flex-row overflow-y-scroll gap-3 mt-4">
                        {historyData
                            .slice(0, 7)
                            .map((item) => (
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