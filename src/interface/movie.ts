import { ICategory } from "./category";

export interface IMovie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  director: string;
  actors: string[];
  language: string;
  trailer?: string;
  poster?: string;
  banner?: string[] | string;
  ageRating: 'C13' | 'C16' | 'C18';
  status: 'sap_chieu' | 'dang_chieu' | 'ngung_chieu';
  taoLuc: string;
  capNhatLuc: string;
  categories: ICategory[];
}