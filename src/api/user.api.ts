import axiosInstance from '@/lib/authService';
import { IUser } from '@/types/user';

export const getAllUsers = async (): Promise<{ users: IUser[] }> => {
  const res = await axiosInstance.get('/user/getAllUsers');
  return res.data;
};

export const createUser = async (user: Partial<IUser>) => {
  return axiosInstance.post('/user', user);
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
