import React, { useEffect, useState } from "react";
import { Table, Spin, message, Modal, Button, Input } from "antd";
import axios from "axios";

interface Contact {
  _id: string;
  title: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
  isReplied?: boolean;
}

const ContactAdmin: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/contact");
      const sortedContacts = res.data.data.sort(
        (a: Contact, b: Contact) => Number(a.isReplied) - Number(b.isReplied)
      );
      setContacts(sortedContacts);
    } catch (error) {
      message.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (contact: Contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
    setIsModalOpen(true);
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      message.warning("Vui lòng nhập nội dung trả lời");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/contact/${selectedContact?._id}/reply`,
        { reply: replyMessage }
      );
      message.success("Đã gửi phản hồi thành công");
      setIsModalOpen(false);

      setContacts((prev) =>
        prev
          .map((contact) =>
            contact._id === selectedContact?._id
              ? { ...contact, isReplied: true }
              : contact
          )
          .sort((a, b) => Number(a.isReplied) - Number(b.isReplied))
      );
    } catch (error) {
      message.error("Không thể gửi phản hồi");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Contact) =>
        record.isReplied ? (
          <span style={{ color: "#52c41a", fontWeight: 600 }}>✅ Đã trả lời</span>
        ) : (
          <Button
            type="primary"
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              color: "#fff",
              fontWeight: 500,
              borderRadius: 4,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            onClick={() => handleReply(record)}
          >
            ✉️ Trả lời
          </Button>
        ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "2rem", color: "#1f1f1f" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
        📬 Danh sách liên hệ
      </h2>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={contacts}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        />
      )}

      <Modal
        title={
          <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1f1f1f" }}>
            Trả lời liên hệ - {selectedContact?.name}
          </span>
        }
        open={isModalOpen}
        onOk={sendReply}
        onCancel={() => setIsModalOpen(false)}
        okText="📤 Gửi phản hồi"
        cancelText="Hủy"
        bodyStyle={{ backgroundColor: "#ffffff", color: "#1f1f1f" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <p>
            <b>Email khách:</b> {selectedContact?.email}
          </p>
        </div>
        <Input.TextArea
          rows={4}
          placeholder="Nhập nội dung trả lời..."
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          style={{
            borderRadius: "6px",
            borderColor: "#ccc",
            backgroundColor: "#fff",
            color: "#1f1f1f",
          }}
        />
      </Modal>
    </div>
  );
};

export default ContactAdmin;