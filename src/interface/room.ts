export interface IRoom {
  _id: string;
  name: string;
  cinemaId: string;  // reference to Cinema
  rows: number;  
  columns: number;
  status?: "open" | "maintenance";
  createdAt: string;
  updatedAt: string;
}