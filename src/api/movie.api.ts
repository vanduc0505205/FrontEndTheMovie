import { IMovie } from '@/types';
import axios from 'axios'

export const getMovies = async (): Promise<IMovie[]> => {
  const { data } = await axios.get('http://localhost:3000/movie');
  return data;
}
