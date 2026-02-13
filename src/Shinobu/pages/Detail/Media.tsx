// ShinobuDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { shinobuFetch } from "../../../utils/fetchShinobu";
import { useShinobu } from "../../../hooks/useShinobu";
import { Chapter } from "../../../types/Series";
import Media from "../../../interfaces/Media";
import MediaExternal from "../../../interfaces/MediaExternal";
import MultiSourceTree from "../../../interfaces/MultiSourceTree";
import Source from "../../../interfaces/Source";
import ChapterContent from "../../../interfaces/ChapterContent";
import Type from "../../../enums/TypeEnum";

const ChapterCard = ({
  chapter,
  type
}: {
  chapter: {
    chapter: Chapter
    hasContent: boolean
    contentId?: string | null
    content: ChapterContent
  },
  type: Type,
}) => {
  const { service } = useShinobu()

  const previewUrl =
    typeof chapter.content?.content === "string"
      ? chapter.content.content
      : undefined

  if (!chapter.hasContent || !chapter.contentId) {
    return (
      <div className="opacity-50 p-2">
        Chapter {chapter.chapter.chapter} (no content)
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link
        to={`/shinobu/${service?.id}/reader/${type.toLowerCase()}/${chapter.contentId}`}
        className="relative flex flex-row items-center p-2 h-24 gap-2 group before:absolute before:z-10 before:left-0 before:top-0 before:min-h-full before:rounded-r-full before:transition-all before:duration-500 hover:shadow active:shadow hover:shadow-[#C667F7] active:shadow-[#C667F7] before:w-0 hover:before:w-screen active:before:w-screen before:bg-[#C667F7] overflow-hidden rounded-r-xl"
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

        <div className={`flex z-10 flex-col ${type === "NOVEL" ? "absolute left-10" : ""}`}>
          <span>
            {chapter.chapter.volume
              ? `Volume ${chapter.chapter.volume} `
              : ""}
            Chapter {chapter.chapter.chapter}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/* ================= ShinobuDetail ================= */

const ShinobuDetail = () => {
  const { mediaId } = useParams();
  const { service } = useShinobu();

  const [media, setMedia] = useState<Media | null>(null);
  const [externals, setExternals] = useState<
    {
      source: Source
      mediaExternal: MediaExternal
      chapters: {
        chapter: Chapter
        hasContent: boolean
        contentId?: string | null
        content: ChapterContent
      }[]
    }[]
  >([])

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaId || !service) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);

        const res = await shinobuFetch<{
          media: Media,
          tree: MultiSourceTree
        }>(`/${service.version?.endpoint}/media/${mediaId}`, {
          auth: true,
          baseUrl: service.url,
          localId: service.id,
        });

        setMedia(res.media);

        const externalData = res.tree.externals

        setExternals(externalData);

        // Default selected source
        if (externalData.length > 0) setSelectedSource(externalData[0].source.name);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat ShinobuDetail media");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [mediaId, service]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">{error}</div>;
  if (!media) return null;

  const currentExternal = externals.find((e) => e.source.name === selectedSource);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen text-white overflow-x-hidden"
    >
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
              <h1 className="text-xl sm:text-2xl font-semibold">{media.title}</h1>
              <p className="text-sm opacity-70">Status: {media.status}</p>
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
              const name = typeof gen === "string" ? gen : gen.name
              return (
                <div
                  key={name}
                  className="py-2 px-3 border-2 border-[#C667F7] rounded-lg m-1"
                >
                  {name}
                </div>
              )
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
                  <option key={ext.source.name} value={ext.source.name}>
                    {ext.source.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentExternal ? (
            Array.from(
              currentExternal.chapters.reduce(
                (map: Map<number, {
                  chapter: Chapter
                  hasContent: boolean
                  contentId?: string | null
                  content: ChapterContent
                }[]>, ch: {
                  chapter: Chapter
                  hasContent: boolean
                  contentId?: string | null
                  content: ChapterContent
                }) => {
                  const vol = ch.chapter.volume ?? 0;
                  if (!map.has(vol)) map.set(vol, []);
                  map.get(vol)!.push(ch);
                  return map;
                },
                new Map<number, {
                  chapter: Chapter
                  hasContent: boolean
                  contentId?: string | null
                  content: ChapterContent
                }[]>()
              )
            ).map(([volume, chapters]) => (
              <div key={volume} className="mb-3">
                <h3 className="font-medium mb-1">
                  Volume {volume !== 0 ? volume : "Misc"}
                </h3>
                <div className="flex flex-col">
                  {chapters.map((ch) => (
                    <ChapterCard
                      key={ch.chapter.id}
                      chapter={ch}
                      type={media?.type}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm opacity-60">Pilih source untuk menampilkan chapter</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShinobuDetail;