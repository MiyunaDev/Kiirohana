import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  HiArrowLeft,
  HiArrowRight,
  HiMenu,
  HiX,
  HiViewList,
} from "react-icons/hi";
import { FaCommentDots } from "react-icons/fa";

import LazyImage from "../../components/LazyImage";
import { CommentsSection } from "../../components/CommentSection";

import { useShinobu } from "../../hooks/useShinobu";
import useMediaComments from "../../hooks/useMediaComments";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShiNavigate } from "../../utils/shiNavigate";

import Media from "../../interfaces/Media";
import ChapterContent from "../../interfaces/ChapterContent";

/* ================= Helper ================= */

const normalizeNumber = (v: any, fallback = Infinity) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

type LoadedChapter = {
  chapterId: string;
  data: ChapterContent;
};

/* ================= Chapter Block ================= */

const ChapterBlock = ({
  chapter,
  onEnter,
  onNearEnd,
}: {
  chapter: ChapterContent;
  onEnter: () => void;
  onNearEnd: () => void;
}) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && onEnter(),
      { threshold: 0.6 }
    );
    if (topRef.current) obs.observe(topRef.current);
    return () => obs.disconnect();
  }, [onEnter]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && onNearEnd(),
      { rootMargin: "400px" }
    );
    if (bottomRef.current) obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [onNearEnd]);

  return (
    <div className="chapter-block">
      <div ref={topRef} />

      <div className="py-6 text-center text-xs text-gray-500">
        {chapter.chapter.volume && `Volume ${chapter.chapter.volume} `}
        Chapter {chapter.chapter.chapter}
      </div>

      {chapter.content?.map((ct, i) => {
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

      <div ref={bottomRef} />
    </div>
  );
};

/* ================= Main ================= */

const ComicReader = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { service } = useShinobu();
  const navigate = useShiNavigate(service?.id);

  const [media, setMedia] = useState<Media | null>(null);
  const [chapters, setChapters] = useState<ChapterContent[]>([]);

  const [loadedChapters, setLoadedChapters] = useState<LoadedChapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showActionBar, setShowActionBar] = useState(true);
  const [showChapterPanel, setShowChapterPanel] = useState(false);
  const [showCommentsFloating, setShowCommentsFloating] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");

  /* ================= Fetch Chapter ================= */

  const fetchChapterById = async (id: string): Promise<ChapterContent> => {
    if (!service) throw new Error("Service not ready");

    const res = await shinobuFetch<{
      media: Media;
      content: ChapterContent;
      otherChapters: ChapterContent[];
    }>(`/${service.version?.endpoint}/media/content/${id}`, {
      auth: true,
      baseUrl: service.url,
      localId: service.id,
    });

    setMedia(res.media);
    setChapters(res.otherChapters ?? []);
    return res.content;
  };

  /* ================= Sort Chapters ================= */

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

  /* ================= Initial Load ================= */

  useEffect(() => {
    if (!chapterId || !service) return;

    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        const current = await fetchChapterById(chapterId);
        if (cancelled) return;

        setLoadedChapters([{ chapterId, data: current }]);
        setActiveChapterId(chapterId);
        window.scrollTo({ top: 0 });
      } catch {
        if (!cancelled) setError("Failed to load chapter");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [chapterId, service]);

  /* ================= Infinite Loader ================= */

  const loadNextChapter = async (currentId: string) => {
    const idx = sortedChapters.findIndex((c) => c._id === currentId);
    const next = sortedChapters[idx + 1];
    if (!next) return;

    const exists = loadedChapters.some((c) => c.chapterId === next._id);
    if (exists) return;

    const data = await fetchChapterById(next._id);
    setLoadedChapters((prev) => [...prev, { chapterId: next._id, data }]);
  };

  const onChapterEnter = (id: string) => {
    setActiveChapterId(id);
    navigate(`/reader/comic/${id}`, { replace: true });
  };

  /* ================= Active Chapter ================= */

  const activeChapter = useMemo(
    () =>
      loadedChapters.find((c) => c.chapterId === activeChapterId)?.data ??
      null,
    [loadedChapters, activeChapterId]
  );

  /* ================= Prev / Next ================= */

  const currentIndex = useMemo(() => {
    if (!activeChapterId) return -1;
    return sortedChapters.findIndex((c) => c._id === activeChapterId);
  }, [activeChapterId, sortedChapters]);

  const before =
    currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const after =
    currentIndex >= 0 && currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]
      : null;

  /* ================= Comments ================= */

  const {
    comments,
    commentLoading,
    fetchComments,
    fetchReplies,
    createComment,
    replyComment,
  } = useMediaComments({
    mediaId: media?._id!,
    chapterId: activeChapter?.chapter._id,
    service,
  });

  useEffect(() => {
    if (media?._id && activeChapter?.chapter._id) fetchComments();
  }, [media?._id, activeChapter?.chapter._id]);

  /* ================= Render ================= */

  if (loading)
    return <div className="py-10 text-center text-gray-400">Loading…</div>;

  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      {/* ===== HEADER ===== */}
      {showActionBar && activeChapter && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(`/detail/${media?._id}`)}
              className="p-2 bg-gray-800 rounded-full"
            >
              <HiArrowLeft size={18} />
            </button>

            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">
                {media?.title}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {activeChapter.chapter.volume &&
                  `Volume ${activeChapter.chapter.volume} `}
                Chapter {activeChapter.chapter.chapter}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCommentsFloating((v) => !v)}
            className="p-2 bg-gray-800 rounded-full"
          >
            <FaCommentDots size={18} />
          </button>
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div className="pt-16">
        {loadedChapters.map((ch) => (
          <ChapterBlock
            key={ch.chapterId}
            chapter={ch.data}
            onEnter={() => onChapterEnter(ch.chapterId)}
            onNearEnd={() => loadNextChapter(ch.chapterId)}
          />
        ))}
      </div>

      {/* ===== ACTION BAR ===== */}
      {showActionBar && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur rounded-xl shadow-xl flex items-center gap-4 px-5 py-3 z-50">
          <button
            disabled={!before}
            onClick={() => before && navigate(`/reader/comic/${before._id}`)}
            className="p-2 bg-gray-800 rounded-full disabled:opacity-40"
          >
            <HiArrowLeft size={20} />
          </button>

          <button
            disabled={!after}
            onClick={() => after && navigate(`/reader/comic/${after._id}`)}
            className="p-2 bg-gray-800 rounded-full disabled:opacity-40"
          >
            <HiArrowRight size={20} />
          </button>

          <button
            onClick={() => setShowChapterPanel(true)}
            className="p-2 bg-gray-800 rounded-full"
          >
            <HiViewList size={20} />
          </button>

          <button
            onClick={() => setShowActionBar(false)}
            className="p-2 bg-gray-800 rounded-full"
          >
            <HiX size={20} />
          </button>
        </div>
      )}

      {!showActionBar && (
        <button
          onClick={() => setShowActionBar(true)}
          className="fixed bottom-4 right-4 p-3 bg-blue-500 rounded-full z-50"
        >
          <HiMenu size={22} />
        </button>
      )}

      {/* ===== CHAPTER PANEL ===== */}
      {showChapterPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowChapterPanel(false)}
          />

          <div className="ml-auto relative w-full sm:w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <span className="font-semibold text-lg">Chapters</span>
              <button onClick={() => setShowChapterPanel(false)}>
                <HiX size={24} />
              </button>
            </div>

            <div className="p-3 border-b border-gray-800">
              <input
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                placeholder="Cari chapter..."
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {sortedChapters
                .filter((ch) => {
                  if (!chapterSearch) return true;
                  const title =
                    ch.title ??
                    `${ch.chapter.volume ? `Vol ${ch.chapter.volume} ` : ""}Ch ${
                      ch.chapter.chapter
                    }`;
                  return title
                    .toLowerCase()
                    .includes(chapterSearch.toLowerCase());
                })
                .map((ch, idx) => (
                  <button
                    key={ch._id}
                    onClick={() => {
                      navigate(`/reader/comic/${ch._id}`);
                      setShowChapterPanel(false);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-gray-800 ${
                      idx === currentIndex
                        ? "bg-[#C667F7] text-white"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    {ch.title ??
                      `${ch.chapter.volume ? `Vol ${ch.chapter.volume} ` : ""}Ch ${
                        ch.chapter.chapter
                      }`}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== COMMENTS ===== */}
      {showCommentsFloating && media && activeChapter && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCommentsFloating(false)}
          />
          <div className="relative w-full sm:w-96 bg-gray-900 p-4 overflow-y-auto">
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
    </div>
  );
};

export default ComicReader;