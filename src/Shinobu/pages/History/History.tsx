import { useEffect, useRef, useState } from "react";
import { useShinobu } from "../../../hooks/useShinobu";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { ServiceItem } from "../../../interfaces/Service";
import { Link } from "react-router";
import Media from "../../../interfaces/Media";
import { Chapter } from "../../../types/Series";

/* ===================== Types ===================== */

type UserHistoryItem = {
  media: Media;
  chapter?: Chapter | null;
  createdAt: string;
};

interface MangaItem {
  id?: string;
  title: string;
  cover?: string;
  type: "COMIC" | "NOVEL" | "TV";
}

/* ===================== Manga Card ===================== */
const MangaCard = ({ manga, service }: { manga: MangaItem; service: ServiceItem }) => (
  <Link
    to={`/shinobu/${service.id}/detail/${manga.id}`}
    className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
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

    <a className="w-1/2 rounded-br-2xl px-0.5 py-1 text-xs text-center bg-[#C667F7]">
      {manga.type}
    </a>

    <span className="mt-1 text-xs font-semibold text-center line-clamp-2">{manga.title}</span>
  </Link>
);

/* ===================== Helper: Group By Date ===================== */
const groupHistoryByDate = (history: UserHistoryItem[]) => {
  return history.reduce<Record<string, UserHistoryItem[]>>((acc, item) => {
    const dateKey = new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});
};

/* ===================== History Page ===================== */
const HistoryPage = () => {
  const { service } = useShinobu();
  const [historyData, setHistoryData] = useState<UserHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ===== Fetch History ===== */
  const fetchHistory = async (targetPage: number) => {
    if (!service || loading || !hasMore) return;
    try {
      setLoading(true);
      setError(null);

      const res = await shinobuFetch<{ data: UserHistoryItem[] }>(
        `/${service.version?.endpoint}/user/me/history?byTitle=true&page=${targetPage}`,
        { baseUrl: service.url, localId: service.id, auth: true }
      );

      setHistoryData(prev => [...prev, ...res.data]);
      setHasMore(res.data.length > 0);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat riwayat");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Initial Load ===== */
  useEffect(() => {
    if (!service) return;
    setHistoryData([]);
    setPage(1);
    setHasMore(true);
    fetchHistory(1);
  }, [service]);

  /* ===== Pagination ===== */
  const handleNextPage = () => {
    if (!loading && hasMore) setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page === 1) return;
    fetchHistory(page);
  }, [page]);

  /* ===== Infinite Scroll ===== */
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) handleNextPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, loading, hasMore]);

  /* ===== Group Data ===== */
  const grouped = groupHistoryByDate(historyData);

  /* ===== Render ===== */
  return (
    <div className="max-w-screen-xl mx-auto px-2 py-6">
      {Object.keys(grouped).length === 0 && !loading && (
        <div className="text-slate-500 text-sm">Tidak ada riwayat membaca.</div>
      )}

      {Object.entries(grouped).map(([date, items]) => (
        <section key={date} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{date}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map(item => (
              <MangaCard
                key={item.media._id}
                manga={{
                  id: item.media?._id,
                  title: item.media.title,
                  cover: item.media.coverImage ?? undefined,
                  type: item.media.type,
                }}
                service={service!}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Loader / Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-6">
        {loading && <span className="text-sm animate-pulse">Memuat riwayat...</span>}
        {error && (
          <button
            onClick={() => fetchHistory(page)}
            className="px-4 py-2 text-sm rounded bg-red-500/20"
          >
            {error} · Coba lagi
          </button>
        )}
        {!hasMore && !loading && <span className="text-xs text-gray-500">Tidak ada data lagi</span>}
      </div>
    </div>
  );
};

export default HistoryPage;