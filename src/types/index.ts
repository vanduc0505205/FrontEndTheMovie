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
export interface IMovie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string; // hoặc Date nếu bạn parse
  director: string;
  cast: string;
  language: string;
  trailer: string;
  poster: string;
  banner: string;
  ageRating: 'C13' | 'C16' | 'C18';
  status: 'coming_soon' | 'now_showing' | 'stopped';
  createdAt: string; // hoặc Date
  updatedAt: string; // hoặc Date
}

export interface ICinema {
  _id: string;
  name: string;
  address: string;
  createdAt: string; // hoặc Date nếu bạn parse
  updatedAt: string;
}

export interface IRoom {
  _id: string;
  name: string;
  rows: number;  
  columns: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISeat {
  _id: string;
  roomId: string; // hoặc là { _id: string, name: string } nếu populate
  row: string;
  column: number;
  seatCode: string;
  type: 'NORMAL' | 'VIP';
  status: 'available' | 'booked' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}


