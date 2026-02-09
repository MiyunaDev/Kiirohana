import { useEffect, useState } from "react";
import { useShinobu } from "../../../hooks/useShinobu";
import { Link, useNavigate, useParams } from "react-router";
import { ServiceItem } from "../../../interfaces/Service";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { shinobuFetch } from "../../../utils/fetchShinobu";

/* ===================== Types ===================== */

type ServicesStorage = {
    honoka: ServiceItem | null;
    shinobu: ServiceItem[];
};

/* --- API schema --- */
interface ApiMediaWrapper {
    _id: string;
    media: {
        _id: string;
        title: string;
        alternativeTitle: string[];
        description: string | null;
        genres: { name: string }[];
        coverImage: string;
        bannerImage?: string;
        status: "ONGOING" | "COMPLETED" | "HIATUS";
        type: "COMIC" | "NOVEL" | "TV";
        releaseDate: string | null;
        createdAt: string;
        updatedAt: string;
    };
    lastUploadedAt: string;
}

/* --- Update API response --- */
export interface LatestMediaResponseWrapper {
    success: boolean;
    fetchedAt: string;
    source: string[];
    status: ApiLatestStatus;
    result: ApiMediaWrapper[];
}

/* --- Update Adapter --- */
const mapApiMediaWrapperToManga = (m: ApiMediaWrapper): MangaItem => ({
    id: m._id,
    title: m.media.title,
    cover: m.media.coverImage,
    genres: m.media.genres.map(g => g.name),
    description: m.media.description,
    type: m.media.type
});

/* --- API response --- */
export interface ApiLatestStatus {
    refreshed: number;   // berhasil fetch
    cooldown: number;    // dilewati karena cooldown
    fail: number;        // error
}

/* --- UI model --- */
interface MangaItem {
    id: string;
    title: string;
    cover: string;
    genres: string[];
    description: string | null;
    type: "COMIC" | "NOVEL" | "TV"
}

/* ===================== Manga Card ===================== */

const MangaCard = ({ manga, service }: { manga: MangaItem, service: ServiceItem }) => (
    <Link
        to={`/shinobu/${service.id}/detail/${manga.id}`}
        className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
    >
        <div className="relative w-full">
            <img
                src={manga.cover}
                alt={manga.title}
                className="w-full aspect-[2/3] object-cover bg-gray-300 rounded-xl"
                loading="lazy"
            />
            <span className="absolute bottom-0 w-full text-xs text-center py-1 bg-gradient-to-t from-black/80 to-transparent">
                Shinobu
            </span>
        </div>

        <a className='w-1/2 rounded-br-2xl px-0.5 py-1 text-xs text-center bg-[#C667F7]'>
            {manga.type}
        </a>

        <span className="mt-1 text-xs font-semibold text-center line-clamp-2">
            {manga.title}
        </span>
    </Link>
);

const Landing = () => {
    const { user } = useShinobu()
    const [time, setTime] = useState<string>()

    const navigate = useNavigate();
    const { shinobuid } = useParams();

    const [services] =
        useLocalStorage<ServicesStorage>("services", {
            honoka: null,
            shinobu: [],
        });

    const [service, setService] =
        useState<ServiceItem | null>(null);

    const [data, setData] = useState<MangaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [_, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shinobuid) return;

        const current = services.shinobu.find(
            s => s.id === shinobuid
        );

        if (!current) {
            navigate("/#/shinobu", { replace: true });
            return;
        }

        setService(current);
    }, [shinobuid, services, navigate]);

    /* ===== Fetch ===== */

    const fetchLatest = async () => {
        if (!service || loading) return;

        try {
            setLoading(true);
            setError(null);

            localStorage.setItem(`${service.id}-x-app-key`, service.accessKey!);
            localStorage.setItem(`${service.id}-x-app-secret`, service.secretKey!);

            const res = await shinobuFetch<LatestMediaResponseWrapper>(
                `/${service.version?.endpoint}/media/latest`,
                { baseUrl: service.url, localId: service.id, auth: true }
            );

            const mapped = res.result
                .sort((a, b) => new Date(b.lastUploadedAt).getTime() - new Date(a.lastUploadedAt).getTime()) // sort terbaru
                .map(mapApiMediaWrapperToManga);

            setData(mapped)

        } catch {
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!service) return;

        setData([]);

        fetchLatest();
    }, [service]);

    useEffect(() => {
        setInterval(() => {
            const dateObject = new Date()

            const hour = dateObject.getHours()
            const minute = dateObject.getMinutes()
            const second = dateObject.getSeconds()

            const currentTime = hour + ' : ' + minute + ' : ' + second

            setTime(currentTime)
        }, 1000)
    }, [])

    return (
        <div className="lg:p-10">
            <div className="grid grid-cols-2">
                <div className="flex flex-row items-center p-4 gap-4">
                    <Link to={"/shinobu/profile"}>
                        <img className="min-w-10 min-h-10 w-10 h-10 aspect-square rounded-full object-cover" src={user?.avatarUrl ?? `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.username}`} />
                    </Link>
                    <a className="lg:text-lg font-bold">Wellcome Kak {user?.displayName ?? user?.username}!</a>
                </div>
                <div className="hidden lg:flex flex-row items-center justify-end gap-4">
                    <a className="text-lg font-bold">{time}</a>
                </div>
            </div>
            <section>
                <div className="flex flex-row gap-5 items-center">
                    <a className="text-lg font-semibold">Terbaru</a>
                    <Link className="py-2 px-3 rounded-xl bg-[#202020]" to={"search/latest"}>Cek lainnya</Link>
                </div>
                <div className="w-full flex flex-row overflow-y-scroll gap-3 mt-4">
                    {(service && data.length > 0) &&
                        data.slice(0, 7).map((m) => <MangaCard manga={m} service={service} />)
                    }
                </div>
            </section>
        </div>
    )
}

export default Landing