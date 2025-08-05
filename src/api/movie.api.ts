import { IMovie } from '@/types/movie';
import axios from 'axios'

export const getAllMovies = async (): Promise<IMovie[]> => {
  const res = await axios.get(`http://localhost:3000/movie`);
  return res.data.list;
}

export const getMovieById = async (id: string): Promise<IMovie> => {
  const res = await axios.get(`http://localhost:3000/movie/${id}`)
  return res.data.newMovie;
}

export const createMovie = async (movie: Partial<IMovie>): Promise<IMovie> => {
  const res = await axios.post(`http://localhost:3000/movie`, movie)
  return res.data
}

export const updateMovie = async (
  id: string,
  movie: Partial<IMovie>
): Promise<IMovie> => {
  const res = await axios.put(`http://localhost:3000/movie}/${id}`, movie)
  return res.data
}

export const deleteMovie = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:3000/movie}/${id}`)
}
export const searchMovies = async (query: string): Promise<IMovie[]> => {
  const res = await axios.get(`http://localhost:3000/movie}/search`, { params: { q: query } })
  return res.data.list
}