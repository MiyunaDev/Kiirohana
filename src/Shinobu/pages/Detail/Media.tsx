// ShinobuDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShinobu } from "../../hooks/useShinobu";

import Chapter from "../../interfaces/Chapter";
import Media from "../../interfaces/Media";
import MediaExternal from "../../interfaces/MediaExternal";
import MultiSourceTree from "../../interfaces/MultiSourceTree";
import Source from "../../interfaces/Source";
import ChapterContent from "../../interfaces/ChapterContent";
import Type from "../../enums/TypeEnum";
import { FaArrowLeft, FaHome, FaBookmark, FaPlus, FaTimes } from "react-icons/fa";
import { useShiNavigate } from "../../utils/shiNavigate";
import useMediaComments from "../../hooks/useMediaComments";
import { CommentsSection } from "../../components/CommentSection";


/* ================= Helper ================= */

const normalizeNumber = (v: any, fallback = Infinity) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

interface Collection {
  _id: string;
  name: string;
  media: string[]
}

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
        {!["ANIME", "TV", "MOVIE"].includes(type) && chapter.chapter.volume && (
          <>Volume {chapter.chapter.volume} </>
        )}
        {["ANIME", "TV", "MOVIE"].includes(type)
          ? `Episode ${chapter.chapter.chapter}`
          : `Chapter ${chapter.chapter.chapter}`}
        (no content)
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
        onClick={() => {
          if (["ANIME", "TV", "MOVIE"].includes(type)) {
            navigate(`/player/${chapter.content._id}`);
          } else {
            navigate(`/reader/${type.toLowerCase()}/${chapter.content._id}`);
          }
        }}
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
            {!["ANIME", "TV", "MOVIE"].includes(type) && chapter.chapter.volume && (
              <>Volume {chapter.chapter.volume} </>
            )}
            {["ANIME", "TV", "MOVIE"].includes(type)
              ? `Episode ${chapter.chapter.chapter}`
              : `Chapter ${chapter.chapter.chapter}`}
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

  /* ================= UserCollection ================= */

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


  /* ================= Guards ================= */

  const currentExternal = externals.find(
    (e) => e.source.code === selectedSource
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

  // Bookmark
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkLoading, setBookmarkLoading] = useState<boolean>(false);


  // Show/hide modal/floating panel untuk collection
  const [showCollectionModal, setShowCollectionModal] = useState<boolean>(false);

  // Nama collection baru (input)
  const [newCollectionName, setNewCollectionName] = useState<string>("");

  // Pilihan collection (jika kita ingin select default saat menambahkan)
  const [collections, setCollections] = useState<Collection[]>([])
  const [_, setSelectedCollection] = useState<string | null>(null);

  // Optional: loading/error state
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  const fetchBookmarkStatus = async () => {
    if (!service || !mediaId) return;

    try {
      const res = await shinobuFetch<{ media: Media; _id: string }[]>(`/${service.version?.endpoint}/bookmarks`, {
        auth: true,
        baseUrl: service.url,
        localId: service.id,
      });

      const exists = res.some(b => b.media._id === mediaId);
      setIsBookmarked(exists);
    } catch (err) {
      console.error("Gagal fetch bookmark", err);
    }
  };


  // Function create collection baru
  const createNewCollection = async () => {
    if (!service || !newCollectionName) return;
    try {
      setCollectionLoading(true);

      await shinobuFetch<Collection>(`/${service.version?.endpoint}/collections`, {
        method: "POST",
        auth: true,
        baseUrl: service.url,
        localId: service.id,
        body: {
          name: newCollectionName,
          media: [],                 // awalnya kosong
        },
      });

      // Refresh collections & select baru dibuat
      fetchCollections();
      setNewCollectionName(""); // reset input
    } catch (err) {
      console.error(err);
      setCollectionError("Gagal membuat koleksi baru");
    } finally {
      setCollectionLoading(false);
    }
  };


  /* ================= Fetch User Collections ================= */
  const fetchCollections = async () => {
    if (!service) return;
    try {
      setCollectionLoading(true);
      const res = await shinobuFetch<Collection[]>(`/${service.version?.endpoint}/collections`, {
        auth: true,
        baseUrl: service.url,
        localId: service.id,
      });
      setCollections(res);
      if (res.length > 0) setSelectedCollection(res[0]._id);
    } catch (err) {
      console.error(err);
      setCollectionError("Gagal memuat koleksi");
    } finally {
      setCollectionLoading(false);
    }
  };

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
          setSelectedSource(res.tree.externals[0].source.code);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat ShinobuDetail media");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    fetchCollections();
    fetchBookmarkStatus();

  }, [mediaId, service]);

  const toggleCollection = async (collectionId: string) => {
    if (!service || !media?._id) return;

    const collectionIndex = collections.findIndex(c => c._id === collectionId);
    if (collectionIndex === -1) return;

    const collection = collections[collectionIndex];

    // pastikan media array hanya berisi string ID
    const mediaIds = collection.media.map((m: any) => (typeof m === "string" ? m : m._id));

    const isInCollection = mediaIds.includes(media._id);

    // Update local state dulu
    const updatedCollections = [...collections];
    updatedCollections[collectionIndex] = {
      ...collection,
      media: isInCollection
        ? mediaIds.filter(id => id !== media._id) // hapus
        : [...mediaIds, media._id],              // tambah
    };
    setCollections(updatedCollections);

    // Kirim ke backend
    try {
      setCollectionLoading(true);
      await shinobuFetch(`/${service.version?.endpoint}/collections/${collectionId}`, {
        method: "PUT",
        auth: true,
        baseUrl: service.url,
        localId: service.id,
        body: { media: updatedCollections[collectionIndex].media },
      });
    } catch (err) {
      console.error(err);
      setCollectionError("Gagal mengubah collection");
      // rollback state
      setCollections(collections);
    } finally {
      setCollectionLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!service || !mediaId) return;

    setBookmarkLoading(true);

    try {
      if (isBookmarked) {
        // Hapus bookmark
        await shinobuFetch(`/${service.version?.endpoint}/bookmarks/${mediaId}`, {
          method: "DELETE",
          auth: true,
          baseUrl: service.url,
          localId: service.id,
        });
        setIsBookmarked(false);
      } else {
        // Tambah bookmark
        await shinobuFetch(`/${service.version?.endpoint}/bookmarks`, {
          method: "POST",
          auth: true,
          baseUrl: service.url,
          localId: service.id,
          body: { media: mediaId },
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Gagal toggle bookmark", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  useEffect(() => {
    if (!mediaId) return;
    fetchComments();
  }, [mediaId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">{error}</div>;
  if (!media) return null;

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



          {/* ================= Floating Collection / Bookmark Buttons ================= */}
          <div className="grid grid-cols-2 gap-3 m-4">
            {/* Tombol Bookmark */}
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-2 justify-center text-sm p-3 rounded-full shadow-md border-2 transition
    border-[#C667F7] ${isBookmarked ? "bg-[#C667F7] text-white" : "text-[#C667F7] hover:bg-[#C667F7] hover:text-white"}
    ${bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FaBookmark className="h-5 w-5" />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            {/* Tombol Collection */}
            <button
              onClick={() => setShowCollectionModal(true)}
              className={`flex items-center gap-3 justify-center text-sm p-3 rounded-full shadow-md border-2 transition
  border-[#C667F7] text-[#C667F7] hover:bg-[#C667F7] hover:text-white
  ${collections.some(c => c.media.some(
                (m: any) => (typeof m === "string" ? m : m._id.toString()) === media?._id
              )) ? "bg-[#C667F7] text-white" : ""}
`}
            >
              <FaPlus className="h-5 w-5" />
              <p>Add to Collection</p>
            </button>
          </div>

          {/* ================= Modal / Floating Panel untuk Collections ================= */}
          {showCollectionModal && (
            <div className="absolute z-50 top-16 left-0 w-full sm:w-80 p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-[#C667F7]">Pilih Koleksi</h3>
                <button
                  onClick={() => setShowCollectionModal(false)}
                  className="text-gray-400 hover:text-white transition"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>

              {collectionError && (
                <p className="text-red-500 text-sm mb-2">{collectionError}</p>
              )}

              <div className="grid grid-cols-2 gap-2 mb-3">
                {collections.map((c) => {
                  const isInCollection = c.media.some(
                    (m: any) => (typeof m === "string" ? m : m._id.toString()) === media?._id
                  );

                  return (
                    <button
                      key={c._id}
                      onClick={() => toggleCollection(c._id)}
                      disabled={collectionLoading}
                      className={`
        flex items-center justify-center p-2 rounded-lg shadow-sm text-sm font-medium transition
        ${isInCollection
                          ? "bg-[#C667F7] text-white"
                          : "bg-gray-800 text-gray-200 border border-[#C667F7] hover:bg-[#C667F7] hover:text-white"
                        }
        ${collectionLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
                    >
                      {c.name}
                    </button>
                  );
                })}

              </div>

              {/* Input untuk buat collection baru */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama koleksi baru"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-sm focus:ring-2 focus:ring-green-500 transition"
                />
                <button
                  onClick={async () => {
                    await createNewCollection();
                    setNewCollectionName("");
                  }}
                  disabled={collectionLoading || !newCollectionName.trim()}
                  className={`
          bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm transition
          ${collectionLoading || !newCollectionName.trim() ? "opacity-50 cursor-not-allowed" : ""}
        `}
                >
                  Buat
                </button>
              </div>

              {collectionLoading && (
                <p className="text-gray-400 text-sm mt-2">Sedang memuat...</p>
              )}
            </div>
          )}



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
          <div className="flex flex-row mb-4 overflow-x-scroll">
            {externals.map((ext) => (
              <div
                className={`relative flex flex-row gap-2 p-2 rounded-md ${selectedSource === ext.source.code ? "bg-[#C667F7]" : ""} ${ext.source.disable ? "opacity-70" : ""}`}
                onClick={() => setSelectedSource(ext.source.code)}
              >
                <img
                  className="aspect-[2/3] w-18 object-cover bg-gray-300 rounded-md shadow-lg"
                  src={ext.mediaExternal?.coverImage}
                  alt={ext.mediaExternal.title}
                />
                <div className="flex flex-col">
                  <a className="text-lg font-bold">{ext.mediaExternal.title}</a>
                  <a>{ext.source.code}</a>
                </div>
                {ext.source?.disable && (
                  <span className="absolute p-2 bg-red bottom-0 right-0 text-sm">Disable</span>
                )}
              </div>
            ))}
          </div>

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