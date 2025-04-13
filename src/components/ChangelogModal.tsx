import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChangelogModal({ content, onClose }: { content: string, onClose: any }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
            <div className="bg-[#202020] text-white w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">What's New</h2>
                <div className="prose prose-invert max-w-none mb-6 overflow-scroll">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </Markdown>
                </div>
                <div className="text-right">
                    <button
                        onClick={onClose}
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}