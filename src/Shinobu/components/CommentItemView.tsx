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
                {/* ================= HEADER ================= */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-[15px] leading-none">
                        {comment.user.username}
                    </span>

                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#707070]/80 text-white/90">
                        Lv. {comment.user.level}
                    </span>

                    <span className="text-[11px] text-white/40">
                        {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="mt-2 text-[14px] leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {comment.content}
                    </ReactMarkdown>
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="flex items-center gap-4 mt-3 text-[12px] text-white/50">
                    <button
                        onClick={handleToggleReplyBox}
                        className="hover:text-white transition-colors"
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

                {/* ================= REPLY BOX ================= */}
                {showReplyBox && (
                    <div className="mt-4 p-3 rounded-lg bg-white/5 ring-1 ring-white/10 space-y-2">
                        <textarea
                            ref={textareaRef}
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tambahkan balasan…"
                            className="w-full resize-none bg-transparent text-sm outline-none"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowReplyBox(false)}
                                className="px-3 py-1 text-xs rounded hover:bg-white/10"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSend}
                                className="px-3 py-1 text-xs rounded bg-[#C667F7] hover:opacity-90"
                            >
                                Balas
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= REPLIES ================= */}
                {showReplies && (
                    <div className="mt-4 space-y-4 pl-4 border-l border-white/10">
                        {loadingReplies && (
                            <div className="text-xs text-white/40">
                                Memuat balasan...
                            </div>
                        )}

                        {replies?.map((reply) => (
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