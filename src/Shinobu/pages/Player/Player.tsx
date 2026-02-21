import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
    HiArrowLeft,
    HiArrowRight,
    HiMenu,
    HiX,
    HiViewList,
} from "react-icons/hi";
import { FaCommentDots } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import VideoPlayer from "../../components/Player";
import IframeVideoPlayer from "../../components/IframePlayer";
import { useShinobu } from "../../hooks/useShinobu";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShiNavigate } from "../../utils/shiNavigate";
import { CommentsSection } from "../../components/CommentSection";
import useMediaComments from "../../hooks/useMediaComments";

import Media from "../../interfaces/Media";
import ChapterContent, { EpisodeSource } from "../../interfaces/ChapterContent";

const normalizeNumber = (v: any, fallback = Infinity) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

const VideoReader = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { service } = useShinobu();
    const navigate = useShiNavigate(service?.id);

    const [media, setMedia] = useState<Media | null>(null);
    const [content, setContent] = useState<ChapterContent | null>(null);
    const [episodes, setEpisodes] = useState<ChapterContent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [sourceIndex, setSourceIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showEpisodePanel, setShowEpisodePanel] = useState(false);
    const [showComments, setShowComments] = useState(false);

    /* ================= FETCH ================= */
    useEffect(() => {
        if (!chapterId || !service) return;

        let canceled = false;

        const fetchEpisode = async () => {
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
                setEpisodes(res.otherChapters ?? []);
                setSourceIndex(0);
            } catch {
                if (!canceled) setError("Failed to load episode.");
            } finally {
                if (!canceled) setLoading(false);
            }
        };

        fetchEpisode();
        return () => {
            canceled = true;
        };
    }, [chapterId, service]);

    /* ================= COMMENTS ================= */
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

    /* ================= Episode Logic ================= */

    const sortedEpisodes = useMemo(() => {
        return [...episodes].sort((a, b) => {
            const chA = normalizeNumber(a.chapter.chapter);
            const chB = normalizeNumber(b.chapter.chapter);
            return chA - chB;
        });
    }, [episodes]);

    const currentIndex = useMemo(() => {
        return sortedEpisodes.findIndex((e) => e._id === content?._id);
    }, [sortedEpisodes, content]);

    const before = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
    const after =
        currentIndex >= 0 && currentIndex < sortedEpisodes.length - 1
            ? sortedEpisodes[currentIndex + 1]
            : null;

    const sources: EpisodeSource[] =
        (content?.content as EpisodeSource[]) ?? [];

    const activeSource = sources[sourceIndex];

    const goEpisode = useCallback(
        (ep: ChapterContent | null) => {
            if (!ep) return;
            navigate(`/player/${ep._id}`);
        },
        [navigate]
    );
    const renderPlayer = () => {
        if (!activeSource) return null;

        if (activeSource.type === "iframe") {
            return (
                <IframeVideoPlayer
                    src={activeSource.url}
                    onPrevEpisode={() => before && navigate(`/player/${before._id}`)}
                    onNextEpisode={() => after && navigate(`/player/${after._id}`)}
                />
            );
        }

        return (
            <VideoPlayer
                src={activeSource.url}
                onPrevEpisode={() => before && navigate(`/player/${before._id}`)}
                onNextEpisode={() => after && navigate(`/player/${after._id}`)}
            />
        );
    };

    if (error)
        return <div className="py-20 text-center text-red-500 text-lg">{error}</div>;

    if (!content) return null;

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
                Loading episode...
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
                {error}
            </div>
        );

    if (!content || !media) return null;

    /* ================= UI ================= */

    return (
        <div className="bg-black text-white min-h-screen overflow-x-hidden">
            {/* ===== HEADER ===== */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        className="fixed top-0 inset-x-0 z-50 
              bg-black/70 backdrop-blur-md border-b border-[#C667F7]/30
              flex justify-between items-center px-4 py-3"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => navigate(`/detail/${media._id}`)}
                                className="p-2 rounded-full bg-black/50 hover:bg-[#C667F7] transition"
                            >
                                <HiArrowLeft />
                            </button>

                            <div className="truncate">
                                <div className="text-sm font-semibold truncate">
                                    {media.title}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Episode {content.chapter.chapter}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowComments(true)}
                            className="p-2 rounded-full bg-black/50 hover:bg-[#C667F7] transition"
                        >
                            <FaCommentDots />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== PLAYER ===== */}
            <div className="pt-16 relative">{renderPlayer()}</div>

            {/* ===== SOURCE SELECTOR ===== */}
            {sources.length > 1 && (
                <div className="px-6 py-4">
                    <div className="text-xs text-gray-400 mb-2">Server</div>
                    <div className="flex gap-2 flex-wrap">
                        {sources.map((s, i) => (
                            <button
                                key={s.server}
                                onClick={() => setSourceIndex(i)}
                                className={`px-4 py-2 rounded-lg border transition
                  ${i === sourceIndex
                                        ? "bg-[#C667F7] border-[#C667F7] text-white"
                                        : "bg-black/40 border-white/20 hover:bg-[#C667F7]/20"
                                    }`}
                            >
                                {s.server}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ================= CONTENT BELOW PLAYER ================= */}
            <div className="px-6 py-8 space-y-8">

                {/* ===== Episode Info Card ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-md 
               border border-[#C667F7]/30 
               rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Episode {content.chapter.chapter}
                    </h2>

                    {content.chapter.title && (
                        <p className="text-sm text-gray-300 mb-3">
                            {content.chapter.title}
                        </p>
                    )}

                    {media.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {media.description}
                        </p>
                    )}
                </motion.div>


                {/* ===== Quick Navigation ===== */}
                <div className="flex items-center justify-between 
                  bg-black/40 backdrop-blur-md
                  border border-[#C667F7]/30 
                  rounded-xl p-4">

                    <button
                        disabled={!before}
                        onClick={() => goEpisode(before)}
                        className="px-4 py-2 rounded-lg border border-[#C667F7] 
                 disabled:opacity-40 hover:bg-[#C667F7] transition"
                    >
                        ← Previous
                    </button>

                    <div className="text-sm text-gray-400">
                        Episode {currentIndex + 1} / {sortedEpisodes.length}
                    </div>

                    <button
                        disabled={!after}
                        onClick={() => goEpisode(after)}
                        className="px-4 py-2 rounded-lg border border-[#C667F7] 
                 disabled:opacity-40 hover:bg-[#C667F7] transition"
                    >
                        Next →
                    </button>
                </div>


                {/* ===== Horizontal Episode Strip ===== */}
                <div>
                    <h3 className="text-sm text-gray-400 mb-3">More Episodes</h3>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {sortedEpisodes.map((e, i) => (
                            <button
                                key={e._id}
                                onClick={() => goEpisode(e)}
                                className={`min-w-[60px] h-14 flex items-center justify-center
            rounded-lg border transition text-sm
            ${i === currentIndex
                                        ? "bg-[#C667F7] border-[#C667F7] text-white"
                                        : "bg-black/50 border-white/20 hover:border-[#C667F7]"
                                    }`}
                            >
                                {e.chapter.chapter}
                            </button>
                        ))}
                    </div>
                </div>


                {/* ===== Comments Inline ===== */}
                <div className="bg-black/40 backdrop-blur-md 
                  border border-[#C667F7]/30 
                  rounded-xl p-6">
                    <CommentsSection
                        comments={comments}
                        commentLoading={commentLoading}
                        replyComment={replyComment}
                        createComment={createComment}
                        fetchReplies={fetchReplies}
                    />
                </div>

            </div>

            {/* ===== ACTION FLOATING BAR ===== */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 
              bg-black/70 backdrop-blur-md border border-[#C667F7]/30
              rounded-full px-6 py-3 flex gap-6 z-50"
                    >
                        <button
                            disabled={!before}
                            onClick={() => goEpisode(before)}
                            className="disabled:opacity-30 hover:text-[#C667F7]"
                        >
                            <HiArrowLeft />
                        </button>

                        <button
                            onClick={() => setShowEpisodePanel(true)}
                            className="hover:text-[#C667F7]"
                        >
                            <HiViewList />
                        </button>

                        <button
                            onClick={() => setShowControls(false)}
                            className="text-red-400"
                        >
                            <HiX />
                        </button>

                        <button
                            disabled={!after}
                            onClick={() => goEpisode(after)}
                            className="disabled:opacity-30 hover:text-[#C667F7]"
                        >
                            <HiArrowRight />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showControls && (
                <button
                    onClick={() => setShowControls(true)}
                    className="fixed bottom-4 right-4 p-3 rounded-full 
            bg-[#C667F7] shadow-lg z-50"
                >
                    <HiMenu />
                </button>
            )}

            {/* ===== EPISODE PANEL ===== */}
            <AnimatePresence>
                {showEpisodePanel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex"
                    >
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setShowEpisodePanel(false)}
                        />

                        <motion.div
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            className="ml-auto w-80 bg-black border-l border-[#C667F7]/30"
                        >
                            <div className="p-4 border-b border-[#C667F7]/30 flex justify-between">
                                <span>Episodes</span>
                                <button onClick={() => setShowEpisodePanel(false)}>
                                    <HiX />
                                </button>
                            </div>

                            <div className="overflow-y-auto max-h-[80vh]">
                                {sortedEpisodes.map((e, i) => (
                                    <button
                                        key={e._id}
                                        onClick={() => {
                                            goEpisode(e);
                                            setShowEpisodePanel(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 transition
                      ${i === currentIndex
                                                ? "bg-[#C667F7] text-white"
                                                : "hover:bg-white/10"
                                            }`}
                                    >
                                        Episode {e.chapter.chapter}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== COMMENTS PANEL ===== */}
            {showComments &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex justify-end"
                >
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowComments(false)}
                    />
                    <div className="w-full sm:w-96 bg-black border-l border-white/10 p-4 shadow-xl z-[1000]">
                        <CommentsSection
                            comments={comments}
                            commentLoading={commentLoading}
                            replyComment={replyComment}
                            createComment={createComment}
                            fetchReplies={fetchReplies}
                        />
                    </div>
                </motion.div>
            }
        </div>
    );
};

export default VideoReader;