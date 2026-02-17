// ShinobuDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useShinobu } from "../../../hooks/useShinobu";

import Chapter from "../../../interfaces/Chapter";
import Media from "../../../interfaces/Media";
import MediaExternal from "../../../interfaces/MediaExternal";
import MultiSourceTree from "../../../interfaces/MultiSourceTree";
import Source from "../../../interfaces/Source";
import ChapterContent from "../../../interfaces/ChapterContent";
import Type from "../../../enums/TypeEnum";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useShiNavigate } from "../../utils/shiNavigate";
import useMediaComments from "../../../hooks/useMediaComments";
import { CommentsSection } from "../../../components/CommentSection";

/* ================= Helper ================= */

const normalizeNumber = (v: any, fallback = Infinity) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/* ================= ChapterCard ================= */

const ChapterCard = ({
  chapter,
  type
}: {
  chapter: {
    chapter: Chapter;
    hasContent: boolean;
    contentId?: string | null;
    content: ChapterContent;
    isRead?: boolean
  };
  type: Type;
}) => {
  const { service } = useShinobu();
  const navigate = useShiNavigate(service?.id);

  const previewUrl =
    typeof chapter.content?.content === "string"
      ? chapter.content.content
      : undefined;

  if (!chapter.hasContent || !chapter.content?._id) {
    return (
      <div className="opacity-50 p-2">
        Chapter {chapter.chapter.chapter} (no content)
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        onClick={() =>
          navigate(`/reader/${type.toLowerCase()}/${chapter.content._id}`)
        }
        className={`relative flex flex-row items-center p-2 h-24 gap-2 group
        before:absolute before:z-10 before:left-0 before:top-0 before:min-h-full
        before:rounded-r-full before:transition-all before:duration-500
        hover:shadow active:shadow hover:shadow-[#C667F7] active:shadow-[#C667F7]
        before:w-0 hover:before:w-screen active:before:w-screen
        before:bg-[#C667F7] overflow-hidden rounded-r-xl
        ${chapter?.isRead ? "opacity-50" : ""}`}
      >
        {previewUrl && (
          <div className="relative z-10 w-15 aspect-[3/4]">
            <img
              src={previewUrl}
              className="w-full h-full object-cover"
              alt="preview"
            />
          </div>
        )}

        <div
          className={`flex z-10 flex-col ${type === "NOVEL" ? "absolute left-10" : ""
            }`}
        >
          <span>
            {chapter.chapter.volume
              ? `Volume ${chapter.chapter.volume} `
              : ""}
            Chapter {chapter.chapter.chapter}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ================= ShinobuDetail ================= */

const ShinobuDetail = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const { service } = useShinobu();
  const navigate = useShiNavigate(service?.id);

  const [media, setMedia] = useState<Media | null>(null);
  const [externals, setExternals] = useState<
    {
      source: Source;
      mediaExternal: MediaExternal;
      chapters: {
        chapter: Chapter;
        hasContent: boolean;
        contentId?: string | null;
        content: ChapterContent;
      }[];
    }[]
  >([]);

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= Comment System ================= */

  const {
    comments,
    commentLoading,
    fetchComments,
    fetchReplies,
    createComment,
    replyComment,
  } = useMediaComments({
    mediaId: mediaId!,
    chapterId: null,
    service,
  });

  /* ================= Effects ================= */

  useEffect(() => {
    if (!mediaId || !service) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);

        const res = await shinobuFetch<{
          media: Media;
          tree: MultiSourceTree;
        }>(`/${service.version?.endpoint}/media/${mediaId}`, {
          auth: true,
          baseUrl: service.url,
          localId: service.id,
        });

        setMedia(res.media);
        setExternals(res.tree.externals);

        if (res.tree.externals.length > 0) {
          setSelectedSource(res.tree.externals[0].source.name);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat ShinobuDetail media");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [mediaId, service]);

  useEffect(() => {
    if (!mediaId) return;
    fetchComments();
  }, [mediaId, fetchComments]);

  /* ================= Guards ================= */

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">{error}</div>;
  if (!media) return null;

  const currentExternal = externals.find(
    (e) => e.source.name === selectedSource
  );

  const sortedChapters = currentExternal
    ? [...currentExternal.chapters].sort((a, b) => {
      const volA = normalizeNumber(a.chapter.volume);
      const volB = normalizeNumber(b.chapter.volume);
      if (volA !== volB) return volA - volB;

      const chA = normalizeNumber(a.chapter.chapter);
      const chB = normalizeNumber(b.chapter.chapter);
      return chA - chB;
    })
    : [];

  const groupedByVolume = sortedChapters.reduce((acc, ch) => {
    const key =
      ch.chapter.volume !== null && ch.chapter.volume !== undefined
        ? String(ch.chapter.volume)
        : "misc";

    if (!acc[key]) acc[key] = [];
    acc[key].push(ch);
    return acc;
  }, {} as Record<string, typeof sortedChapters>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen text-white overflow-x-hidden"
    >
      {/* Floating Navigation */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 rounded-full
               bg-black/70 backdrop-blur
               hover:bg-[#C667F7] transition shadow-lg"
        >
          <FaArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        {/* Home */}
        <button
          onClick={() => {
            if (!service) return;
            navigate("/app/home");
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-full
               bg-black/70 backdrop-blur
               hover:bg-[#C667F7] transition shadow-lg"
        >
          <FaHome size={18} />
          <span className="text-sm">Home</span>
        </button>
      </div>

      <div className="w-full flex flex-col md:grid md:grid-cols-2">
        {/* Left Panel */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full aspect-[16/5] relative z-0"
          >
            <img
              className="w-full h-full object-cover"
              src={media?.bannerImage ?? media?.coverImage}
              alt="cover background"
            />
            <div className="absolute inset-0 backdrop-blur-lg" />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-full px-4 -mt-8 flex items-start gap-4 relative z-10"
          >
            <img
              className="aspect-[2/3] w-32 sm:w-40 object-cover bg-gray-300 rounded-md shadow-lg"
              src={media?.coverImage}
              alt={media.title}
            />
            <div className="flex flex-col mt-8 justify-end pb-2">
              <h1 className="text-xl sm:text-2xl font-semibold">
                {media.title}
              </h1>
              <p className="text-sm opacity-70">
                Status: {media.status}
              </p>
              <p className="text-sm">Type: {media.type}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="px-4 py-6 md:px-8 md:py-6 text-sm md:text-base leading-relaxed"
          >
            {media.description}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 0.55 }}
            className="p-2 flex flex-row overflow-x-auto items-center"
          >
            {media.genres.map((gen) => {
              const name = typeof gen === "string" ? gen : gen.name;
              return (
                <div
                  key={name}
                  className="py-2 px-3 border-2 border-[#C667F7] rounded-lg m-1"
                >
                  {name}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="relative w-full overflow-hidden p-4 gap-4">
          {externals.length > 1 && (
            <div className="mb-4">
              <label className="mr-2 font-medium">Pilih Source:</label>
              <select
                className="bg-gray-800 text-white p-1 rounded"
                value={selectedSource ?? ""}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                {externals.map((ext) => (
                  <option
                    key={ext.source.name}
                    value={ext.source.name}
                  >
                    {ext.source.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {Object.entries(groupedByVolume).map(([volume, chapters]) => (
            <div key={volume} className="mb-3">
              <h3 className="font-medium mb-1">
                {volume === "misc"
                  ? "Misc / Tanpa Volume"
                  : `Volume ${volume}`}
              </h3>

              <div className="flex flex-col">
                {chapters.filter(ch => ch.hasContent && ch.content?._id).map((ch) => (
                  <ChapterCard
                    key={ch.content._id}
                    chapter={ch}
                    type={media.type}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* ================= Comments ================= */}
          <CommentsSection
            comments={comments}
            commentLoading={commentLoading}
            replyComment={replyComment}
            createComment={createComment}
            fetchReplies={fetchReplies}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ShinobuDetail;