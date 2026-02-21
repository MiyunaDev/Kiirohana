// hooks/useMediaComments.ts
import { useCallback, useEffect, useState } from "react";
import { shinobuFetch } from "../utils/fetchShinobu";
import type { ServiceItem } from "../interfaces/Service";

export interface CommentUser {
  _id: string;
  username: string;
  avatar?: string;
  level?: number;
  totalXp?: number;
}

export interface CommentItem {
  _id: string;
  content: string;
  createdAt: string;
  replyCount?: number;
  user: CommentUser;

  // client-only
  replies?: CommentItem[];
  repliesLoaded?: boolean;
}

interface UseMediaCommentsParams {
  mediaId: string;
  chapterId?: string | null;
  service: ServiceItem | null;
}

export default function useMediaComments({
  mediaId,
  chapterId = null,
  service,
}: UseMediaCommentsParams) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState<{ [key: string]: boolean }>({});

  /** Fetch all comments utama */
  const fetchComments = useCallback(async () => {
    if (!mediaId || !service) return;

    setLoading(true);
    try {
      const res = await shinobuFetch<CommentItem[]>(
        `/${service.version?.endpoint}/comments?mediaId=${mediaId}${chapterId ? `&chapterId=${chapterId}` : ""}`,
        { method: "GET", auth: false, baseUrl: service.url, localId: service.id }
      );

      setComments(
        res.map((c) => ({ ...c, replies: undefined, repliesLoaded: false }))
      );
    } finally {
      setLoading(false);
    }
  }, [mediaId, chapterId, service]);

  /** Fetch replies per comment */
  const fetchReplies = useCallback(
    async (commentId: string): Promise<CommentItem[]> => {
      if (!service) return [];
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const res = await shinobuFetch<CommentItem[]>(
        `/${service.version?.endpoint}/comments/${commentId}/replies`,
        { method: "GET", auth: false, baseUrl: service.url, localId: service.id }
      );

      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, replies: res, repliesLoaded: true } : c
        )
      );

      return res;
    },
    [service]
  );

  /** Create comment baru */
  const createComment = useCallback(
    async (content: string) => {
      if (!mediaId || !service || !content.trim()) return;

      await shinobuFetch(`/${service.version?.endpoint}/comments`, {
        method: "POST",
        auth: true,
        baseUrl: service.url,
        localId: service.id,
        body: { mediaId, chapterId, content },
      });

      fetchComments();
    },
    [mediaId, chapterId, service, fetchComments]
  );

  /** Reply comment */
  const replyComment = useCallback(
    async (parentId: string, content: string): Promise<CommentItem> => {
      if (!service) throw new Error("Service tidak tersedia");
      if (!content.trim()) throw new Error("Content tidak boleh kosong");

      const newReply = await shinobuFetch<CommentItem>(
        `/${service.version?.endpoint}/comments/reply`,
        {
          method: "POST",
          auth: true,
          baseUrl: service.url,
          localId: service.id,
          body: { parentId, content },
        }
      );

      await fetchComments()

      return newReply;
    },
    [service]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    commentLoading: loading,
    loadingReplies,
    fetchComments,
    fetchReplies,
    createComment,
    replyComment,
  };
}