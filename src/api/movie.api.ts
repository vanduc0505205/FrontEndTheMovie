import axiosInstance from '@/lib/authService'; 
import MovieQueryParams from '@/interface/MovieQueryParams';
import { IMovie } from '@/interface/movie';

export const getAllMovies = async (params: MovieQueryParams) => {
  const res = await axiosInstance.get("http://localhost:3000/movie", { params });
  return res.data;
};

export const getAllMoviesSimple = async () => {
  const res = await axiosInstance.get('/movie');
  return res.data.list; 
};

export const getMovieById = async (id: string): Promise<IMovie> => {
  const res = await axiosInstance.get(`/movie/${id}`);
  return res.data.newMovie;
};

export const createMovie = async (movie: Partial<IMovie>): Promise<IMovie> => {
  const res = await axiosInstance.post('/movie', movie);
  return res.data;
};

export const updateMovie = async (
  id: string,
  movie: Partial<IMovie>
): Promise<IMovie> => {
  const res = await axiosInstance.put(`/movie/${id}`, movie);
  return res.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/movie/${id}`);
};

export const searchMovies = async (query: string): Promise<IMovie[]> => {
  const res = await axiosInstance.get('/movie/search', { params: { q: query } });
  return res.data.list;
};
