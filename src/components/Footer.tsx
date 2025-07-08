import logo from "@/assets/images/logo.png";
import logoBg from "@/assets/images/logoBG.png";

const Footer = () => {
  return (
    <footer className="relative bg-custom-gradient-footer text-white pb-10">
      <img
        src={logoBg}
        alt="decor"
        className="absolute right-0 bottom-0 w-auto h-full aspect-auto z-0"
      />

      <div className="container pt-10 pb-20">
        <div className="mb-10 mt-10">
          <div className="relative flex items-center mb-10">
            <img src={logo} alt="nen"  className="w-12 h-12 object-contain"/>
            <h2 className="text-xl md:text-2xl font-medium text-white ml-3">
              ALPHACINEMA
            </h2>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary-green-100 flex gap-4">
            Số hóa nông nghiệp - Chuẩn hóa
            vận hành - Tối ưu đầu tư
          </h2>
        </div>

        <hr className="border-t border-white/20 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div className="">
            <h3 className="text-base font-normal mb-6 text-primary-green-100">
              Truy cập nhanh
            </h3>
            <ul className=" text-white/90 space-y-6 text-xl">
              <li>Trang chủ</li>
              <li>Về Chúng tôi</li>
              <li>Mô hình vận hành</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-normal mb-6 text-primary-green-100">
              Chính sách & Điều khoản
            </h3>
            <ul className=" text-white/90 space-y-6 text-xl">
              <li>Chính sách bảo mật</li>
              <li>Điều khoản sử dụng dịch vụ</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-normal mb-6 text-primary-green-100 ">
              Thông tin
            </h3>
            <div className="text-xl space-y-6">
              <p className="text-white/90">
                Địa chỉ: 120 phố A, Phường B, Quận C, Thành phố D, Hà Nội, Việt
                Nam
              </p>
              <p className="text-white/90">Số điện thoại: +841-900-247-05</p>
              <p className="text-white/90">E-Mail: Gmail@ALPHACINEMA.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-[#B4E27E] h-[40px] flex items-center justify-center">
        <p className="text-sm text-black text-center">
          Bản quyền © 2025 Thuộc về ALPHACINEMA
        </p>
      </div>
    </footer>
  );
};

export default Footer;
