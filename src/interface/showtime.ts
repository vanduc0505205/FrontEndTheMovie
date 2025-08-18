export interface IShowtime {
  _id: string;
  movieId: {
    _id: string;
    title: string;
  };
  cinemaId: {
    _id: string;
    name: string;
  };
  roomId: {
    _id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  defaultPrice: number;
  createdAt?: string;
  updatedAt?: string;
}