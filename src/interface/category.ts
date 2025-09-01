export interface ICategory {
  _id: string;
  categoryName: string;
  description: string;
  taoLuc?: string;
  capNhatLuc?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}