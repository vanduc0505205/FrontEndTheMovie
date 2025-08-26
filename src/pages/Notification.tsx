import React, { useEffect, useState } from "react";
import { message } from "antd";
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
  const [repliedContacts, setRepliedContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const uidString = localStorage.getItem("user");
    if (uidString) {
      const uidObj = JSON.parse(uidString);
      setUserId(uidObj._id);
      fetchRepliedContacts(uidObj._id);
    }
  }, []);

  const fetchRepliedContacts = async (uid: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/contact/user/${uid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
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
    <section className="py-20 min-h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-600/15 text-red-500">📣</span>
            Thông báo phản hồi
          </h2>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <svg className="h-10 w-10 animate-spin text-red-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-gray-300">
            Không tìm thấy phản hồi nào với email này.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredContacts.map((contact) => (
<article
                key={contact._id}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-2xl transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
              >
                <header className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-base font-semibold text-white">{contact.title}</h3>
                  <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-1 text-sm text-emerald-400 ring-1 ring-emerald-500/20">Đã phản hồi</span>
                </header>

                <div className="mb-3 text-sm text-gray-300">
                  <span className="font-medium text-white">Người gửi:</span> {contact.name} ({contact.email})
                </div>

                <div className="mb-3">
                  <div className="mb-1 text-sm font-medium text-white">Nội dung liên hệ</div>
                  <div className="rounded-md bg-black/20 border border-white/10 p-3 text-sm text-gray-300">
                    {contact.message}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-1 text-sm font-medium text-white">Phản hồi</div>
                  <div className="rounded-md border border-red-600/30 bg-red-600/10 p-3 text-sm text-white">
                    {contact.reply || "Đã trả lời nhưng nội dung trống"}
                  </div>
                </div>

                <footer className="flex items-center justify-between text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Trạng thái: phản hồi
                  </span>
                  <time>{new Date(contact.createdAt).toLocaleString("vi-VN")}</time>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notification;