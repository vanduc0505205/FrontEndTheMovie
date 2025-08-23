import React, { useEffect, useState } from "react";
import { Spin, message, Input } from "antd";
import axios from "axios";

interface Contact {
  _id: string;
  title: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  reply?: string;
  isReplied?: boolean;
}

const Notification: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [repliedContacts, setRepliedContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    fetchRepliedContacts();
  }, []);

  const fetchRepliedContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/contact");
      const replied = res.data.data.filter((c: Contact) => c.isReplied);
      setRepliedContacts(replied);
      setFilteredContacts(replied);
    } catch (error) {
      message.error("Không thể tải thông báo phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchEmail(value);
    const filtered = repliedContacts.filter((contact) =>
      contact.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "2rem" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem", color: "#333" }}>
        📣 Thông báo phản hồi liên hệ
      </h2>

      <Input.Search
        placeholder="🔍 Tìm theo email (gmail)..."
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        value={searchEmail}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: 400, marginBottom: "2rem" }}
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16rem" }}>
          <Spin size="large" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <p style={{ color: "#888", fontSize: "1rem" }}>Không tìm thấy phản hồi nào với email này.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                padding: "1.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#222" }}>{contact.title}</h3>
                <span style={{ fontSize: "1.25rem" }}>✅</span>
              </div>

              <div style={{ marginBottom: "0.75rem", color: "#444" }}>
                <strong>Người gửi:</strong> {contact.name} ({contact.email})
              </div>

              <div style={{ marginBottom: "0.75rem", color: "#444" }}>
                <strong>Nội dung liên hệ:</strong>
                <div style={{ backgroundColor: "#f0f0f0", padding: "0.75rem", borderRadius: "6px", marginTop: "0.25rem" }}>
                  {contact.message}
                </div>
              </div>

              <div style={{ marginBottom: "0.75rem", color: "#444" }}>
                <strong>Phản hồi:</strong>
                <div style={{ backgroundColor: "#e6f7ff", padding: "0.75rem", borderRadius: "6px", marginTop: "0.25rem" }}>
                  {contact.reply || "Đã trả lời nhưng nội dung trống"}
                </div>
              </div>

              <div style={{ fontSize: "0.875rem", color: "#888", textAlign: "right" }}>
                {new Date(contact.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
