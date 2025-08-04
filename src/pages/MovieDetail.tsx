import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import dayjs from "dayjs";
import { getShowtimes } from "@/api/showtime.api";
import { getMovieById } from "@/api/movie.api";
import { IShowtime } from "@/types/showtime";
import { IMovie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";

export default function SelectShowtime() {
  const { id: movieId } = useParams();

  const navigate = useNavigate();

  // Lấy chi tiết phim
  const {
    data: movie,
    isLoading: isMovieLoading,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId!),
    enabled: !!movieId, // chỉ gọi khi có movieId
  });

  // Lấy danh sách lịch chiếu
  const { data: showtimes = [], isLoading } = useQuery({
    queryKey: ["showtimes"],
    queryFn: getShowtimes,
  });

  const now = dayjs();

  // Lọc các lịch chiếu theo phim hiện tại và sau thời điểm hiện tại
  const filteredShowtimes = useMemo(() => {
    return showtimes.filter(
      (s) => s.movieId._id === movieId && dayjs(s.startTime).isAfter(now)
    );
  }, [showtimes, movieId]);

  // Nhóm theo ngày
  const groupedByDate = useMemo(() => {
    const map: Record<string, IShowtime[]> = {};
    filteredShowtimes.forEach((s) => {
      const date = dayjs(s.startTime).format("YYYY-MM-DD");
      if (!map[date]) map[date] = [];
      map[date].push(s);
    });
    return map;
  }, [filteredShowtimes]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const sortedDates = useMemo(() => Object.keys(groupedByDate).sort(), [groupedByDate]);
  const [selectedDate, setSelectedDate] = useState(sortedDates[0] || "");

  const handleSelectShowtime = (s: IShowtime) => {
    console.log("Chọn suất chiếu:", s);

    navigate(
      `/phim/${s.movieId._id}/selectSeat?roomId=${s.roomId._id}&showtimeId=${s._id}&userId=${user.id}`,
      {
        state: {
          movie: s.movieId,
          showtime: s,
        },
      }
    );
  };

  if (isLoading || isMovieLoading) return <Spin className="mt-10" />;
  if (movieError) return <div>Không thể tải phim.</div>;

  return (
    <div className="bg-neutral-950 min-h-screen text-white px-4 py-10">
      <div className="w-max h-10"></div>
      <div className="max-w-6xl mx-auto">
        <Button
          type="default"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 bg-white text-black hover:bg-gray-100 border-none"
          icon={<ArrowLeft />}
        >
          Quay lại danh sách phim
        </Button>

        <div className="flex flex-col lg:flex-row gap-10">
          <img
            src={movie.poster || "https://via.placeholder.com/300x400?text=No+Image"}
            alt={movie.title}
            className="w-[280px] h-[420px] object-cover rounded-xl shadow-2xl"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold mb-4 text-white">{movie.title}</h1>

            <ul className="text-sm space-y-1 text-gray-300">
              <li><span className="text-white">Thời lượng:</span> {movie.duration || "100"} phút</li>
              <li>
                <span className="text-white">Khởi chiếu:</span>{" "}
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
                  : "11/07/2025"}
              </li>
              <li><span className="text-white">Đạo diễn:</span> {movie.director}</li>
              <li><span className="text-white">Diễn viên:</span> {movie.actors}</li>
              <li><span className="text-white">Giới hạn tuổi:</span> {movie.ageRating}</li>
            </ul>

            <p className="mt-6 text-gray-300 text-justify">
              {movie.description || "Không có mô tả."}
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Chọn ngày:</h3>
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                {sortedDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-2 rounded-lg border text-sm whitespace-nowrap min-w-[100px] text-center
                      ${selectedDate === date ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    {dayjs(date).format("DD/MM dddd")}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Giờ chiếu:</h3>
              <div className="flex flex-wrap gap-2">
                {groupedByDate[selectedDate]?.map((s) => (
                  <Button
                    key={s._id}
                    type="default"
                    size="small"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => handleSelectShowtime(s)}
                  >
                    {dayjs(s.startTime).format("HH:mm")}
                  </Button>
                ))}
                {groupedByDate[selectedDate]?.length === 0 && (
                  <div className="text-sm text-gray-500">Không có suất chiếu</div>
                )}
              </div>
            </div>

            {movie.trailer && (
              <div className="mt-6">
                <a
                  href={movie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 underline hover:text-yellow-300"
                >
                  ▶ Xem trailer
                </a>
              </div>
            )}

            <div className="mt-6 text-orange-500 text-sm">
              Lưu ý: Khán giả dưới 13 tuổi cần chọn suất chiếu trước 22h và khán giả dưới 16 tuổi cần chọn suất chiếu trước 23h.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}