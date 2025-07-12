import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  director: string;
  actors: string[];
  language: string;
  trailer?: string;
  poster?: string;
  banner?: string[];
  ageRating: "C13" | "C16" | "C18";
  status: "sap_chieu" | "dang_chieu" | "ngung_chieu";
}

export default function MovieAdmin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [form, setForm] = useState<Partial<Movie>>({
    title: "",
    description: "",
    duration: 0,
    releaseDate: "",
    director: "",
    actors: [],
    language: "",
    ageRating: "C13",
    status: "sap_chieu",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:3000/movie");
      console.log("Danh sách phim:", res.data.list);
      // setMovies(res.data.list);
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:3000/movie", form);
      setForm({});
      fetchMovies();
    } catch (error) {
      console.error("Lỗi thêm phim:", error);
    }
  };

  const handleEdit = (movie: Movie) => {
    setIsEditing(true);
    setEditId(movie._id);
    setForm(movie);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await axios.put(`http://localhost:3000/movie/${editId}`, form);
      setIsEditing(false);
      setEditId(null);
      setForm({});
      fetchMovies();
    } catch (error) {
      console.error("Lỗi cập nhật phim:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/movie/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Lỗi xoá phim:", error);
    }
  };

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Chỉnh sửa phim" : "Thêm phim"}</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input name="title" placeholder="Tên phim" value={form.title || ""} onChange={handleInput} />
          <Input name="description" placeholder="Mô tả" value={form.description || ""} onChange={handleInput} />
          <Input name="duration" type="number" placeholder="Thời lượng (phút)" value={form.duration || ""} onChange={handleInput} />
          <Input name="releaseDate" type="date" value={form.releaseDate?.slice(0, 10) || ""} onChange={handleInput} />
          <Input name="director" placeholder="Đạo diễn" value={form.director || ""} onChange={handleInput} />
          <Input name="language" placeholder="Ngôn ngữ" value={form.language || ""} onChange={handleInput} />
          <Input name="actors" placeholder="Diễn viên (cách nhau bởi dấu phẩy)" value={form.actors?.join(", ") || ""} onChange={(e) =>
            setForm((prev) => ({ ...prev, actors: e.target.value.split(",").map((a) => a.trim()) }))
          } />
          <select name="ageRating" value={form.ageRating} onChange={handleInput} className="border rounded px-2 py-1">
            <option value="C13">C13</option>
            <option value="C16">C16</option>
            <option value="C18">C18</option>
          </select>
          <select name="status" value={form.status} onChange={handleInput} className="border rounded px-2 py-1">
            <option value="sap_chieu">Sắp chiếu</option>
            <option value="dang_chieu">Đang chiếu</option>
            <option value="ngung_chieu">Ngừng chiếu</option>
          </select>
        </div>

        <div className="flex gap-2 mb-4">
          {isEditing ? (
            <>
              <Button onClick={handleUpdate}>Lưu</Button>
              <Button variant="secondary" onClick={() => { setIsEditing(false); setForm({}); }}>Huỷ</Button>
            </>
          ) : (
            <Button onClick={handleAdd}>Thêm phim</Button>
          )}
        </div>

        <hr className="my-4" />
        <h3 className="text-lg font-bold mb-2">Danh sách phim</h3>
        <ul>
          {movies.map((movie) => (
            <li key={movie._id} className="flex justify-between items-center border-b py-1">
              <span>{movie.title}</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(movie)}>Sửa</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(movie._id)}>Xoá</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
