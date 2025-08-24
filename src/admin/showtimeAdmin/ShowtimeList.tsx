import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getShowtimes, deleteShowtime } from "@/api/showtime.api";
import ShowtimeFormModal from "./ShowtimeFormModal";
import { IShowtime } from "@/interface/showtime";
import { getAllMoviesSimple } from "@/api/movie.api";
import { getRooms } from "@/api/room.api";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { IMovie } from "@/interface/movie";
import { ICinema } from "@/interface/cinema";

const ShowtimeList = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery<IShowtime[]>({
    queryKey: ["showtimes"],
    queryFn: getShowtimes,
  });

  const { data: movies = [], isLoading: loadingMovies } = useQuery<IMovie[]>({
    queryKey: ["movie"],
    queryFn: getAllMoviesSimple,
  });

  const getAllCinemas = async (): Promise<ICinema[]> => {
    const { data } = await axios.get("http://localhost:3000/cinema");
    return data.data;
  };

  const { data: cinemas = [], isLoading: loadingCinemas } = useQuery<ICinema[]>({
    queryKey: ["cinemas-all"],
    queryFn: getAllCinemas,
  });

  const { data: rooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: ["room"],
    queryFn: getRooms,
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<IShowtime | null>(null);

  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [movieId, setMovieId] = useState<string | undefined>();
  const [cinemaId, setCinemaId] = useState<string | undefined>();
  const [roomId, setRoomId] = useState<string | undefined>();
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearchTitle(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filteredData = useMemo(() => {
    const filtered = (data || []).filter((st) => {
      const title = st.movieId?.title || "";
      if (searchTitle && !title.toLowerCase().includes(searchTitle.toLowerCase())) {
        return false;
      }
      if (movieId && st.movieId?._id !== movieId) return false;
      if (cinemaId && st.cinemaId?._id !== cinemaId) return false;
      if (roomId && st.roomId?._id !== roomId) return false;
      if (timeRange) {
        const start = dayjs(st.startTime);
        if (start.isBefore(timeRange[0], "minute") || start.isAfter(timeRange[1], "minute")) {
          return false;
        }
      }
      return true;
    });
    return filtered.sort((a, b) => {
      const aTime = dayjs(a.createdAt || a.startTime).valueOf();
      const bTime = dayjs(b.createdAt || b.startTime).valueOf();
      return bTime - aTime;
    });
  }, [data, searchTitle, movieId, cinemaId, roomId, timeRange]);

  const mutationDelete = useMutation({
    mutationFn: (id: string) => deleteShowtime(id),
    onSuccess: () => {
      message.success("🗑️ Đã xoá suất chiếu");
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
    onError: () => {
      message.error("❌ Xoá thất bại");
    },
  });

  const handleAdd = () => {
    setSelectedShowtime(null);
    setModalOpen(true);
  };

  const handleEdit = (record: IShowtime) => {
    setSelectedShowtime(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    mutationDelete.mutate(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedShowtime(null);
  };

  const columns = [
    {
      title: "Phim",
      dataIndex: ["movieId", "title"],
      key: "movie",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Rạp",
      dataIndex: ["cinemaId", "name"],
      key: "cinema",
    },
    {
      title: "Phòng",
      dataIndex: ["roomId", "name"],
      key: "room",
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: any, record: IShowtime) => {
        const start = dayjs(record.startTime);
        const computedEnd = record.endTime
          ? dayjs(record.endTime)
          : start.add((record as any)?.movieId?.duration || 0, "minute");
        return (
          <div className="flex flex-col">
            <span>
              ⏰ {start.format("HH:mm")} - {computedEnd.format("HH:mm")}
            </span>
            <span>📅 {start.format("DD/MM/YYYY")}</span>
          </div>
        );
      },
    },
    {
      title: "Giá vé",
      dataIndex: "defaultPrice",
      key: "price",
      render: (value: number) => <Tag color="blue">{value.toLocaleString()} VND</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IShowtime) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn xoá suất chiếu này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Danh sách suất chiếu</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #eef2f7', borderRadius: 12, padding: 12 }}>
          <Space wrap size={[10, 10]}>
            <Input
              placeholder="🔎 Tìm theo tên phim"
              allowClear
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ width: 220 }}
            />
            <Select
              placeholder="🎬 Chọn phim"
              allowClear
              showSearch
              optionFilterProp="label"
              loading={loadingMovies}
              options={movies.map((m) => ({ label: m.title, value: m._id }))}
              value={movieId}
              onChange={(v) => setMovieId(v)}
              style={{ width: 220 }}
            />
            <Select
              placeholder="🏢 Chọn rạp"
              allowClear
              showSearch
              optionFilterProp="label"
              loading={loadingCinemas}
              options={cinemas.map((c) => ({ label: c.name, value: c._id }))}
              value={cinemaId}
              onChange={(v) => setCinemaId(v)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="🏟️ Chọn phòng"
              allowClear
              showSearch
              optionFilterProp="label"
              loading={loadingRooms}
              options={rooms.map((r: any) => ({ label: r.name, value: r._id }))}
              value={roomId}
              onChange={(v) => setRoomId(v)}
              style={{ width: 180 }}
            />
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              onChange={(range) => setTimeRange(range as any)}
            />
            <Button onClick={() => {
              setSearchTitle("");
              setSearchInput("");
              setMovieId(undefined);
              setCinemaId(undefined);
              setRoomId(undefined);
              setTimeRange(null);
            }}>
              Xoá bộ lọc
            </Button>
          </Space>
        </div>
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
        bordered
      />

      <ShowtimeFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedShowtime}
        onSuccess={handleCloseModal}
      />
    </div>
  );
};

export default ShowtimeList;
