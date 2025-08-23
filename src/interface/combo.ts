export interface IItem {
  name: string;
  quantity: number;
}

export interface ICombo {
  _id: string;
  name: string;
  price: number;
  description?: string;
  popcorns?: IItem[];
  drinks?: IItem[];
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  page: number;
  pageSize: number;
  total: number;
}