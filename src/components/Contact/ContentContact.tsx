import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import backgroundImage from "@/assets/images/contact/backGroundContact.png";
import backgroundImageMobile from "@/assets/images/contact/bg-about-us-info-mobile.png";

const ContentContact = () => {
  const [form, setForm] = useState({
    title: "Ông",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const titles = ["Ông", "Bà", "Công ty"];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObj = JSON.parse(userString);
      setUserId(userObj._id); 
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userId
          ? JSON.stringify({ ...form, userId })
          : JSON.stringify({ ...form }),
        
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
        setForm({ title: "Ông", name: "", phone: "", email: "", message: "" });
      } else {
        setError(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={backgroundImageMobile} />
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover opacity-100"
          />
        </picture>
      </div>
      <div className="absolute inset-0 z-[1] lg:bg-custom-layered"></div>
      <div className="container py-10 lg:py-20 relative z-10 px-4">
        <div className="lg:bg-none lg:bg-transparent bg-contact-info p-4 lg:p-0">
          <div className="grid lg:grid-cols-2 gap-10 mb-10 items-stretch">
            {/* Left content */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <h1 className="text-4xl md:text-5xl text-main-color-100 font-bold mb-6 leading-tight">
                  Hãy cùng tạo nên kiệt tác điện ảnh!
                </h1>
                <div className="space-y-4 text-sm text-main-color-50 leading-relaxed">
                  <p>
                    Bạn có ý tưởng phim hay, kịch bản hấp dẫn hay đơn giản là mong muốn
                    hợp tác sản xuất phim chất lượng cao?
                  </p>
                  <p>
                    Đội ngũ ALPHACINEMA luôn tìm kiếm những cơ hội hợp tác mới, những ý tưởng
                    sáng tạo và những đối tác cùng chí hướng trong ngành công nghiệp điện ảnh.
                  </p>
                  <p>
                    Dù bạn là đạo diễn, biên kịch, diễn viên hay đơn vị sản xuất, chúng tôi
                    đều sẵn sàng lắng nghe và cùng bạn hiện thực hóa những giấc mơ điện ảnh.
                  </p>
                  <p>
                    Hãy điền vào mẫu liên hệ bên cạnh, đội ngũ của chúng tôi sẽ phản hồi
                    trong thời gian sớm nhất.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col justify-center h-full">
              <form
                className="space-y-4 text-main-color-400"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <select
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-control"
            >
              {titles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

                  <Input
                    type="text"
                    placeholder="Họ và tên *"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="rounded-none h-12 p-3 bg-main-color-50 text-sm w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Số điện thoại *"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="rounded-none h-12 p-3 bg-main-color-50 text-sm w-full"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="E-Mail *"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="rounded-none h-12 p-3 bg-main-color-50 text-sm w-full"
                    required
                  />
                </div>

                <Textarea
                  placeholder="Nội dung chi tiết về dự án/yêu cầu của bạn *"
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full p-3 rounded-none bg-main-color-50 text-sm"
                  rows={5}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-sm w-full py-3 flex items-center justify-center gap-2 bg-custom-gradient-button text-white font-semibold hover:brightness-110 transition"
                >
                  {loading ? "Đang gửi..." : "Liên hệ"}
                  <ChevronRight className="w-5 h-5" />
                </button>

                {success && (
                  <p className="text-green-400 text-sm mt-2">{success}</p>
                )}
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </form>
            </div>
          </div>

          {/* Map + info giữ nguyên */}
          <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-20 lg:h-80">
            <div className="order-2 lg:order-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8638060190956!2d105.74468687529551!3d21.038134787456414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1sen!2s!4v1755951147742!5m2!1sen!2s"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="lg:p-6 text-white flex flex-col justify-center order-1 lg:order-2">
              <h3 className="text-4xl font-bold mb-4 text-main-color-100">
                Thông tin liên hệ
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-main-color-50">
                  <strong>Trụ sở chính:</strong> số 13, phố Trịnh Văn Bô, Quận Nam Từ Liêm, Hà Nội, Việt Nam
                </p>
                <p className="text-main-color-50">
                  <strong>Văn phòng đại diện:</strong> Tầng 1, Tòa nhà F, Cao đẳng FPT Polytechnic
                </p>
                <p className="text-main-color-50">
                  <strong>Điện thoại:</strong> +84 24 7300 5555 - Ext: 1234
                </p>
                <p className="text-main-color-50">
                  <strong>Email:</strong> info@alphacinema.vn
                </p>
                <p className="text-main-color-50">
                  <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:30 - 18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentContact;
