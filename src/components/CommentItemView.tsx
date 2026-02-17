import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef } from "react";
import { CommentItem } from "../hooks/useMediaComments";

type Props = {
    comment: CommentItem;
    onReply: (parentId: string, content: string) => Promise<CommentItem>;
    loadReplies: (parentId: string) => Promise<CommentItem[]>;
    depth?: number;
};

export const CommentItemView = ({
    comment,
    onReply,
    loadReplies,
    depth = 0,
}: Props) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<CommentItem[] | null>(
        comment.repliesLoaded ? comment.replies || [] : null
    );
    const [loadingReplies, setLoadingReplies] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // auto focus textarea
    const handleToggleReplyBox = () => {
        setShowReplyBox((v) => !v);
        if (!showReplyBox) setTimeout(() => textareaRef.current?.focus(), 0);
    };

    // Handle send reply
    const handleSend = async () => {
        if (!replyText.trim()) return;
        try {
            await onReply(comment._id, replyText.trim());
            const rep = await loadReplies(comment._id)
            setReplies(rep);
            comment.replyCount = (comment.replyCount || 0) + 1;
            setReplyText("");
            setShowReplyBox(false);
            setShowReplies(true);
        } catch (err) {
            console.error("Gagal membalas komentar:", err);
        }
    };

    // Handle toggle replies & fetch if needed
    const handleToggleReplies = async () => {
        if (!showReplies && replies === null && Number(comment.replyCount) > 0) {
            setLoadingReplies(true);
            try {
                const reply = await loadReplies(comment._id);
                setReplies(reply || []); // pastikan update state dengan data terbaru
            } catch (err) {
                console.error("Gagal memuat balasan:", err);
            } finally {
                setLoadingReplies(false);
            }
        }
        setShowReplies((v) => !v);
    };

    if (!comment.content || !comment.user) return null;

    return (
        <div className={`flex gap-4 mb-5 ${depth > 0 ? "pl-4 border-l border-white/10" : ""}`}>
            {/* Avatar */}
            <img
                src={
                    comment.user.avatar ||
                    `https://api.dicebear.com/8.x/identicon/svg?seed=${comment.user.username}`
                }
                className="w-10 h-10 rounded-full shrink-0"
                alt={comment.user.username}
            />

            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px]">{comment.user.username}</span>
                    <span className="text-xs text-white/50">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Content */}
                <div className="mt-1 text-[14px] prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-2 text-xs text-white/60">
                    <button
                        onClick={handleToggleReplyBox}
                        className="hover:text-white hover:underline"
                    >
                        Balas
                    </button>

                    {Number(comment.replyCount) > 0 && (
                        <button
                            onClick={handleToggleReplies}
                            className="text-[#C667F7] hover:underline"
                        >
                            {showReplies
                                ? `Sembunyikan ${comment.replyCount} balasan`
                                : `Lihat ${comment.replyCount} balasan`}
                        </button>
                    )}
                </div>

                {/* Reply Box */}
                {showReplyBox && (
                    <div className="mt-3 space-y-2">
                        <textarea
                            ref={textareaRef}
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tambahkan balasan…"
                            className="w-full bg-gray-800 rounded-md p-2 text-sm outline-none ring-1 ring-white/10 focus:ring-[#C667F7]"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowReplyBox(false)}
                                className="px-3 py-1 rounded hover:bg-white/10"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSend}
                                className="px-3 py-1 rounded bg-[#C667F7]"
                            >
                                Balas
                            </button>
                        </div>
                    </div>
                )}

                {/* Replies */}
                {showReplies && (
                    <div className="mt-4 space-y-4">
                        {loadingReplies && (
                            <div className="text-xs opacity-50">Memuat balasan...</div>
                        )}
                        {replies &&
                            replies.map((reply) => (
                                <CommentItemView
                                    key={reply._id}
                                    comment={reply}
                                    onReply={onReply}
                                    loadReplies={loadReplies}
                                    depth={depth + 1}
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};