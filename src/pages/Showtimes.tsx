import { useEffect, useMemo, useState } from "react";
import { Spin, Tag, Card, Empty } from "antd";
import dayjs from "dayjs";
import { IShowtime } from "@/interface/showtime";
import { IMovie } from "@/interface/movie";
import { getShowtimes } from "@/api/showtime.api";
import { getMovieById } from "@/api/movie.api";
import { useNavigate } from "react-router-dom";

const isObjectId = (v: string) => /^[a-fA-F0-9]{24}$/.test(v);
const extractMovieId = (s: IShowtime): string | undefined => {
  const mv: any = (s as any).movieId;
  if (!mv) return undefined;
  return typeof mv === "string" ? mv : mv._id;
};

const Showtime = () => {
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [movies, setMovies] = useState<Record<string, IMovie>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSelectShowtime = (s: IShowtime) => {
    navigate(
      `/phim/${(s as any).movieId._id}/selectSeat?roomId=${(s as any).roomId._id}&showtimeId=${s._id}&userId=${user.id}`,
      { state: { showtime: s } }
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getShowtimes();
        setShowtimes(data);

        const ids = Array.from(
          new Set(
            data.map(extractMovieId).filter((id): id is string => !!id && isObjectId(id))
          )
        );
        const moviesArr = await Promise.all(
          ids.map(async (id) => {
            try {
              return await getMovieById(id);
            } catch {
              return undefined;
            }
          })
        );

        const map: Record<string, IMovie> = {};
        moviesArr.forEach((m) => { if (m?._id) map[m._id] = m; });
        setMovies(map);
      } catch (e) {
        console.error("Lỗi load showtime:", e);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(
    () => showtimes.filter(s => dayjs(s.startTime).format("YYYY-MM-DD") === selectedDate),
    [showtimes, selectedDate]
  );

  const groupedByMovie: Record<string, IShowtime[]> = useMemo(() => {
    return filtered.reduce((acc: Record<string, IShowtime[]>, s) => {
      const id = extractMovieId(s);
      if (!id) return acc;
      if (!acc[id]) acc[id] = [];
      acc[id].push(s);
      return acc;
    }, {});
  }, [filtered]);

  const days = Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day").format("YYYY-MM-DD"));

  if (loading) return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
      <Spin size="large" />
    </div>
  );

  const movieEntries = Object.entries(groupedByMovie);

  return (
    <div className="bg-gray-900 min-h-screen pt-20 px-6 sm:px-12 lg:px-20 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">🎬 Lịch chiếu</h1>

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`px-4 py-2 rounded-xl transition ${selectedDate === d
              ? "bg-blue-600 text-white font-semibold"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 shadow"
              }`}
          >
            {dayjs(d).format("DD/MM")}
          </button>
        ))}
      </div>
      <div className="text-red-500 text-sm text-center mb-8">
        ⚠️ Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.
      </div>

      {movieEntries.length === 0 ? (
        <Empty description="Không có lịch chiếu cho ngày này" className="text-gray-400" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {movieEntries.map(([movieId, times]) => {
            const fallbackMovieObj = (times[0] as any)?.movieId as any;
            const movie = movies[movieId] || (typeof fallbackMovieObj === "object" ? fallbackMovieObj : undefined);

            return (
              <Card
                key={movieId}
                className="bg-gray-800 rounded-2xl shadow-md p-0 transition"
                styles={{
                  body: { padding: 0 },
                }}
              >
                <div className="flex flex-row items-center gap-4 p-4">

                  <div className="flex-shrink-0 w-32 h-48 overflow-hidden rounded-lg">
                    <img
                      src={movie?.poster || "https://via.placeholder.com/200x300"}
                      alt={movie?.title || "Poster"}
                      className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white">{movie?.title || "Không rõ tên phim"}</h2>
                    {movie?.director && <p className="text-gray-300 text-sm">Đạo diễn: {movie.director}</p>}
                    {movie?.actors && <p className="text-gray-300 text-sm">Diễn viên: {Array.isArray(movie.actors) ? movie.actors.join(", ") : movie.actors}</p>}
                    {movie?.duration && <p className="text-gray-300 text-sm">Thời lượng: {movie.duration} phút</p>}
                    {movie?.language && <p className="text-gray-300 text-sm">Xuất xứ: {movie.language}</p>}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {times.map(t => {
                        const isPast = dayjs(t.startTime).isBefore(dayjs());

                        return (
                          <Tag
                            key={(t as any)._id}
                            color={isPast ? "default" : "cyan"} // suất đã qua thì xám
                            className={`px-3 py-1 text-sm rounded-lg ${isPast ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"
                              }`}
                            onClick={() => {
                              if (!isPast) handleSelectShowtime(t); // chỉ cho click khi chưa qua
                            }}
                          >
                            {dayjs(t.startTime).format("HH:mm")}
                          </Tag>
                        );
                      })}
                    </div>


                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Showtime;
