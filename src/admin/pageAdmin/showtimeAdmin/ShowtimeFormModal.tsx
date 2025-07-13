import { Modal, Form, Input, DatePicker, InputNumber, Select, notification } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShowtime, updateShowtime } from "@/api/showtime.api";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/api/movie.api';
import { getCinemas } from '@/api/cinema.api';
import { getRooms } from '@/api/room.api';

const { RangePicker } = DatePicker;

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: any; // hoặc dùng IShowtime nếu có kiểu
}

const ShowtimeFormModal = ({ open, onClose, onSuccess, initialData }: Props) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const isEdit = !!initialData;

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue({
                movieId: initialData.movieId?._id,
                cinemaId: initialData.cinemaId?._id,
                roomId: initialData.roomId?._id,
                defaultPrice: initialData.defaultPrice,
                timeRange: [
                    dayjs(initialData.startTime),
                    dayjs(initialData.endTime)
                ]
            });
        } else {
            form.resetFields();
        }
    }, [open, initialData]);

    const mutationCreate = useMutation({
        mutationFn: createShowtime,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["showtimes"] });
            form.resetFields();
            notification.success({
                message: "Thành công",
                description: "Suất chiếu đã được thêm!",
                placement: "topRight",
            });
            onClose();
            onSuccess?.();
        },
    });

    const mutationUpdate = useMutation({
        mutationFn: ({ id, data }: any) => updateShowtime(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["showtimes"] });
            form.resetFields();
            notification.success({
                message: "Thành công",
                description: "Suất chiếu đã sửa!",
                placement: "topRight",
            });
            onClose();
            onSuccess?.();
        },
    });


    const handleFinish = (values: any) => {
        const start = values.startTime;

        const payload = {
            movieId: values.movieId,
            cinemaId: values.cinemaId,
            roomId: values.roomId,
            defaultPrice: values.defaultPrice,
            startTime: start.toISOString()
        };

        if (isEdit) {
            mutationUpdate.mutate({ id: initialData._id, data: payload });
        } else {
            mutationCreate.mutate(payload);
        }
    };

    const { data: movies = [], isLoading: loadingMovies } = useQuery<any>({
        queryKey: ['movie'],
        queryFn: getMovies,
    });

    const { data: cinemas = [], isLoading: loadingCinemas } = useQuery<any>({
        queryKey: ['cinema'],
        queryFn: getCinemas,
    });

    const { data: rooms = [], isLoading: loadingRooms } = useQuery<any>({
        queryKey: ['room'],
        queryFn: getRooms,
    });

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa suất chiếu" : "Thêm suất chiếu mới"}
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={mutationCreate.isPending || mutationUpdate.isPending}
            okText={isEdit ? "Cập nhật" : "Thêm mới"}
        >
            <Form layout="vertical" form={form} onFinish={handleFinish}>
                <Form.Item name="movieId" label="Phim" rules={[{ required: true }]}>
                    <Select placeholder="Chọn phim" loading={loadingMovies}>
                        {movies?.list?.map((movie: any) => (
                            <Select.Option key={movie._id} value={movie._id}>
                                {movie.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="cinemaId" label="Rạp" rules={[{ required: true }]}>
                    <Select placeholder="Chọn rạp" loading={loadingCinemas}>
                        {cinemas?.data?.map((cinema) => (
                            <Select.Option key={cinema._id} value={cinema._id}>
                                {cinema.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="roomId" label="Phòng" rules={[{ required: true }]}>
                    <Select placeholder="Chọn phòng" loading={loadingRooms}>
                        {rooms?.map((room) => (
                            <Select.Option key={room._id} value={room._id}>
                                {room.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[{ required: true }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        className="w-full"
                        placeholder="Chọn thời gian chiếu"
                    />
                </Form.Item>


                <Form.Item
                    name="defaultPrice"
                    label="Giá vé mặc định"
                    rules={[{ required: true }]}
                >
                    <Select placeholder="Chọn giá vé">
                        <Select.Option value={100000}>100.000 VND</Select.Option>
                        <Select.Option value={150000}>150.000 VND</Select.Option>
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ShowtimeFormModal;
