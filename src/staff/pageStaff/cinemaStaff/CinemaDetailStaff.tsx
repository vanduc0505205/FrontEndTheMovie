import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCinemaById } from "@/api/cinema.api";
import { Card, Button, Spin } from "antd";

const CinemaDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: cinema, isLoading } = useQuery({
    queryKey: ["cinema", id],
    queryFn: () => getCinemaById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Spin tip="Đang tải thông tin..." />;

  if (!cinema) return <p>Không tìm thấy rạp</p>;

  return (
    <Card title="Thông tin Rạp Chiếu" className="max-w-xl mx-auto mt-8">
      <p><strong>Tên rạp:</strong> {cinema.name}</p>
      <p><strong>Địa chỉ:</strong> {cinema.address}</p>
      <p><strong>Ngày tạo:</strong> {new Date(cinema.createdAt).toLocaleString()}</p>
      <Button type="primary" className="mt-4" onClick={() => navigate("/staff/cinemas")}>
        Quay lại danh sách
      </Button>
    </Card>
  );
};

export default CinemaDetailStaff;
