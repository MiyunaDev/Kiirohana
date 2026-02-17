import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { FaMagnifyingGlass, FaXmark, FaFilter } from "react-icons/fa6";

import { ServiceItem } from "../../../interfaces/Service";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useShinobu } from "../../../hooks/useShinobu";

/* ===================== Types ===================== */

interface ApiMediaWrapper {
  _id: string;
  title: string;
  description?: string | null;
  genres?: { name: string }[];
  coverImage?: string;
  type: "COMIC" | "NOVEL" | "TV";
}

interface BrowseMediaResponseWrapper {
  success: boolean;
  fetchedAt: string;
  source: string[];
  status: {
    refreshed: number;
    cooldown: number;
    fail: number;
  };
  result: ApiMediaWrapper[];
}

export interface MangaItem {
  id: string;
  title: string;
  cover?: string;
  genres: string[];
  description?: string | null;
  type: "COMIC" | "NOVEL" | "TV";
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

/* ===================== Helpers ===================== */

const mapApiToManga = (m: ApiMediaWrapper): MangaItem => ({
  id: m._id,
  title: m.title,
  cover: m.coverImage,
  genres: m.genres?.map(g => g.name) ?? [],
  description: m.description,
  type: m.type,
});

const appendIfNotEmpty = (
  params: URLSearchParams,
  key: string,
  value?: string | number
) => {
  if (value !== undefined && value !== "") {
    params.append(key, String(value));
  }
};

/* ===================== Advance Search Modal ===================== */

interface AdvanceSearchModalProps {
  open: boolean;
  filter: SearchFilter;
  onClose: () => void;
  onApply: (filter: SearchFilter) => void;
}

const AdvanceSearchModal: React.FC<AdvanceSearchModalProps> = ({
  open,
  filter,
  onClose,
  onApply,
}) => {
  const [local, setLocal] = useState<SearchFilter>(filter);

  useEffect(() => setLocal(filter), [filter]);
  if (!open) return null;

  const GENRES = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Horror",
    "Mystery", "Slice of Life", "Sci-Fi", "Supernatural", "Psychological",
    "Seinen", "Shounen", "Shoujo", "Josei"
  ];
  const COUNTRIES = ["JP", "KR", "CN"];
  const FORMATS = ["manga", "manhwa", "manhua", "oneshot", "doujinshi"];
  const STATUS = ["ONGOING", "COMPLETED", "HIATUS", "CANCELLED"];
  const LANGUAGES = ["id", "en", "jp", "kr", "cn"];

  const renderMultiSelect = (
    label: string,
    options: string[],
    value: string[],
    onChange: (v: string[]) => void
  ) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-2 bg-[#1e1e1e] p-2 rounded-lg max-h-28 overflow-y-auto">
        {options.map(opt => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() =>
                active
                  ? onChange(value.filter(v => v !== opt))
                  : onChange([...value, opt])
              }
              className={`px-2 py-1 text-xs rounded border transition
                ${active
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-[#2a2a2a] border-[#333] text-gray-300 hover:bg-[#333]"
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#121212] rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#121212] z-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FaFilter /> Advance Search
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaXmark size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            className="w-full px-3 py-2 rounded bg-[#1e1e1e] text-sm"
            placeholder="Judul / Query"
            value={local.query}
            onChange={e => setLocal({ ...local, query: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              className="px-3 py-2 rounded bg-[#1e1e1e] text-sm"
              placeholder="Author"
              value={local.author}
              onChange={e => setLocal({ ...local, author: e.target.value })}
            />
            <input
              className="px-3 py-2 rounded bg-[#1e1e1e] text-sm"
              placeholder="Artist"
              value={local.artist}
              onChange={e => setLocal({ ...local, artist: e.target.value })}
            />
          </div>

          {renderMultiSelect("Genres", GENRES, local.genres, v =>
            setLocal({ ...local, genres: v })
          )}
          {renderMultiSelect("Country", COUNTRIES, local.country, v =>
            setLocal({ ...local, country: v })
          )}
          {renderMultiSelect("Format", FORMATS, local.format, v =>
            setLocal({ ...local, format: v })
          )}
          {renderMultiSelect("Status", STATUS, local.status, v =>
            setLocal({ ...local, status: v })
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              className="px-3 py-2 rounded bg-[#1e1e1e] text-sm"
              value={local.language}
              onChange={e =>
                setLocal({ ...local, language: e.target.value })
              }
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <input
              type="number"
              className="px-3 py-2 rounded bg-[#1e1e1e] text-sm"
              placeholder="Year"
              value={local.year ?? ""}
              onChange={e =>
                setLocal({
                  ...local,
                  year: Number(e.target.value) || undefined,
                })
              }
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() =>
              setLocal({
                ...filter,
                genres: [...filter.genres],
                country: [...filter.country],
                format: [...filter.format],
                status: [...filter.status],
              })
            }
            className="flex-1 py-2 rounded bg-[#2a2a2a] text-sm"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            className="flex-1 py-2 rounded bg-purple-600 hover:bg-purple-700 text-sm font-semibold"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===================== Manga Card ===================== */

const MangaCard = ({ manga, service }: { manga: MangaItem; service: ServiceItem }) => (
  <Link
    to={`/shinobu/${service.id}/detail/${manga.id}`}
    className="flex flex-col w-full min-w-[120px] max-w-[180px] mx-auto"
  >
    <img
      src={manga.cover ?? `${service.url}/assets/noimage.png`}
      alt={manga.title}
      className="w-full aspect-[2/3] object-cover rounded-xl"
      loading="lazy"
    />
    <span className="mt-1 text-xs font-semibold text-center line-clamp-2">
      {manga.title}
    </span>
  </Link>
);

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
    country: [],
    format: [],
    status: [],
    language: "id",
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* ===== Fetch ===== */
  const fetchBrowse = async (targetPage: number) => {
    if (!service || loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", String(targetPage));

      appendIfNotEmpty(params, "query", filter.query);
      appendIfNotEmpty(params, "author", filter.author);
      appendIfNotEmpty(params, "artist", filter.artist);
      appendIfNotEmpty(params, "language", filter.language);
      appendIfNotEmpty(params, "year", filter.year);

      filter.genres.forEach(g => params.append("genres", g));
      filter.country.forEach(c => params.append("country", c));
      filter.format.forEach(f => params.append("format", f));
      filter.status.forEach(s => params.append("status", s));

      const res = await shinobuFetch<BrowseMediaResponseWrapper>(
        `/${service.version?.endpoint}/media/browse?${params.toString()}`,
        { baseUrl: service.url, localId: service.id, auth: true }
      );

      const mapped = res.result.map(mapApiToManga);

      setData(prev =>
        targetPage === 1 ? mapped : [...prev, ...mapped]
      );

      // Backend tidak memberi info total → pakai panjang result
      setHasMore(res.result.length > 0);

    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Initial Load / Reset ===== */
  useEffect(() => {
    if (!service) return;

    setData([]);
    setPage(1);
    setHasMore(true);

    fetchBrowse(1);
  }, [service, filter]);

  /* ===== Fetch on Page Change ===== */
  useEffect(() => {
    if (page === 1) return;
    fetchBrowse(page);
  }, [page]);

  /* ===== Infinite Scroll (observer hanya naikkan page) ===== */
  const handleNextPage = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  /* ===== Render ===== */
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-3 mb-4 flex justify-between">
        <h1 className="text-lg font-semibold">Advance Search</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex gap-2 px-3 py-2 rounded bg-[#2a2a2a]"
        >
          <FaMagnifyingGlass /> Filter
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-screen-xl mx-auto px-2">
        {service &&
          data.map(m => (
            <MangaCard key={m.id} manga={m} service={service} />
          ))}

        <div ref={loadMoreRef} className="col-span-full flex justify-center py-6">
          {loading && <span className="text-sm">Memuat data...</span>}
          {error && <span className="text-sm text-red-400">{error}</span>}
          {!hasMore && !loading && (
            <span className="text-xs text-gray-500">Tidak ada data lagi</span>
          )}
        </div>
      </div>

      <AdvanceSearchModal
        open={modalOpen}
        filter={filter}
        onClose={() => setModalOpen(false)}
        onApply={setFilter}
      />
    </>
  );
};

export default Advance;