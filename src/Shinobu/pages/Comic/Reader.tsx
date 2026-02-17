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
import { FaCommentDots } from "react-icons/fa";
import { CommentsSection } from "../../../components/CommentSection";
import useMediaComments from "../../../hooks/useMediaComments";

/* ================= Helper ================= */

const normalizeNumber = (v: any, fallback = Infinity) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};


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
  const [showCommentsFloating, setShowCommentsFloating] = useState(false);

  const [chapterSearch, setChapterSearch] = useState("")

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

  const {
    comments,
    commentLoading,
    fetchComments,
    fetchReplies,
    createComment,
    replyComment,
  } = useMediaComments({
    mediaId: media?._id!,
    chapterId: content?.chapter._id,
    service,
  });

  useEffect(() => {
    if (!media?._id && !content?.chapter._id) return;
    fetchComments();
  }, [media?._id, content?.chapter._id, fetchComments]);

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

  /* ================= SORT & CHAPTER COMPUTATION (FIXED) ================= */

  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => {
      const volA = normalizeNumber(a.chapter.volume, Infinity);
      const volB = normalizeNumber(b.chapter.volume, Infinity);
      if (volA !== volB) return volA - volB;

      const chA = normalizeNumber(a.chapter.chapter, Infinity);
      const chB = normalizeNumber(b.chapter.chapter, Infinity);
      return chA - chB;
    });
  }, [chapters]);

  const currentIndex = useMemo(() => {
    if (!content) return -1;
    return sortedChapters.findIndex((ch) => ch._id === content._id);
  }, [sortedChapters, content]);

  const before =
    currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;

  const after =
    currentIndex >= 0 && currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]
      : null;

  const allChapters = sortedChapters;

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
        <div className="fixed top-0 left-0 right-0 z-50
    bg-gray-900/90 backdrop-blur
    border-b border-gray-800
    flex items-center justify-between px-4 py-3">

          {/* LEFT SIDE: BACK BUTTON + TITLE */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(`/detail/${media?._id}`)}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 flex-shrink-0"
            >
              <HiArrowLeft size={18} />
            </button>

            {/* TITLE */}
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-sm font-semibold truncate">{media?.title ?? "Untitled"}</span>
              <span className="text-xs text-gray-400 truncate">
                {content.chapter.volume ? `Volume ${content.chapter.volume} ` : ""}
                Chapter {content.chapter.chapter}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: COMMENT ICON */}
          <button
            onClick={() => setShowCommentsFloating((v) => !v)}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 flex-shrink-0 ml-2"
          >
            <FaCommentDots size={18} />
          </button>
        </div>
      )}

      {/* ===== FLOATING COMMENTS ===== */}
      {showCommentsFloating && media?._id && content.chapter && service && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCommentsFloating(false)}
          />

          {/* WINDOW COMMENTS */}
          <div className="relative w-full sm:w-96 bg-gray-900 border-l border-gray-800 shadow-lg p-4 overflow-y-auto max-h-full">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Komentar</span>
              <button
                onClick={() => setShowCommentsFloating(false)}
                className="p-1 hover:bg-gray-800 rounded-full"
              >
                <HiX size={20} />
              </button>
            </div>

            <CommentsSection
              comments={comments}
              commentLoading={commentLoading}
              replyComment={replyComment}
              createComment={createComment}
              fetchReplies={fetchReplies}
            />
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
      </div>

      {/* ===== ACTION BAR ===== */}
      {showActionBar && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2
      bg-gray-900/80 backdrop-blur-md
      rounded-xl shadow-xl
      flex items-center gap-4 px-5 py-3 z-50"
        >
          {/* Previous Chapter */}
          <button
            disabled={!before}
            onClick={() => before && navigate(`/reader/comic/${before._id}`)}
            className="p-2 bg-gray-800 rounded-full hover:bg-[#C667F7] text-gray-200 disabled:opacity-40 transition"
            title="Previous Chapter"
          >
            <HiArrowLeft size={20} />
          </button>

          {/* Progress */}
          <div className="w-28 flex flex-col items-center text-center">
            <div className="text-xs text-gray-300 mb-1">{Math.round(scrollProgress)}%</div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-2 bg-[#C667F7] transition-all"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Next Chapter */}
          <button
            disabled={!after}
            onClick={() => after && navigate(`/reader/comic/${after._id}`)}
            className="p-2 bg-gray-800 rounded-full hover:bg-[#C667F7] text-gray-200 disabled:opacity-40 transition"
            title="Next Chapter"
          >
            <HiArrowRight size={20} />
          </button>

          {/* Chapter Panel */}
          <button
            onClick={() => setShowChapterPanel(true)}
            className="p-2 bg-gray-800 rounded-full hover:bg-[#C667F7] text-gray-200 transition"
            title="Chapters List"
          >
            <HiViewList size={20} />
          </button>

          {/* Close Action Bar */}
          <button
            onClick={() => setShowActionBar(false)}
            className="p-2 bg-gray-800 rounded-full hover:bg-red-600 text-gray-200 transition"
            title="Close"
          >
            <HiX size={20} />
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
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowChapterPanel(false)}
          />

          {/* Panel */}
          <div className="ml-auto relative w-full sm:w-80 max-w-xs bg-gray-900 border-l border-gray-800 shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <span className="font-semibold text-lg">Chapters</span>
              <button
                onClick={() => setShowChapterPanel(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-800">
              <input
                type="text"
                placeholder="Cari chapter..."
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#C667F7] transition"
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
              />
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto max-h-screen">
              {allChapters
                .filter((ch) => {
                  if (!chapterSearch) return true;
                  const title = ch.title ?? `${ch.chapter.volume ? `Vol ${ch.chapter.volume} ` : ""}Ch ${ch.chapter.chapter}`;
                  return title.toLowerCase().includes(chapterSearch.toLowerCase());
                })
                .map((ch, idx) => (
                  <button
                    key={ch._id}
                    onClick={() => {
                      navigate(`/reader/comic/${ch._id}`);
                      setShowChapterPanel(false);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-gray-800 transition
                ${idx === currentIndex
                        ? "bg-[#C667F7] text-white font-medium"
                        : "hover:bg-gray-800 text-gray-200"
                      }`}
                  >
                    {ch.title ??
                      `${ch.chapter.volume ? `Vol ${ch.chapter.volume} ` : ""}Ch ${ch.chapter.chapter}`
                    }
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicReader;