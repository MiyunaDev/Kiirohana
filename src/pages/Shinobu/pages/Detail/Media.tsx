// ... imports sama seperti sebelumnya
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { shinobuFetch } from "../../../../utils/fetchShinobu";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { ServiceItem } from "../../../../interfaces/Service";

/* ================= Types ================= */

type ServicesStorage = {
    honoka: ServiceItem | null;
    shinobu: ServiceItem[];
};

export interface Media {
    _id: string;
    title: string;
    description: string | null;
    coverImage: string;
    bannerImage?: string;
    type: "COMIC" | "NOVEL" | "TV";
    status: string;
    genres: { name: string; slug: string }[];
    tags: { name: string; slug: string }[];
}

export interface Chapter {
    _id: string;
    id: string; // untuk ChapterCard destination
    chapter: number;
    volume: number;
    title?: string;
    content: Array<string | { url: string }>; // penting untuk preview
    createdAt?: string;
}

interface ExternalData {
    sourceName: string;
    chapters: Chapter[];
}

const ChapterCard = ({
    chapter,
    type,
    detail
}: {
    chapter: Chapter;
    type?: "novel" | "comic";
    detail: Media
}) => {
    const [preview, setPreview] = useState<string>();
    const [destination, setDestination] = useState<string>()

    useEffect(() => {
        if (chapter.content) {
            const slc = chapter.content
                .filter(
                    (co) =>
                        typeof co === "string" || (typeof co === "object" && co.url)
                )
                .map((content) =>
                    typeof content === "string" ? content : content.url
                ) as string[];

            let previewUrl: string | undefined;

            if (type === "novel") {
                previewUrl = slc[0];
            } else {
                if (slc.length === 1) {
                    previewUrl = slc[0];
                } else if (slc.length < 3) {
                    previewUrl = slc[slc.length - 1];
                } else {
                    let page = Math.floor(slc.length * 0.05);
                    if (page < 2) page = 2;
                    previewUrl = slc[page];
                }
            }

            setPreview(previewUrl);
        }

        if (type === "comic") {
            setDestination(`/detail/reader/comic?title=${encodeURIComponent(detail.title)}&chapterid=${encodeURIComponent(chapter.id)}`)
        } else if (type === "novel") {
            setDestination(`/detail/reader/novel?title=${encodeURIComponent(detail.title)}&chapterid=${encodeURIComponent(chapter.id)}`)
        }

    }, [chapter, type]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link to={destination as string} className="relative flex flex-row items-center p-2 h-24 gap-2 group before:absolute before:z-10 before:left-0 before:top-0
        before:min-h-full before:rounded-r-full before:transition-all before:duration-500
        hover:shadow active:shadow hover:shadow-[#C667F7] active:shadow-[#C667F7]
        before:w-0 hover:before:w-screen active:before:w-screen before:bg-[#C667F7] overflow-hidden rounded-r-xl">
                {preview && (
                    <div className={`relative z-10 w-15 aspect-[3/4] ${type === "novel" ? "group-hover:after:to-[rgba(198,103,247,0.7)] group-active:after:to-[rgba(198,103,247,0.7)] after:absolute after:inset-0 after:bg-gradient-to-r after:from-[rgba(0,0,0,0.2)] after:to-[rgba(0,0,0,1)] transition-all duration-500" : ""}`}>
                        <img
                            className="w-full h-full object-cover object-top"
                            src={preview}
                            alt="Chapter preview"
                        />
                    </div>

                )}
                <div className={`flex z-10 flex-col ${type === "novel" ? "absolute left-10" : ""}`}>
                    <a>
                        {chapter.volume !== 0 ? `Volume ${chapter.volume} ` : ""}
                        Chapter {chapter.chapter}
                    </a>
                </div>
            </Link>
        </motion.div>
    );
};

/* ================= ChapterCard ================= */

// Paste ChapterCard yang kamu kirim di sini (tidak perlu diubah)

const ShinobuDetail = () => {
  const { mediaId, shinobuid } = useParams();
  const navigate = useNavigate();

  const [services] = useLocalStorage<ServicesStorage>("services", {
    honoka: null,
    shinobu: [],
  });

  const [service, setService] = useState<ServiceItem | null>(null);
  const [media, setMedia] = useState<Media | null>(null);
  const [externals, setExternals] = useState<ExternalData[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null); // <-- New
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shinobuid) return;

    const current = services.shinobu.find((s) => s.id === shinobuid);
    if (!current) {
      navigate("/shinobu", { replace: true });
      return;
    }
    setService(current);
  }, [shinobuid, services, navigate]);

  useEffect(() => {
    if (!mediaId || !service) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await shinobuFetch<{
          success: boolean;
          media: Media;
          tree: {
            externals: {
              source: { name: string };
              chapters: { chapter: Chapter }[];
            }[];
          };
        }>(`/${service.version?.endpoint}/media/${mediaId}`, {
          auth: true,
          baseUrl: service.url,
          localId: service.id,
        });

        setMedia(res.media);

        const externalData = res.tree.externals.map((ext) => ({
          sourceName: ext.source.name,
          chapters: ext.chapters.map((c) => c.chapter),
        }));

        setExternals(externalData);

        // Set default selected source
        if (externalData.length > 0) setSelectedSource(externalData[0].sourceName);
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

  // Filter chapters based on selected source
  const currentExternal = externals.find((e) => e.sourceName === selectedSource);

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
          {/* Banner & Cover */}
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
            {media.genres.map((gen) => (
              <div
                key={gen.slug}
                className="py-2 px-3 border-2 border-[#C667F7] rounded-lg m-1"
              >
                {gen.name}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Panel: Externals & Chapters */}
        <div className="relative w-full overflow-hidden p-4 gap-4">
          {/* Source Selector */}
          {externals.length > 1 && (
            <div className="mb-4">
              <label className="mr-2 font-medium">Pilih Source:</label>
              <select
                className="bg-gray-800 text-white p-1 rounded"
                value={selectedSource ?? ""}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                {externals.map((ext) => (
                  <option key={ext.sourceName} value={ext.sourceName}>
                    {ext.sourceName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Chapters */}
          {currentExternal ? (
            Object.entries(
              currentExternal.chapters.reduce(
                (acc: Record<number, Chapter[]>, ch) => {
                  if (!acc[ch.volume]) acc[ch.volume] = [];
                  acc[ch.volume].push(ch);
                  return acc;
                },
                {}
              )
            ).map(([volume, chapters]) => (
              <div key={volume} className="mb-3">
                <h3 className="font-medium mb-1">Volume {volume}</h3>
                <div className="flex flex-col">
                  {chapters.map((chapter) => (
                    <ChapterCard
                      key={chapter._id}
                      chapter={chapter}
                      type={media.type.toLowerCase() as "novel" | "comic"}
                      detail={media}
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