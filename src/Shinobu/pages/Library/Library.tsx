// pages/LibraryPage.tsx
import { useState } from "react";
import { useBookmarks, useCollections } from "../../hooks/useLibrary";
import { MediaCard, CollectionCard } from "../../components/LibraryCard";
import { useShinobu } from "../../../hooks/useShinobu";

const LibraryPage = () => {
  const [tab, setTab] = useState<"bookmarks" | "collections">("bookmarks");
  const { service } = useShinobu()

  const {
    data: bookmarks,
    loading: loadingBookmarks,
    error: errorBookmarks,
  } = useBookmarks();

  const {
    data: collections,
    loading: loadingCollections,
    error: errorCollections,
  } = useCollections();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 text-gray-100 min-h-screen">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            tab === "bookmarks"
              ? "bg-purple-500 text-white shadow-lg"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setTab("bookmarks")}
        >
          Bookmarks
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            tab === "collections"
              ? "bg-purple-500 text-white shadow-lg"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setTab("collections")}
        >
          Collections
        </button>
      </div>

      {/* Content */}
      {tab === "bookmarks" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loadingBookmarks && (
            <span className="animate-pulse text-gray-400 col-span-full text-center">
              Memuat data...
            </span>
          )}
          {errorBookmarks && (
            <span className="text-red-500 col-span-full text-center">
              {errorBookmarks}
            </span>
          )}
          {!loadingBookmarks && bookmarks.length === 0 && (
            <span className="text-gray-500 col-span-full text-center">
              Belum ada bookmark
            </span>
          )}
          {service && bookmarks.map((b) => (
            <MediaCard
              key={b._id}
              media={b.media}
              service={service}
            />
          ))}
        </div>
      )}

      {tab === "collections" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingCollections && (
            <span className="animate-pulse text-gray-400 col-span-full text-center">
              Memuat data...
            </span>
          )}
          {errorCollections && (
            <span className="text-red-500 col-span-full text-center">
              {errorCollections}
            </span>
          )}
          {!loadingCollections && collections.length === 0 && (
            <span className="text-gray-500 col-span-full text-center">
              Belum ada koleksi
            </span>
          )}
          {service && collections.map((c) => (
            <CollectionCard
              key={c._id}
              collection={c}
              service={service}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;