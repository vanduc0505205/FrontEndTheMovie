import { IUser } from '@/interface/user';
import axiosInstance from '@/lib/authService';

export const getAllUsers = async (): Promise<{ users: IUser[] }> => {
  const res = await axiosInstance.get('/user/getAllUsers');
  return res.data;
};

export const createUser = async (user: Partial<IUser>) => {
  return axiosInstance.post('/user/register', user);
};

export const updateUser = async (id: string, user: Partial<IUser>) => {
  return axiosInstance.put(`/user/${id}`, user);
};

export const deleteUser = async (id: string) => {
  return axiosInstance.delete(`/user/${id}`);
};

export const toggleUserStatus = async (id: string, status: 'active' | 'blocked') => {
  return axiosInstance.patch(`/user/${id}/status`, { status });
};

export const getUserBookings = async (userId: string) => {
  return axiosInstance.get(`/booking/user/${userId}`);
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  return axiosInstance.patch(`/booking/${bookingId}/status`, { status });
};
