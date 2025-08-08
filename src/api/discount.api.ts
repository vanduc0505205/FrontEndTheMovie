import axios from "axios"; 

export const getAllDiscounts = () => axios.get("/discount");
export const createDiscount = (data) => axios.post("/discount", data);
export const updateDiscount = (id, data) => axios.put(`/discount/${id}`, data);
export const deleteDiscount = (id) => axios.delete(`/discount/${id}`);
