// hooks/useLibrary.ts
import { useEffect, useState } from "react";
import type { BookmarkItem, CollectionItem } from "../interfaces/Library";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShinobu } from "./useShinobu";

export const useBookmarks = () => {
    const { service } = useShinobu()
    const [data, setData] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBookmarks = async () => {
        if (!service) return;
        setLoading(true);
        setError(null);
        try {
            const res = await shinobuFetch<BookmarkItem[]>(`/${service.version?.endpoint}/bookmarks`, {
                auth: true,
                baseUrl: service?.url,
                localId: service?.id,
            });
            setData(res);
        } catch (err: any) {
            setError(err.message || "Gagal memuat bookmark");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    return { data, loading, error, refetch: fetchBookmarks };
};

export const useCollections = () => {
    const { service } = useShinobu()
    const [data, setData] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollections = async () => {
        if (!service) return;
        setLoading(true);
        setError(null);
        try {
            const res = await shinobuFetch<CollectionItem[]>(`/${service.version?.endpoint}/collections`, {
                auth: true,
                baseUrl: service?.url,
                localId: service?.id,
            });
            setData(res);
        } catch (err: any) {
            setError(err.message || "Gagal memuat koleksi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    return { data, loading, error, refetch: fetchCollections };
};