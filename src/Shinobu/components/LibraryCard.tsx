// components/LibraryCard.tsx
import type { MediaItem } from "../interfaces/Library";
import { ServiceItem } from "../interfaces/Service";
import { useShiNavigate } from "../utils/shiNavigate";

export const MediaCard = ({ media, service }: { media: MediaItem; service: ServiceItem }) => {
    const navigate = useShiNavigate(service.id);
    return (
        <div
            onClick={() => navigate(`/detail/${media._id}`)}
            className="flex flex-col min-w-[120px] max-w-[180px] mx-auto"
        >
            <div className="relative w-full">
                <img
                    src={media?.coverImage ?? `${service.url}/assets/noimage.png`}
                    alt={media.title}
                    className="w-full aspect-[2/3] object-cover bg-gray-300 rounded-xl"
                    loading="lazy"
                />
                <span className="absolute bottom-0 w-full text-xs text-center py-1 bg-gradient-to-t from-black/80 to-transparent">
                    Shinobu
                </span>
            </div>

            <a className="w-1/2 rounded-br-2xl px-0.5 py-1 text-xs text-center bg-[#C667F7]">
                {media.type}
            </a>

            <span className="mt-1 text-xs font-semibold text-center line-clamp-2">{media.title}</span>
        </div>
    );
};

export const CollectionCard = ({ collection, service }: { collection: any, service: ServiceItem }) => {
    const navigate = useShiNavigate(service.id);
    return (
        <div
            onClick={() => navigate(`/app/library/collection/${collection._id}`)}
            className="flex flex-col w-full min-w-[180px] max-w-[240px] mx-auto p-3 rounded-xl bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
            <span className="font-semibold text-sm text-gray-100 line-clamp-1">{collection.name}</span>
            <span className="text-xs text-gray-400 mb-2">{collection.media.length} items</span>
            <div className="grid grid-cols-3 gap-1">
                {collection.media.slice(0, 6).map((m: MediaItem) => (
                    <img
                        key={m._id}
                        src={m.coverImage ?? "/assets/noimage.png"}
                        alt={m.title}
                        className="w-full aspect-[2/3] object-cover rounded hover:scale-105 transition-transform duration-200"
                    />
                ))}
            </div>
        </div>
    )
}