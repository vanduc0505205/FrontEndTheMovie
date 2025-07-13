import { Cinema } from '@/types';
import axios from 'axios'

// Sau khi đầy đủ api của cinema thì chuyển về folder types

export const getCinemas = async (): Promise<Cinema[]> => {
  const { data } = await axios.get('http://localhost:3000/cinema');
  return data;
}
