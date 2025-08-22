import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { INews } from "@/interface/news";
import { getAllNews, deleteNews, updateNews } from "@/api/news.api";
import NewsFormModal from "./NewsFormModal";

export default function NewsList() {
    const [newsList, setNewsList] = useState<INews[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<INews | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const data = await getAllNews();
            setNewsList(data);
        } catch (err) {
            message.error("Lỗi khi tải danh sách tin tức!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const categoryOptions = [
        { label: "Phim", value: "movie" },
        { label: "Khuyến mãi", value: "promotion" },
        { label: "Sự kiện", value: "event" },
        { label: "Khác", value: "other" },
    ];

    const handleDelete = async (id: string) => {
        try {
            await deleteNews(id);
            message.success("Xóa tin tức thành công!");
            fetchNews();
        } catch (err) {
            message.error("Xóa thất bại!");
        }
    };

    const openModal = (news?: INews) => {
        setEditingNews(news || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNews(null);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Quản lý tin tức</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Thêm tin tức
                </Button>
            </div>

            <Table
                rowKey="_id"
                loading={loading}
                dataSource={newsList}
                columns={[
                    { title: "Tiêu đề", dataIndex: "title", key: "title" },
                    {
                        title: "Nội dung",
                        dataIndex: "content",
                        key: "content",
                        render: (text: string) => (
                            <span>{text.length > 50 ? text.substring(0, 50) + "..." : text}</span>
                        )
                    },
                    {
                        title: "Ảnh",
                        dataIndex: "image",
                        key: "image",
                        render: (url: string) => (
                            <div className="w-32 aspect-video overflow-hidden rounded">
                                <img
                                    src={url}
                                    alt="news"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )
                    },
                    {
                        title: "Danh mục",
                        dataIndex: "category",
                        key: "category",
                        render: (value: string) => {
                            const found = categoryOptions.find(opt => opt.value === value);
                            return found ? found.label : value;
                        },
                    },
                    {
                        title: "Trạng thái",
                        dataIndex: "status",
                        key: "status",
                        render: (status: string, record: any) => (
                            <Switch
                                checked={status === "published"}
                                checkedChildren="Xuất bản"
                                unCheckedChildren="Nháp"
                                onChange={async (checked) => {
                                    try {
                                        const newStatus = checked ? "published" : "draft";
                                        await updateNews(record._id, { status: newStatus });

                                        // ✅ Cập nhật local state để Table render lại
                                        setNewsList((prev) =>
                                            prev.map((item) =>
                                                item._id === record._id ? { ...item, status: newStatus } : item
                                            )
                                        );

                                        message.success("Cập nhật trạng thái thành công!");
                                    } catch (err) {
                                        message.error("Lỗi khi cập nhật trạng thái!");
                                    }
                                }}
                            />
                        )
                    },
                    {
                        title: "Ngày tạo",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (d: string) => new Date(d).toLocaleDateString("vi-VN")
                    },
                    {
                        title: "Hành động",
                        key: "actions",
                        render: (_, record: INews) => (
                            <div className="flex gap-2">
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => openModal(record)}
                                >
                                    Sửa
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc muốn xóa?"
                                    onConfirm={() => handleDelete(record._id!)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger icon={<DeleteOutlined />}>
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            </div>
                        ),
                    },
                ]}
            />
            {/* Modal Form */}
            {isModalOpen && (
                <NewsFormModal
                    open={isModalOpen}
                    onCancel={closeModal}
                    onSuccess={fetchNews}
                    editingNews={editingNews}
                />
            )}
        </div>
    );
}
