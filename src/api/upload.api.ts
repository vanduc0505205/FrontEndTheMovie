
import axiosInstance from "@/lib/authService";
import { RcFile } from "antd/es/upload";

export const uploadImage = async (file: RcFile): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosInstance.post("/upload/image", formData);
  return res.data.url; // trả về URL của ảnh
};
