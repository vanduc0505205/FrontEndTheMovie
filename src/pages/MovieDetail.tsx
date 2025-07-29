import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchMovie = async () => {
    try {
      const res = await fetch(`http://localhost:3000/movie/${id}`);
      const data = await res.json();
      console.log("Movie đây:", data); 
      setMovie(data);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết phim:", err);
    }
  };
  fetchMovie();
}, [id]);


  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(movie);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    navigate("/selectSeat", { state: { movieId: movie.id } });
  };

  if (!movie) return <div>Đang tải...</div>;

  return (
    <div className="min-h-screen container py-10 px-4 mx-auto">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft /> Quay lại danh sách phim
      </Button>

      <div className="grid md:grid-cols-2 gap-10">
      <img
            src={movie.poster || "https://via.placeholder.com/300x400?text=No+Image"}
            alt={movie.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            />


        <div>
          <h1 className="text-3xl font-bold text-primary-green-300 mb-4">
            {movie.title}
          </h1>

          <p className="mb-4 text-gray-700">
            <strong>Mô tả:</strong> {movie.description || "Chưa có mô tả."}
          </p>

          <ul className="space-y-2 text-sm text-gray-800">
            <li>⏱️ Thời lượng: {movie.duration} phút</li>
            <li>📅 Ngày phát hành: {movie.releaseDate}</li>
            <li>🧑‍🎬 Đạo diễn: {movie.director}</li>
            <li>👥 Diễn viên: {movie.actor}</li>
            <li>🗣️ Ngôn ngữ: {movie.language}</li>
            <li>🔞 Giới hạn tuổi: {movie.age}</li>
            <li>🎞️ Trailer: <a href={movie.trailer} className="text-blue-600 underline">Xem trailer</a></li>
          </ul>

          {/* Nút thêm vào giỏ và mua vé */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              className="bg-primary-green-300 hover:bg-primary-green-400 text-white font-semibold px-6 py-3 rounded-xl transition"
              onClick={handleAddToCart}
            >
              🛒 Thêm vào giỏ hàng
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition"
              onClick={handleBuyNow}
            >
              🎟️ Mua vé ngay
            </button>
          </div>

          {/* Banner */}
          <h3 className="text-lg font-semibold mt-8 mb-2">Banner:</h3>
          <div className="flex gap-2 flex-wrap">
            {(movie.banner || []).map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`Banner ${index + 1}`}
                className="w-40 h-auto rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
