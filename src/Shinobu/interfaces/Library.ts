// interfaces/Library.ts
export interface MediaItem {
  _id: string;
  title: string;
  coverImage?: string;
  description?: string | null;
  type: "COMIC" | "NOVEL" | "TV";
}

export interface BookmarkItem {
  _id: string;
  media: MediaItem;
  createdAt: string;
}

export interface CollectionItem {
  _id: string;
  name: string;
  media: MediaItem[];
  createdAt: string;
}