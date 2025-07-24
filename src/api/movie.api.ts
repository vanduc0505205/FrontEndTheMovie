import { IMovie } from '@/types/movie';
import axios from 'axios'

export const getMovies = async (): Promise<IMovie[]> => {
  const { data } = await axios.get('http://localhost:3000/movie');
  return data;
}
