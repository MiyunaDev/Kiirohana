import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { FaMagnifyingGlass, FaXmark, FaFilter } from "react-icons/fa6";

import { ServiceItem } from "../../../interfaces/Service";
import { useShinobu } from "../../../hooks/useShinobu";

/* ===================== Types ===================== */

export interface MangaItem {
  id: string;
  title: string;
  thumbnail: string;
  genres: string[];
  description: string | null;
  type: "COMIC" | "NOVEL" | "TV";
  lastUploadedAt?: string;
}

export interface SearchFilter {
  query: string;
  author: string;
  artist: string;
  genres: string[];
  country: string[];
  format: string[];
  status: string[];
  language: string;
  year?: number;
}

/* ===================== Manga Card ===================== */

const MangaCard = ({ manga, service }: { manga: MangaItem; service: ServiceItem }) => (
  <Link
    to={`/shinobu/${service.id}/detail/${manga.id}`}
    className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
  >
    <div className="relative w-full">
      <img
        src={manga.thumbnail ?? "/assets/noimage.png"}
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

/* ===================== Advance Search Modal ===================== */

interface AdvanceSearchModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: SearchFilter) => void;
  filter: SearchFilter;
}

const AdvanceSearchModal: React.FC<AdvanceSearchModalProps> = ({
  open,
  onClose,
  onApply,
  filter
}) => {
  const [local, setLocal] = useState<SearchFilter>(filter);

  useEffect(() => setLocal(filter), [filter]);

  if (!open) return null;

  // Contoh options
  const GENRES = ["Action","Adventure","Comedy","Drama","Ecchi","Fantasy","Horror","Romance","Sci-Fi","Slice of Life","Supernatural","Thriller","Mystery","Sports","Josei","Seinen","Psychological","Music","Shoujo","Shounen"];
  const COUNTRIES = ["JP","KR","CN"];
  const FORMATS = ["doujinshi","oneshot"];
  const STATUS = ["completed","ongoing","upcoming","cancelled","hiatus"];
  const LANGUAGES = ["id","en","jp","kr","cn"];

  const renderMultiSelect = (label: string, options: string[], selected: string[], onChange: (v: string[]) => void) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex flex-wrap gap-2 bg-[#2a2a2a] p-2 rounded max-h-32 overflow-y-auto">
        {options.map(opt => (
          <label
            key={opt}
            className="flex items-center gap-1 cursor-pointer px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#333] text-white"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => {
                if (selected.includes(opt)) {
                  onChange(selected.filter(s => s !== opt));
                } else {
                  onChange([...selected, opt]);
                }
              }}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1e1e1e] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          <FaXmark size={20} />
        </button>

        <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white sticky top-0 bg-[#1e1e1e] pt-1">
          <FaFilter /> Advance Search
        </h2>

        <div className="flex flex-col gap-3">
          {/* Basic inputs */}
          <input
            className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Query"
            value={local.query}
            onChange={e => setLocal({ ...local, query: e.target.value })}
          />
          <input
            className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Author"
            value={local.author}
            onChange={e => setLocal({ ...local, author: e.target.value })}
          />
          <input
            className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Artist"
            value={local.artist}
            onChange={e => setLocal({ ...local, artist: e.target.value })}
          />

          {/* Multi-selects */}
          {renderMultiSelect("Genres", GENRES, local.genres, v => setLocal({ ...local, genres: v }))}
          {renderMultiSelect("Country", COUNTRIES, Array.isArray(local.country) ? local.country : [local.country], v => setLocal({ ...local, country: v }))}
          {renderMultiSelect("Format", FORMATS, local.format, v => setLocal({ ...local, format: v }))}
          {renderMultiSelect("Status", STATUS, local.status, v => setLocal({ ...local, status: v }))}
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">Language</span>
            <select
              className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white"
              value={local.language}
              onChange={e => setLocal({ ...local, language: e.target.value })}
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <input
            type="number"
            className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Year"
            value={local.year ?? ""}
            onChange={e => setLocal({ ...local, year: Number(e.target.value) || undefined })}
          />
        </div>

        <button
          onClick={() => {
            onApply(local);
            onClose();
          }}
          className="mt-4 w-full py-2 rounded bg-purple-600 hover:bg-purple-700 transition text-white font-semibold"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
};


/* ===================== Main Page ===================== */

const Advance: React.FC = () => {
  const { service } = useShinobu();
  const [data, setData] = useState<MangaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>({
    query: "",
    author: "",
    artist: "",
    genres: [],
    country: ["JP"],
    format: [],
    status: [],
    language: "id"
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* ===== Fetch Search ===== */
  const fetchSearch = async (targetPage: number) => {
    if (!service || loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      localStorage.setItem(`${service.id}-x-app-key`, service.accessKey!);
      localStorage.setItem(`${service.id}-x-app-secret`, service.secretKey!);

      // Panggil searchMedia jika ada
      let res: MangaItem[] = [];
      // @ts-ignore
      if (service.searchMedia) res = await service.searchMedia({ ...filter, page: targetPage });

      const mapped = res
        .sort((a, b) => (new Date(b.lastUploadedAt ?? 0).getTime() - new Date(a.lastUploadedAt ?? 0).getTime()))
        .map(item => ({
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail ?? "/assets/noimage.png",
          genres: item.genres ?? [],
          description: item.description,
          type: item.type ?? "COMIC",
          lastUploadedAt: item.lastUploadedAt
        }));

      setData(prev => targetPage === 1 ? mapped : [...prev, ...mapped]);
      setPage(targetPage);
      setHasMore(mapped.length === 20);
    } catch (err: any) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Reset on Filter / Service Change ===== */
  useEffect(() => {
    if (!service) return;
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchSearch(1);
  }, [service, filter]);

  /* ===== Infinite Scroll ===== */
  useEffect(() => {
    const current = loadMoreRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          fetchSearch(page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [service, filter, page, loading, hasMore]);

  /* ===== Render ===== */
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-3 mb-4 flex justify-between">
        <h1 className="text-lg font-semibold">Manga Library</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex gap-2 px-3 py-2 rounded bg-[#2a2a2a]"
        >
          <FaMagnifyingGlass /> Advance Search
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-screen-xl mx-auto px-2">
        {service && data.map(m => <MangaCard key={m.id} manga={m} service={service} />)}

        <div ref={loadMoreRef} className="col-span-full flex justify-center py-6">
          {loading && <span className="text-sm animate-pulse">Memuat data...</span>}
          {error && (
            <button onClick={() => fetchSearch(page)} className="px-4 py-2 text-sm rounded bg-red-500/20">
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
        filter={filter}
      />
    </>
  );
};

export default Advance;