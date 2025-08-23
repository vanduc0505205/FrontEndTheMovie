export interface INews {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  category: "movie" | "promotion" | "event" | "other";
  status: "draft" | "published";
  publishedAt?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}
