import axios from 'axios';
import { IUser } from '@/types/user';

export const getAllUsers = async (): Promise<{ users: IUser[] }> => {
  const res = await axios.get('http://localhost:3000/user/getAllUsers');
  return res.data;
};

export const createUser = async (user: Partial<IUser>) => {
  return axios.post('http://localhost:3000/user', user);
};

export const updateUser = async (id: string, user: Partial<IUser>) => {
  return axios.put(`http://localhost:3000/user/${id}`, user);
};

export const deleteUser = async (id: string) => {
  return axios.delete(`http://localhost:3000/user/${id}`);
};
