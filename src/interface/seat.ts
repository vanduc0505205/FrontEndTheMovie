export interface ISeat {
  _id: string;
  roomId: string;
  row: string;
  column: number;
  seatCode: string;
  type: 'NORMAL' | 'VIP';
  status: 'available' | 'booked' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}