import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import { getNewsById } from "@/api/news.api";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  console.log("NewsDetail id:", id);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getNewsById(id!);
        console.log(data);
        
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
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-72 object-cover rounded-lg shadow-lg mb-6"
        />
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <p className="text-gray-400 mb-6">
          {new Date(news.createdAt).toLocaleDateString("vi-VN")} • {news.author}
        </p>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
