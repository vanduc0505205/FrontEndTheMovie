import { useEffect, useState } from "react";
import { User, Mail, Lock, Save, Film, Star, Calendar, Ticket } from "lucide-react";
import { message } from "antd";
import { getUserById, updateProfile } from "@/api/user.api";
import { uploadImage } from "@/api/upload.api";
import { getUserFromLocalStorage } from "@/lib/auth";
import { getUserBookings } from "@/api/booking.api";
import { Link, useNavigate } from "react-router-dom";

type UIUser = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  avatar?: string;
  memberSince?: string;
  totalTickets?: number;
  favoriteGenre?: string;
  points?: number;
};

export default function UserProfile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [user, setUser] = useState<UIUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [ticketsThisMonth, setTicketsThisMonth] = useState<number>(0);
  const [isOAuthAccount, setIsOAuthAccount] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = getUserFromLocalStorage();
        const id = stored?.id || stored?._id;
        if (!id) {
          setLoading(false);
          message.warning("Bạn chưa đăng nhập");
          return;
        }
        const data = await getUserById(id);
        const uiUser: UIUser = {
          _id: data._id,
          id: data._id,
          username: data.username,
          email: data.email,
          avatar: data.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          memberSince: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : undefined,
          totalTickets: 0,
          favoriteGenre: "—",
          points: 0,
        };

        setIsOAuthAccount(!!data.googleId);

        try {
          const res = await getUserBookings(uiUser.id!);
          const bookings = res.data?.bookings || [];
          const totalTickets = bookings
            .filter((b: any) => b.status === "paid")
            .reduce((sum: number, b: any) => sum + (b.seatList?.length || 0), 0);

          const now = new Date();
          const thisMonthTickets = bookings
            .filter((b: any) => b.status === "paid")
            .filter((b: any) => {
              const d = new Date(b.createdAt);
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum: number, b: any) => sum + (b.seatList?.length || 0), 0);

          const genreCount: Record<string, number> = {};
          for (const b of bookings) {
            if (b.status !== "paid") continue;
            const categories: any[] = b?.showtimeId?.movieId?.categories || [];
            for (const c of categories) {
              const name = c?.categoryName;
              if (!name) continue;
              genreCount[name] = (genreCount[name] || 0) + 1;
            }
          }
          const favoriteGenre = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name)[0] || "—";

          setTicketsThisMonth(thisMonthTickets);
          setUser({ ...uiUser, totalTickets, favoriteGenre });
          setFormData({ username: uiUser.username, email: uiUser.email });
        } catch (e) {
          setUser(uiUser);
          setFormData({ username: uiUser.username, email: uiUser.email });
        }
      } catch (err: any) {
        message.error(err?.message || "Không lấy được thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      if (!user?.id && !user?._id) return;
      const id = (user.id || user._id) as string;
      await updateProfile(id, { username: formData.username });
      setUser({ ...(user as UIUser), ...formData });
      // Đồng bộ localStorage và thông báo Header cập nhật ngay
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsed, username: formData.username })
          );
          window.dispatchEvent(new Event("login-success"));
        }
      } catch {}
      setIsEditing(false);
      message.success("Cập nhật thành công!");
    } catch (err: any) {
      message.error(err?.message || "Cập nhật thất bại");
    }
  };

  // Upload và cập nhật avatar (đặt ở cấp component)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!user?.id && !user?._id) return;
      const id = (user.id || user._id) as string;

      message.loading({ content: "Đang tải ảnh...", key: "avatar" });
      const url = await uploadImage(file as any);
      await updateProfile(id, { avatar: url });
      setUser({ ...(user as UIUser), avatar: url });
      // Đồng bộ localStorage và phát sự kiện để Header cập nhật ngay
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem("user", JSON.stringify({ ...parsed, avatar: url }));
          window.dispatchEvent(new Event("login-success"));
        }
      } catch {}
      message.success({ content: "Cập nhật avatar thành công", key: "avatar" });
    } catch (err: any) {
      message.error(err?.message || "Cập nhật avatar thất bại");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Điều hướng sang trang đổi mật khẩu
  const handleGoChangePassword = () => navigate("/change-password");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <p className="text-white">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <p className="text-white">Không có thông tin người dùng</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-20 px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <Film className="absolute top-20 right-1/3 w-16 h-16 text-white opacity-5 animate-spin" style={{ animationDuration: "20s" }} />
        <Ticket className="absolute bottom-40 right-10 w-12 h-12 text-white opacity-10 animate-bounce" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-gray-300">Quản lý thông tin cá nhân của bạn</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="relative group">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-xl group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/20 to-pink-400/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/80 text-black text-xs font-semibold px-3 py-1 rounded-full cursor-pointer shadow hover:bg-white">
                  Đổi ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">Thành viên VIP</span>
                </div>
                <p className="text-gray-300">Thành viên từ {user.memberSince || "—"}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-xl bg-white/10 border-2 text-white placeholder-gray-400 transition-all duration-300 ${
                    isEditing
                      ? "border-yellow-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20"
                      : "border-white/20"
                  } ${!isEditing && "cursor-not-allowed opacity-70"}`}
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email (không thể chỉnh sửa tại đây)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={true}
                  className={`w-full p-4 rounded-xl bg-white/10 border-2 text-white placeholder-gray-400 transition-all duration-300 ${
                    isEditing
                      ? "border-yellow-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20"
                      : "border-white/20"
                  } ${!isEditing && "cursor-not-allowed opacity-70"}`}
                  placeholder="Email của bạn"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Chỉnh sửa thông tin
                    </button>
                    <button
                      onClick={handleGoChangePassword}
                      className="flex-1 bg-white/10 border-2 border-white/30 text-white font-bold py-4 px-6 rounded-xl hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Đổi mật khẩu
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Lưu thay đổi
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-white/10 border-2 border-white/30 text-white font-bold py-4 px-6 rounded-xl hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300"
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-black shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Điểm thưởng</h3>
                <Star className="w-8 h-8 fill-current" />
              </div>
              <p className="text-3xl font-bold">{user.points ?? 0}</p>

              <p className="text-sm opacity-80 mt-2">Có thể đổi quà tặng</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-6">Thống kê</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-pink-400" />
                    <span className="text-gray-300">Vé đã mua</span>
                  </div>
                  <span className="text-white font-bold">{user.totalTickets ?? 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Film className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Thể loại yêu thích</span>
                  </div>
                  <span className="text-white font-bold">{user.favoriteGenre || "—"}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Tháng này</span>
                  </div>
                  <span className="text-white font-bold">{ticketsThisMonth} vé</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Link to="/lichsudatve">
                <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300">
                  Lịch sử đặt vé
                </button>
                </Link>
                <button
                  className="w-full p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-black font-semibold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300"
                >
                  Ưu đãi của tôi
                </button>
                <button
                  className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300"
                >
                  Đổi điểm thưởng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}