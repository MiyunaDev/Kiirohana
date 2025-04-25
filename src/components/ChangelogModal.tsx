import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChangelogModalProps {
  content: string;
  onClose: () => void;
}

export default function ChangelogModal({ content, onClose }: ChangelogModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-[#202020] p-6 text-white shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">What's New</h2>

        <div className="prose prose-invert max-w-none mb-6">
          <Markdown remarkPlugins={[remarkGfm]}>
            {content}
          </Markdown>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-white px-4 py-2 text-black transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}