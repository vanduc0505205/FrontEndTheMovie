export interface INews {
  _id?: string;
  title: string;
  slug?: string;

  content: string;
  excerpt?: string;

  image?: string;
  coverAlt?: string;
  imageCaption?: string;

  category: "movie" | "promotion" | "event" | "other";
  tags?: string[];

  status: "draft" | "published";
  isFeatured?: boolean;
  isPinned?: boolean;

  views?: number;

  sourceUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  scheduleAt?: string | Date | null;
  publishedAt?: string | Date;

  isDeleted?: boolean;
  deletedAt?: string | Date | null;

  createdAt?: string;
  updatedAt?: string;
}
