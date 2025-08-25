import { useEffect, useMemo, useState } from "react";
import { Card, message, Spin, Input, Segmented, Pagination, Empty } from "antd";
import type { CSSProperties } from "react";
import { getAllNews } from "@/api/news.api";
import { INews } from "@/interface/news";
import { useNavigate } from "react-router-dom";

const NewsPage = () => {
  const [newsList, setNewsList] = useState<INews[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<INews["category"] | "all">("all");
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (q) params.q = q;
      if (category !== "all") params.category = category;
      const data = await getAllNews(params);
      setNewsList(data.list);
      setTotal(data.total);
    } catch (err) {
      message.error("Lỗi khi tải tin tức!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, limit, q, category]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featured = useMemo(() => newsList[0], [newsList]);
  const rest = useMemo(() => newsList.slice(1), [newsList]);

  return (
    <div
      style={{
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        padding: "48px 96px",
      }}
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#fff",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Tin tức
      </h1>

      <div style={{ display: "flex", gap: 16, justifyContent: "space-between", marginBottom: 24 }}>
        <Input.Search
          allowClear
          placeholder="Tìm bài viết, phim, khuyến mãi..."
          onSearch={(val) => { setPage(1); setQ(val.trim()); }}
          onChange={(e) => { if (!e.target.value) { setPage(1); setQ(""); } }}
          style={{ maxWidth: 420 }}
        />
        <Segmented
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Phim", value: "movie" },
            { label: "Khuyến mãi", value: "promotion" },
            { label: "Sự kiện", value: "event" },
            { label: "Khác", value: "other" },
          ]}
          value={category}
          onChange={(val) => { setPage(1); setCategory(val as any); }}
        />
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : newsList.length === 0 ? (
        <Empty description={<span style={{ color: '#aaa' }}>Không có bài viết</span>} style={{ margin: '48px 0' }} />
      ) : (
        <>
          {featured && (
            <div style={{ position: 'relative' }}>
              {(featured.isPinned || featured.isFeatured) && (
                <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, display: 'flex', gap: 8 }}>
                  {featured.isPinned && <span style={badgeStyle}>Pinned</span>}
                  {featured.isFeatured && <span style={{ ...badgeStyle, background: '#faad14' }}>Featured</span>}
                </div>
              )}
              <Card
                key={featured._id}
                hoverable
                style={{ ...cardStyle, marginBottom: 24 }}
                cover={<img src={featured.image} alt={featured.coverAlt || 'news'} style={{ ...imgStyle, height: 320 }} />}
                bodyStyle={{ backgroundColor: "#1a1a1a", color: "#fff" }}
                onClick={() => navigate(`/news/${featured._id}`)}
              >
                <p style={{ color: "#ccc", fontSize: 13 }}>
                  {new Date(featured.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <h2 style={{ ...titleStyle, fontSize: 22 }}>{featured.title}</h2>
                {featured.excerpt && (
                  <p style={{ color: '#ddd', marginTop: 8 }}>{featured.excerpt}</p>
                )}
              </Card>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {rest.map((news) => (
              <div key={news._id} style={{ position: 'relative' }}>
                {(news.isPinned || news.isFeatured) && (
                  <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, display: 'flex', gap: 6 }}>
                    {news.isPinned && <span style={badgeStyle}>Pinned</span>}
                    {news.isFeatured && <span style={{ ...badgeStyle, background: '#faad14' }}>Featured</span>}
                  </div>
                )}
                <Card
                  hoverable
                  style={cardStyle}
                  cover={<img src={news.image} alt={news.coverAlt || 'news'} style={imgStyle} />}
                  bodyStyle={{ backgroundColor: "#1a1a1a", color: "#fff" }}
                  onClick={() => navigate(`/news/${news._id}`)}
                >
                  <p style={{ color: "#ccc", fontSize: 13 }}>
                    {new Date(news.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <h3 style={titleStyle}>{news.title}</h3>
                  {news.excerpt && (
                    <p style={{ color: '#ddd', marginTop: 6 }}>{news.excerpt}</p>
                  )}
                </Card>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              showSizeChanger
              onChange={(p, ps) => { setPage(p); setLimit(ps); }}
              showTotal={(t) => `${t} bài viết`}
            />
          </div>
        </>
      )}
    </div>
  );
};

const cardStyle: CSSProperties = {
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "#1a1a1a",
  border: "none",
  cursor: "pointer",
};

const imgStyle: CSSProperties = {
  height: 180,
  objectFit: "cover",
  width: "100%",
};

const titleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: "#fff",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const badgeStyle: CSSProperties = {
  background: '#722ed1',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
};

export default NewsPage;
