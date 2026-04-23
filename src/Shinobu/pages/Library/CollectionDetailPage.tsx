// pages/CollectionDetailPage.tsx
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { MediaCard } from "../../components/LibraryCard";
import type { CollectionItem } from "../../interfaces/Library";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShinobu } from "../../hooks/useShinobu";
import { useShiNavigate } from "../../utils/shiNavigate";
import { FaArrowLeft } from "react-icons/fa6";

const CollectionDetailPage = () => {
    const { id } = useParams();
    const [collection, setCollection] = useState<CollectionItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { service } = useShinobu()
    const navigate = useShiNavigate(service?.id)

    useEffect(() => {
        if (!id || !service) return;

        const fetchCollection = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await shinobuFetch<CollectionItem>(`/${service.version?.endpoint}/collections/${id}`, {
                    auth: true,
                    baseUrl: service?.url,
                    localId: service?.id,
                });
                setCollection(res);
            } catch (err: any) {
                setError(err.message || "Gagal memuat koleksi");
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [service, id]);

    if (loading) return <span className="animate-pulse">Memuat koleksi...</span>;
    if (error) return <span className="text-red-500">{error}</span>;
    if (!collection) return <span className="text-gray-500">Koleksi tidak ditemukan</span>;

    return (
        <div className="max-w-screen-xl mx-auto px-2 py-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-3 py-2 rounded-full
                           bg-black/70 backdrop-blur
                           hover:bg-[#C667F7] transition shadow-lg my-3"
            >
                <FaArrowLeft size={18} />
                <span className="text-sm">Back</span>
            </button>
            <h1 className="text-xl font-bold mb-4">{collection.name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {service && collection.media.map((m) => (
                    <MediaCard key={m._id} media={m} service={service} />
                ))}
            </div>
        </div>
    );
};

export default CollectionDetailPage;