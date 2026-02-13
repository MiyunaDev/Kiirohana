import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";
import { FaXmark, FaFilter } from "react-icons/fa6";

import { ServiceItem } from "../../../interfaces/Service";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useShinobu } from "../../../hooks/useShinobu";

/* ===================== Types ===================== */

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

interface ApiLatestStatus {
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
  genres: m.genres?.map(g => g.name) ?? [],
  description: m.description,
  type: m.type,
});

/* ===================== Manga Card ===================== */

const MangaCard = ({ manga, service }: { manga: MangaItem; service: ServiceItem }) => (
  <Link
    to={`/shinobu/${service.id}/detail/${manga.id}`}
    className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
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

    <span className="mt-1 text-xs font-semibold text-center line-clamp-2">
      {manga.title}
    </span>
  </Link>
);

/* ===================== Advance Search ===================== */

const AdvanceSearchModal = ({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (v: { title: string; genre: string; adult: boolean }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [adult, setAdult] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-[#1e1e1e] p-6">
        <button onClick={onClose} className="absolute top-4 right-4">
          <FaXmark />
        </button>

        <h2 className="flex items-center gap-2 mb-4">
          <FaFilter /> Advance Search
        </h2>

        <input
          className="w-full mb-2 px-3 py-2 rounded bg-[#2a2a2a]"
          placeholder="Judul"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          className="w-full mb-2 px-3 py-2 rounded bg-[#2a2a2a]"
          placeholder="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
        />

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={adult}
            onChange={() => setAdult(v => !v)}
          />
          Tampilkan Adult
        </label>

        <button
          onClick={() => {
            onApply({ title, genre, adult });
            onClose();
          }}
          className="mt-4 w-full py-2 rounded bg-[#C667F7]"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
};

/* ===================== Main Page ===================== */

const MangaListPage = () => {
  const { service } = useShinobu();
  const [data, setData] = useState<MangaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    title: "",
    genre: "",
    adult: false,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* ===== Fetch ===== */
  const fetchLatest = async (targetPage: number) => {
    if (!service || loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      localStorage.setItem(`${service.id}-x-app-key`, service.accessKey!);
      localStorage.setItem(`${service.id}-x-app-secret`, service.secretKey!);

      let url = `/${service.version?.endpoint}/media/latest?page=${targetPage}`;

      const res = await shinobuFetch<LatestMediaResponseWrapper>(url, {
        baseUrl: service.url,
        localId: service.id,
        auth: true,
      });

      const mapped = res.result.map(mapApiMediaWrapperToManga);

      setData(prev => [...prev, ...mapped]);
      setHasMore(res.result.length > 5);
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Initial Load / Reset on Service or Filter Change ===== */
  useEffect(() => {
    if (!service) return;

    setData([]);
    setHasMore(true);

    fetchLatest(1);
  }, [service, filter]);

  // Hapus fetchLatest dari setPage
  const handleNextPage = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Panggil fetchLatest setiap page berubah
  useEffect(() => {
    if (page === 1) return; // 1 sudah di-fetch pada initial load
    fetchLatest(page);
  }, [page]);


  /* ===== Infinite Scroll ===== */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, loading, hasMore, service, filter]);

  /* ===== Render ===== */
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-screen-xl mx-auto px-2">
        {service &&
          data.map(m => <MangaCard key={m.id} manga={m} service={service} />)}

        <div ref={loadMoreRef} className="col-span-full flex justify-center py-6">
          {loading && <span className="text-sm animate-pulse">Memuat data...</span>}

          {error && (
            <button
              onClick={() => fetchLatest(page + 1)}
              className="px-4 py-2 text-sm rounded bg-red-500/20"
            >
              Gagal memuat · Coba lagi
            </button>
          )}

          {!hasMore && !loading && (
            <span className="text-xs text-gray-500">Tidak ada data lagi</span>
          )}
        </div>
      </div>

      <AdvanceSearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={setFilter}
      />
    </>
  );
};

export default MangaListPage;