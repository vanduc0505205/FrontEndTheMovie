import React from "react";
import { Shield, Clock, Ticket, Users, Phone, Mail, AlertCircle, Star } from "lucide-react";

const PolicyPage = () => {
  const policies = [
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Quy định chung",
      items: [
        "Khách hàng vui lòng đến rạp trước giờ chiếu ít nhất 15 phút để làm thủ tục vào rạp",
        "Nghiêm cấm mang đồ ăn, thức uống từ bên ngoài vào phòng chiếu",
        "Không hút thuốc, quay phim, chụp ảnh hoặc ghi âm trong suốt quá trình chiếu phim",
        "Trẻ em dưới 13 tuổi bắt buộc phải có người lớn đi cùng khi xem phim có giới hạn độ tuổi",
        "Giữ trật tự, không gây ồn ào ảnh hưởng đến khách hàng khác"
      ]
    },
    {
      icon: <Ticket className="w-6 h-6" />,
      title: "Chính sách vé",
      items: [
        "Vé đã thanh toán thành công không được hoàn tiền hoặc đổi trả dưới mọi hình thức",
        "Vé đặt trực tuyến cần được thanh toán trong vòng 10 phút, sau thời gian này hệ thống sẽ tự động hủy",
        "Vé giảm giá chỉ áp dụng cho đối tượng quy định (học sinh, sinh viên, người cao tuổi) với giấy tờ tùy thân hợp lệ",
        "Khuyến mãi có thể thay đổi theo từng thời điểm và không được cộng dồn với các ưu đãi khác",
        "Vé mua trước có thể được sử dụng trong vòng 30 ngày kể từ ngày mua"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Chính sách bảo mật",
      items: [
        "Mọi thông tin cá nhân của khách hàng đều được mã hóa và bảo mật tuyệt đối",
        "Thông tin chỉ được sử dụng cho mục đích hỗ trợ dịch vụ và cải thiện trải nghiệm khách hàng",
        "Hệ thống sử dụng cookie để ghi nhớ sở thích và tối ưu hóa trải nghiệm người dùng",
        "Chúng tôi cam kết không chia sẻ thông tin cá nhân với bên thứ ba mà không có sự đồng ý",
        "Dữ liệu thanh toán được xử lý thông qua các cổng thanh toán bảo mật quốc tế"
      ]
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Chính sách thành viên",
      items: [
        "Thành viên tích lũy 1 điểm cho mỗi 10,000 VNĐ chi tiêu tại rạp",
        "Ưu đãi sinh nhật: Vé miễn phí + combo bắp nước (áp dụng trong tháng sinh)",
        "Cấp độ thành viên: Silver (0-499 điểm), Gold (500-999 điểm), Diamond (1000+ điểm)",
        "Quyền lợi cao cấp: Ưu tiên đặt vé, phòng VIP, parking miễn phí",
        "100 điểm = 1 vé miễn phí hoặc có thể đổi quà tặng hấp dẫn"
      ]
    }
  ];

  return (
    <div className=" py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            Quy Định & Chính Sách
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Để đảm bảo trải nghiệm xem phim tốt nhất cho tất cả khách hàng, 
            vui lòng đọc kỹ các quy định dưới đây
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid gap-8 md:gap-12">
          {policies.map((policy, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl text-white">
                  {policy.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {index + 1}. {policy.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {policy.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></div>
                    <p className="text-gray-300 text-lg leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-2xl p-8 border border-red-500/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl text-white">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                5. Liên hệ & Hỗ trợ
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Email hỗ trợ</p>
                    <p className="text-white font-semibold">cskh@trungtamchieuphim.vn</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Hotline</p>
                    <p className="text-white font-semibold">1900 1234</p>
                    <p className="text-gray-500 text-sm">Hoạt động 7:00 - 22:00 hàng ngày</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Thời gian phản hồi</p>
                    <p className="text-white font-semibold">Trong vòng 48 giờ làm việc</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Lưu ý quan trọng</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Mọi khiếu nại cần có hóa đơn hoặc mã đặt vé</li>
                  <li>• Chính sách có thể thay đổi theo thông báo mới</li>
                  <li>• Vui lòng cập nhật thông tin mới nhất tại website</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gray-800/30 rounded-full px-6 py-3 border border-gray-700/50">
            <p className="text-gray-400">
              Cập nhật lần cuối: <span className="text-white font-semibold">16/08/2025</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;