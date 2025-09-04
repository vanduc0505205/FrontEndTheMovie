import { Modal, Form, Input, DatePicker, InputNumber, Select, notification } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShowtime, updateShowtime, createShowtimeBatch } from "@/api/showtime.api";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
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
    const [selectedCinemaId, setSelectedCinemaId] = useState<string | undefined>(undefined);
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

    // Lọc phòng theo rạp đã chọn; phòng có thể có cinemaId dạng string hoặc object {_id}
    const filteredRooms = useMemo(() => {
        if (!selectedCinemaId) return rooms;
        return rooms.filter((r: any) => {
            const cid = typeof r.cinemaId === 'string' ? r.cinemaId : r.cinemaId?._id;
            return cid === selectedCinemaId;
        });
    }, [rooms, selectedCinemaId]);

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
            setSelectedCinemaId(initialData.cinemaId?._id);
        } else if (!open) {
            form.resetFields();
            setSelectedCinemaId(undefined);
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


    const handleFinish = async (values: any) => {
        const start = dayjs(values.startTime);
        const movieIdValue = values.movieId?.value ?? values.movieId;
        const cinemaIdValue = values.cinemaId?.value ?? values.cinemaId;

        if (isEdit) {
            // Chế độ chỉnh sửa: giữ nguyên chọn 1 phòng (roomId)
            const roomIdValue = values.roomId?.value ?? values.roomId;
            const payload = {
                movieId: movieIdValue,
                cinemaId: cinemaIdValue,
                roomId: roomIdValue,
                defaultPrice: values.defaultPrice,
                startTime: start.toISOString(),
            };
            mutationUpdate.mutate({ id: initialData._id, data: payload });
            return;
        }

        // Chế độ tạo mới: cho phép nhiều phòng (roomIds)
        const rawRoomIds = values.roomIds as any[];
        const roomIds: string[] = (rawRoomIds || []).map((r: any) => r?.value ?? r).filter(Boolean);
        if (!roomIds.length) {
            notification.error({
                message: "Thiếu phòng",
                description: "Vui lòng chọn ít nhất 1 phòng chiếu",
                placement: "topRight",
            });
            return;
        }

        try {
            const result = await createShowtimeBatch({
                movieId: movieIdValue,
                cinemaId: cinemaIdValue,
                roomIds,
                defaultPrice: values.defaultPrice,
                startTime: start.toISOString(),
            });

            // Làm tươi danh sách
            queryClient.invalidateQueries({ queryKey: ["showtimes"] });
            form.resetFields();

            const successCount = result.successes?.length || 0;
            const failureCount = result.failures?.length || 0;

            if (successCount > 0) {
                notification.success({
                    message: "Thành công",
                    description: `Đã tạo ${successCount} suất chiếu`,
                    placement: "topRight",
                });
            }
            if (failureCount > 0) {
                const reasons = result.failures
                    .slice(0, 5)
                    .map((f: any) => `Phòng ${f.roomId}: ${f.reason}`)
                    .join("; ");
                notification.warning({
                    message: "Một số phòng không tạo được",
                    description: `${failureCount} phòng lỗi. ${reasons}${result.failures.length > 5 ? '…' : ''}`,
                    placement: "topRight",
                });
            }

            onClose();
            onSuccess?.();
        } catch (error: any) {
            const { response } = error || {};
            const message = response?.data?.message || "Có lỗi xảy ra khi tạo hàng loạt";
            const failures = response?.data?.data?.failures;
            if (Array.isArray(failures) && failures.length) {
                const reasons = failures
                    .slice(0, 8)
                    .map((f: any) => `Phòng ${f.roomId}: ${f.reason}`)
                    .join("; ");
                notification.error({
                    message: "Không thể tạo suất chiếu cho các phòng",
                    description: `${failures.length} phòng lỗi. ${reasons}${failures.length > 8 ? '…' : ''}`,
                    placement: "topRight",
                });
            } else {
                notification.error({ message: "Thất bại", description: message, placement: "topRight" });
            }
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
                    <Select
                        placeholder="Chọn rạp"
                        loading={LoadingCinemas}
                        showSearch
                        optionFilterProp="children"
                        labelInValue
                        onChange={(val: any) => {
                            const value = val?.value ?? val;
                            setSelectedCinemaId(value);
                            // Reset chọn phòng khi đổi rạp
                            if (isEdit) {
                                form.setFieldsValue({ roomId: undefined });
                            } else {
                                form.setFieldsValue({ roomIds: [] });
                            }
                        }}
                    >
                        {allCinemas?.map((cinema: ICinema) => (
                            <Select.Option key={cinema._id} value={cinema._id}>
                                {cinema.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Phòng */}
                {isEdit ? (
                    <Form.Item
                        name="roomId"
                        label="Phòng"
                        rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
                    >
                        <Select placeholder="Chọn phòng" loading={loadingRooms} showSearch optionFilterProp="children" labelInValue>
                            {filteredRooms?.map((room: any) => (
                                <Select.Option key={room._id} value={room._id}>
                                    {room.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="roomIds"
                        label="Phòng (có thể chọn nhiều)"
                        rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 phòng" }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn phòng"
                            loading={loadingRooms}
                            showSearch
                            optionFilterProp="children"
                            labelInValue
                        >
                            {filteredRooms?.map((room: any) => (
                                <Select.Option key={room._id} value={room._id}>
                                    {room.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

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
