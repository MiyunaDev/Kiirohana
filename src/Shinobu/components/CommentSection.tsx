import { useState } from "react";
import { CommentItem } from "../hooks/useMediaComments";
import { CommentItemView } from "./CommentItemView";

type Props = {
  comments: CommentItem[];
  commentLoading: boolean;
  createComment: (content: string) => void;
  replyComment: (parentId: string, content: string) => Promise<CommentItem>;
  fetchReplies: (parentId: string) => Promise<CommentItem[]>;
};

export const CommentsSection = ({
  comments,
  commentLoading,
  createComment,
  replyComment,
  fetchReplies,
}: Props) => {
  const [newComment, setNewComment] = useState("");

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    createComment(newComment);
    setNewComment("");
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Komentar</h2>

      {/* New Comment */}
      <div className="mb-4">
        <textarea
          className="w-full bg-gray-800 p-3 rounded resize-none"
          rows={3}
          placeholder="Tulis komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // cegah enter buat baris baru
              handleSendComment();
            }
            // Shift + Enter tetap bisa buat baris baru
          }}
        />
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs opacity-50">Shift + Enter untuk baris baru</div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={handleSendComment}
          >
            Kirim
          </button>
        </div>
      </div>

      {/* Comment List */}
      {commentLoading && <div className="opacity-60">Memuat komentar...</div>}
      {!commentLoading && comments.length === 0 && (
        <div className="opacity-50 text-sm">Belum ada komentar</div>
      )}

      <div>
        {comments.map((comment) => (
          <CommentItemView
            key={comment._id}
            comment={comment}
            onReply={replyComment}
            loadReplies={fetchReplies}
          />
        ))}
      </div>
    </div>
  );
};