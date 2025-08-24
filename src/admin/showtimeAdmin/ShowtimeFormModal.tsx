import { Modal, Form, Input, DatePicker, InputNumber, Select, notification } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShowtime, updateShowtime } from "@/api/showtime.api";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { getAllMoviesSimple } from '@/api/movie.api';
import { getRooms } from '@/api/room.api';
import axios from "axios";
import { IMovie } from "@/interface/movie";
import { ICinema } from "@/interface/cinema";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: any;
}

const ShowtimeFormModal = ({ open, onClose, onSuccess, initialData }: Props) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const isEdit = !!initialData;

    const { data: movies = [], isLoading: loadingMovies } = useQuery<any>({
        queryKey: ['movie'],
        queryFn: getAllMoviesSimple,
    });

    const { data: allCinemas, isLoading: LoadingCinemas } = useQuery({
        queryKey: ['cinemas-all'],
        queryFn: async (): Promise<ICinema[]> => {
            const { data } = await axios.get('http://localhost:3000/cinema');
            return data.data;
        },
    });

    const { data: rooms = [], isLoading: loadingRooms } = useQuery<any>({
        queryKey: ['room'],
        queryFn: getRooms,
    });

    useEffect(() => {
        const optionsLoaded = !loadingMovies && !LoadingCinemas && !loadingRooms;
        if (open && initialData && optionsLoaded) {
            form.setFieldsValue({
                movieId: initialData.movieId
                    ? { value: initialData.movieId._id, label: initialData.movieId.title }
                    : undefined,
                cinemaId: initialData.cinemaId
                    ? { value: initialData.cinemaId._id, label: initialData.cinemaId.name }
                    : undefined,
                roomId: initialData.roomId
                    ? { value: initialData.roomId._id, label: initialData.roomId.name }
                    : undefined,
                defaultPrice: initialData.defaultPrice,
                startTime: initialData.startTime ? dayjs(initialData.startTime) : undefined,
            });
        } else if (!open) {
            form.resetFields();
        }
    }, [open, initialData, form, loadingMovies, LoadingCinemas, loadingRooms]);

    const mutationCreate = useMutation({
        mutationFn: createShowtime,
        onError: (error: any) => {
            const { response } = error;
            if (Array.isArray(response?.data?.errors)) {
                response.data.errors.forEach((err: string) => {
                    notification.error({
                        message: "Lỗi dữ liệu",
                        description: err,
                        placement: "topRight",
                    });
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: response?.data?.message || "Có lỗi xảy ra",
                    placement: "topRight",
                });
            }
        },
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
        onError: (error: any) => {
            const { response } = error;
            if (Array.isArray(response?.data?.errors)) {
                response.data.errors.forEach((err: string) => {
                    notification.error({
                        message: "Lỗi dữ liệu",
                        description: err,
                        placement: "topRight",
                    });
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: response?.data?.message || "Có lỗi xảy ra",
                    placement: "topRight",
                });
            }
        },
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
        const start = dayjs(values.startTime);
        const movieIdValue = values.movieId?.value ?? values.movieId;
        const cinemaIdValue = values.cinemaId?.value ?? values.cinemaId;
        const roomIdValue = values.roomId?.value ?? values.roomId;
        const movie = movies.find((m: IMovie) => m._id === movieIdValue);
        const duration = movie?.duration || 0;
        const end = start.add(duration, 'minute');
        const payload = {
            movieId: movieIdValue,
            cinemaId: cinemaIdValue,
            roomId: roomIdValue,
            defaultPrice: values.defaultPrice,
            startTime: start.toISOString(),
        };
        if (isEdit) {
            mutationUpdate.mutate({ id: initialData._id, data: payload });
        } else {
            mutationCreate.mutate(payload);
        }
    };



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
                {/* Phim */}
                <Form.Item
                    name="movieId"
                    label="Phim"
                    rules={[{ required: true, message: "Vui lòng chọn phim" }]}
                >
                    <Select placeholder="Chọn phim" loading={loadingMovies} showSearch optionFilterProp="children" labelInValue>
                        {movies?.map((movie: IMovie) => (
                            <Select.Option key={movie._id} value={movie._id}>
                                {movie.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Rạp */}
                <Form.Item
                    name="cinemaId"
                    label="Rạp"
                    rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
                >
                    <Select placeholder="Chọn rạp" loading={LoadingCinemas} showSearch optionFilterProp="children" labelInValue>
                        {allCinemas?.map((cinema: ICinema) => (
                            <Select.Option key={cinema._id} value={cinema._id}>
                                {cinema.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Phòng */}
                <Form.Item
                    name="roomId"
                    label="Phòng"
                    rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
                >
                    <Select placeholder="Chọn phòng" loading={loadingRooms} showSearch optionFilterProp="children" labelInValue>
                        {rooms?.map((room) => (
                            <Select.Option key={room._id} value={room._id}>
                                {room.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Thời gian bắt đầu */}
                <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[
                        { required: true, message: "Vui lòng chọn thời gian bắt đầu" },
                        {
                            validator(_, value) {
                                if (!value) return Promise.resolve();
                                const now = new Date();
                                if (value.toDate() < now) {
                                    return Promise.reject(new Error("Không được chọn thời gian trong quá khứ"));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        className="w-full"
                        placeholder="Chọn thời gian chiếu"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </Form.Item>

                {/* Giá vé */}
                <Form.Item
                    name="defaultPrice"
                    label="Giá vé"
                    rules={[{ required: true, message: "Vui lòng chọn giá vé" }]}
                >
                    <Select placeholder="Chọn giá vé">
                        {/* <Select.Option value={80000}>80.000 VNĐ</Select.Option> */}
                        <Select.Option value={100000}>100.000 VNĐ</Select.Option>
                        {/* <Select.Option value={120000}>120.000 VNĐ</Select.Option> */}
                        <Select.Option value={150000}>150.000 VNĐ</Select.Option>
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ShowtimeFormModal;
