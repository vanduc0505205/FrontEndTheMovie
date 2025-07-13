import { Room } from '@/types';
import axios from 'axios'

export const getRooms = async (): Promise<Room[]> => {
  const { data } = await axios.get('http://localhost:3000/room')
  return data;
}
