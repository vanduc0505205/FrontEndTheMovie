import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
import { ArrowLeft, Clock, Calendar, User, Film, Star } from "lucide-react";
import dayjs from "dayjs";
import { getShowtimes } from "@/api/showtime.api";
import { getMovieById } from "@/api/movie.api";
import { IShowtime } from "@/types/showtime";
import { IMovie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import MovieTrailer from "@/components/pageComponets/trailer/MovieTrailer";

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
      (s) => s?.movieId?._id === movieId && s?.startTime && dayjs(s.startTime).isAfter(now)
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

  if (isLoading || isMovieLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" className="text-red-500" />
          <p className="text-white mt-4">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (movieError) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <Film className="mx-auto mb-4" size={48} />
          <p className="text-xl">Không thể tải thông tin phim.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen overflow-hidden">
      {/* Background overlay */}
      {/* <div className="absolute inset-0 bg-black/20"></div> */}
      
      <div className="relative z-10 px-4 py-10 min-h-screen">
        <div className="w-max h-10"></div>
        <div className="max-w-7xl mx-auto pb-10">
          {/* Back Button */}
          <Button
            type="default"
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 transition-all duration-300"
            icon={<ArrowLeft className="text-red-400" />}
          >
            <span className="text-gray-200">Quay lại danh sách phim</span>
          </Button>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-10">
            <div className="flex flex-col lg:flex-row gap-8 p-8">
              
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={movie.poster || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={movie.title}
                    className="w-[280px] h-[420px] object-cover rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="flex-1 space-y-6">
                
                {/* Title */}
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                    {movie.title}
                  </h1>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Star className="fill-current" size={16} />
                    <span className="text-sm">Phim đang hot</span>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-200">
                      <Clock className="text-red-400" size={16} />
                      <span className="text-white font-medium">Thời lượng:</span>
                      <span>{movie.duration || "100"} phút</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-200">
                      <Calendar className="text-red-400" size={16} />
                      <span className="text-white font-medium">Khởi chiếu:</span>
                      <span>
                        {movie.releaseDate
                          ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
                          : "11/07/2025"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-200">
                      <Film className="text-red-400" size={16} />
                      <span className="text-white font-medium">Giới hạn tuổi:</span>
                      <span className="bg-amber-500 text-black px-2 py-1 rounded text-xs font-bold">
                        {movie.ageRating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-gray-200">
                      <User className="text-red-400 mt-1" size={16} />
                      <div>
                        <span className="text-white font-medium block">Đạo diễn:</span>
                        <span className="text-gray-300">{movie.director}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-gray-200">
                      <User className="text-red-400 mt-1" size={16} />
                      <div>
                        <span className="text-white font-medium block">Diễn viên:</span>
                        <span className="text-gray-300">{movie.actors}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-2">Nội dung phim:</h3>
                  <p className="text-gray-300 text-justify leading-relaxed">
                    {movie.description || "Không có mô tả."}
                  </p>
                </div>

                {/* Date Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="text-red-400" size={20} />
                    Chọn ngày chiếu:
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                    {sortedDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-3 rounded-lg border text-sm whitespace-nowrap min-w-[120px] text-center transition-all duration-300 font-medium
                          ${selectedDate === date 
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-500/25" 
                            : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:border-white/30"}`}
                      >
                        <div className="text-xs opacity-80">
                          {dayjs(date).format("dddd")}
                        </div>
                        <div className="font-bold">
                          {dayjs(date).format("DD/MM")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Showtime Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="text-red-400" size={20} />
                    Chọn suất chiếu:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {groupedByDate[selectedDate]?.map((s) => (
                      <Button
                        key={s._id}
                        type="default"
                        size="large"
                        className="bg-white/10 border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 hover:text-green-300 transition-all duration-300 font-medium backdrop-blur-sm"
                        onClick={() => handleSelectShowtime(s)}
                      >
                        {dayjs(s.startTime).format("HH:mm")}
                      </Button>
                    ))}
                    {(!groupedByDate[selectedDate] || groupedByDate[selectedDate]?.length === 0) && (
                      <div className="text-gray-400 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                        Không có suất chiếu cho ngày này
                      </div>
                    )}
                  </div>
                </div>

                {/* Movie Trailer */}
                <div className="mt-8">
                  <MovieTrailer trailerUrl={movie.trailer} />
                </div>

                {/* Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="text-amber-400 mt-1">⚠️</div>
                    <div className="text-amber-300 text-sm leading-relaxed">
                      <strong>Lưu ý quan trọng:</strong> Khán giả dưới 13 tuổi cần chọn suất chiếu trước 22h và khán giả dưới 16 tuổi cần chọn suất chiếu trước 23h.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}