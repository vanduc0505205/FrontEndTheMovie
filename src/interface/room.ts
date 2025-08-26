export interface IRoom {
  [x: string]: string;
  _id: string;
  name: string;
  rows: number;  
  columns: number;
  createdAt: string;
  updatedAt: string;
}