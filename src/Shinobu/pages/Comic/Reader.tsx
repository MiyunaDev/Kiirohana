import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  HiArrowLeft,
  HiArrowRight,
  HiMenu,
  HiX,
  HiViewList,
} from "react-icons/hi";

import LazyImage from "../../../components/LazyImage";
import { useShinobu } from "../../../hooks/useShinobu";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useShiNavigate } from "../../utils/shiNavigate";

import Media from "../../../interfaces/Media";
import ChapterContent from "../../../interfaces/ChapterContent";

const ComicReader = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { service } = useShinobu();
  const navigate = useShiNavigate(service?.id);

  const [media, setMedia] = useState<Media | null>(null);
  const [content, setContent] = useState<ChapterContent | null>(null);
  const [chapters, setChapters] = useState<ChapterContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showActionBar, setShowActionBar] = useState(true);
  const [showChapterPanel, setShowChapterPanel] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!chapterId || !service) return;

    let canceled = false;

    const fetchChapter = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await shinobuFetch<{
          media: Media;
          content: ChapterContent;
          otherChapters: ChapterContent[];
        }>(`/${service.version?.endpoint}/media/content/${chapterId}`, {
          auth: true,
          baseUrl: service.url,
          localId: service.id,
        });

        if (canceled) return;

        setMedia(res.media);
        setContent(res.content);
        setChapters(res.otherChapters ?? []);
        window.scrollTo({ top: 0 });
      } catch {
        if (!canceled) setError("Failed to load chapter.");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchChapter();
    return () => {
      canceled = true;
    };
  }, [chapterId, service]);

  /* ================= SCROLL PROGRESS ================= */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;

      setScrollProgress(
        Math.min(100, Math.max(0, (window.scrollY / total) * 100))
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= CHAPTER COMPUTATION ================= */
  const currentIndex = useMemo(() => {
    if (!content) return -1;
    return chapters.findIndex((ch) => ch._id === content._id);
  }, [chapters, content]);

  const before = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const after =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;

  const allChapters = chapters;

  /* ================= STATES ================= */
  if (loading)
    return <div className="py-10 text-center text-gray-400">Loading…</div>;

  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  if (!content) return null;

  /* ================= RENDER ================= */
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      {/* ===== HEADER ===== */}
      {showActionBar && (
        <div
          className="fixed top-0 left-0 right-0 z-50
          bg-gray-900/90 backdrop-blur
          border-b border-gray-800
          flex items-center gap-3 px-4 py-3"
        >
          <button
            onClick={() => navigate(`/detail/${media?._id}`)}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <HiArrowLeft size={18} />
          </button>

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">
              {content.title ?? "Untitled"}
            </span>
            <span className="text-xs text-gray-400">
              Chapter {currentIndex + 1}
            </span>
          </div>
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div className="pt-16">
        {content.content?.map((ct, i) => {
          const src = typeof ct === "string" ? ct : undefined;

          return (
            <LazyImage
              key={i}
              src={src}
              alt={`Page ${i + 1}`}
              className="w-full h-auto"
            />
          );
        })}
      </div>

      {/* ===== ACTION BAR ===== */}
      {showActionBar && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2
          bg-gray-800/90 backdrop-blur
          rounded-xl shadow-xl
          flex items-center gap-4 px-5 py-3 z-50"
        >
          <button
            disabled={!before}
            onClick={() =>
              before && navigate(`/reader/comic/${before._id}`)
            }
            className="p-2 bg-gray-700 rounded-full disabled:opacity-40"
          >
            <HiArrowLeft />
          </button>

          <div className="w-24 text-center">
            <div className="text-xs mb-1">
              {Math.round(scrollProgress)}%
            </div>
            <div className="h-2 bg-gray-600 rounded overflow-hidden">
              <div
                className="h-2 bg-blue-400 transition-all"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          <button
            disabled={!after}
            onClick={() =>
              after && navigate(`/reader/comic/${after._id}`)
            }
            className="p-2 bg-gray-700 rounded-full disabled:opacity-40"
          >
            <HiArrowRight />
          </button>

          <button
            onClick={() => setShowChapterPanel(true)}
            className="p-2 bg-gray-700 rounded-full"
          >
            <HiViewList />
          </button>

          <button
            onClick={() => setShowActionBar(false)}
            className="p-2 bg-gray-700 rounded-full"
          >
            <HiX />
          </button>
        </div>
      )}

      {/* ===== SHOW BUTTON ===== */}
      {!showActionBar && (
        <button
          onClick={() => setShowActionBar(true)}
          className="fixed bottom-4 right-4
            p-3 bg-blue-500
            rounded-full shadow-lg z-50"
        >
          <HiMenu size={22} />
        </button>
      )}

      {/* ===== CHAPTER PANEL ===== */}
      {showChapterPanel && (
        <div
          className="fixed inset-y-0 right-0 w-full sm:w-64
          bg-gray-900 border-l border-gray-800 z-50"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <span className="font-semibold">Chapters</span>
            <button onClick={() => setShowChapterPanel(false)}>
              <HiX size={20} />
            </button>
          </div>

          <div className="overflow-y-auto">
            {allChapters.map((ch, idx) => (
              <button
                key={ch._id}
                onClick={() => {
                  navigate(`/reader/comic/${ch._id}`);
                  setShowChapterPanel(false);
                }}
                className={`w-full text-left px-4 py-3 border-b border-gray-800
                  ${
                    idx === currentIndex
                      ? "bg-blue-700 text-white"
                      : "hover:bg-gray-800"
                  }`}
              >
                {ch.title ?? `Chapter ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicReader;