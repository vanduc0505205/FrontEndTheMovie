export interface IShowtime {
  _id: string
  movieId: {
    _id: string
    title: string
  }
  cinemaId: {
    _id: string
    name: string
  }
  roomId: {
    _id: string
    name: string
  }
  startTime: string
  endTime: string
  defaultPrice: number
  createdAt?: string
  updatedAt?: string
}
export interface Movie {
  _id?: string; // optional nếu dùng cho form create
  title: string;
  description: string;
  duration: number;
  releaseDate: string; // ISO date string
  director: string;
  actors: string[];
  language: string;
  trailer?: string;
  poster?: string;
  banner?: string[];
  ageRating: 'C13' | 'C16' | 'C18';
  status: 'sap_chieu' | 'dang_chieu' | 'ngung_chieu';
  taoLuc?: string;     // createdAt (nếu dùng timestamps)
  capNhatLuc?: string; // updatedAt (nếu dùng timestamps)
}
// types/category.ts
export interface Category {
  _id: string;
  categoryName: string;
  description: string;
  taoLuc?: string;
  capNhatLuc?: string;
}