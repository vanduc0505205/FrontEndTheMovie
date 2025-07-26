// src/services/movie.service.ts
import axios from 'axios'
import { IMovie } from '@/types/movie'

const API_URL = 'http://localhost:3000/movie'

export const getAllMovies = async (): Promise<IMovie[]> => {
  const res = await axios.get(API_URL)
  return res.data.list
}

export const getMovieById = async (id: string): Promise<IMovie> => {
  const res = await axios.get(`${API_URL}/${id}`)
  return res.data
}

export const createMovie = async (movie: Partial<IMovie>): Promise<IMovie> => {
  const res = await axios.post(API_URL, movie)
  return res.data
}

export const updateMovie = async (
  id: string,
  movie: Partial<IMovie>
): Promise<IMovie> => {
  const res = await axios.put(`${API_URL}/${id}`, movie)
  return res.data
}

export const deleteMovie = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`)
}
export const searchMovies = async (query: string): Promise<IMovie[]> => {
  const res = await axios.get(`${API_URL}/search`, { params: { q: query } })
  return res.data.list
}