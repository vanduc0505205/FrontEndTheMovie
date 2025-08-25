import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import { getNewsById } from "@/api/news.api";

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const categoryMap: Record<string, string> = {
        movie: "Phim",
        promotion: "Khuyến mãi",
        event: "Sự kiện",
        other: "Khác"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getNewsById(id!);
                setNews(data);
            } catch (error) {
                message.error("Lỗi khi tải dữ liệu!");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!news) {
        return <p className="text-center text-gray-400">Không tìm thấy bài viết</p>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-4">
                    <img
                        src={news.image}
                        alt={news.coverAlt || news.title}
                        className="w-full h-72 object-cover rounded-lg shadow-lg"
                    />
                    {(news.imageCaption || news.coverAlt) && (
                        <p className="text-gray-400 text-sm mt-2">{news.imageCaption || news.coverAlt}</p>
                    )}
                </div>
                <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
                <div className="text-gray-400 mb-4 flex flex-wrap items-center gap-2">
                    <span>{new Date(news.createdAt).toLocaleDateString("vi-VN")}</span>
                    <span>•</span>
                    <span>{categoryMap[news.category] || "Khác"}</span>
                    {typeof news.views === 'number' && (
                        <>
                            <span>•</span>
                            <span>{news.views} lượt xem</span>
                        </>
                    )}
                    {news.sourceUrl && (
                        <>
                            <span>•</span>
                            <a href={news.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Nguồn</a>
                        </>
                    )}
                </div>
                {Array.isArray(news.tags) && news.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {news.tags.map((t: string) => (
                            <span key={t} className="bg-purple-600/30 text-purple-200 text-xs px-2 py-1 rounded-full">#{t}</span>
                        ))}
                    </div>
                )}
                <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />
            </div>
        </div>
    );
};

export default NewsDetail;
