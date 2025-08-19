import axios from 'axios';
import { ICombo } from '@/interface/combo';

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/combo`;

type ApiResponse<T> = { data: T; message?: string };

export const comboApi = {
  async getAllCombo(): Promise<ICombo[]> {
    const res = await axios.get<ApiResponse<ICombo[]>>(BASE);
    return res.data.data;
  },
  async getAvailableCombo(): Promise<ICombo[]> {
    const res = await axios.get<ApiResponse<ICombo[]>>(`${BASE}/available`);
    return res.data.data;
  },
  async getByIdCombo(id: string): Promise<ICombo> {
    const res = await axios.get<ApiResponse<ICombo>>(`${BASE}/${id}`);
    return res.data.data;
  },
  async createCombo(form: FormData): Promise<ICombo> {
    const res = await axios.post<ApiResponse<ICombo>>(BASE, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
  async updateCombo(id: string, form: FormData): Promise<ICombo> {
    const res = await axios.put<ApiResponse<ICombo>>(`${BASE}/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
  async toggleAvailability(id: string): Promise<ICombo> {
    const res = await axios.patch<ApiResponse<ICombo>>(`${BASE}/${id}/toggle`);
    return res.data.data;
  },
  async deleteCombo(id: string): Promise<{ message: string }> {
    const res = await axios.delete<{ message: string }>(`${BASE}/${id}`);
    return res.data;
  },
};
