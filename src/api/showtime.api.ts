import axios from 'axios'
import { IShowtime } from '@/types'

// Lấy tất cả suất chiếu
export const getShowtimes = async (): Promise<IShowtime[]> => {
  const { data } = await axios.get('http://localhost:3000/showtime')
  return data.data;
}

// Thêm suất chiếu mới
export const createShowtime = async (payload: Partial<IShowtime>) => {
  const { data } = await axios.post('http://localhost:3000/showtime', payload)
  return data.data;
}

// Cập nhật suất chiếu
export const updateShowtime = async (id: string, payload: Partial<IShowtime>) => {
  const { data } = await axios.put(`http://localhost:3000/showtime/${id}`, payload)
  return data.data;
}

// Xoá suất chiếu
export const deleteShowtime = async (id: string) => {
  const { data } = await axios.delete(`http://localhost:3000/showtime/${id}`)
  return data.data;
}

// Lấy 1 suất chiếu theo ID
export const getShowtimeById = async (id: string): Promise<IShowtime> => {
  const { data } = await axios.get(`http://localhost:3000/showtime/${id}`)
  return data.data;
}
