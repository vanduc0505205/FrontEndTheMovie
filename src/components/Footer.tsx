import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-primary-background text-white pb-10">

      <div className="container pt-10 pb-20">
        <div className="mb-10 mt-10">
          <div className="relative flex items-center mb-10">
            <img src={logo} alt="nen"  className="w-12 h-12 object-contain"/>
            <h2 className="text-xl md:text-2xl font-medium text-primary-green-200 ml-3">
              ALPHACINEMA
            </h2>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary-green-10 flex gap-4">
            Đặt vé trực tuyến - Trải nghiệm tức thì - Rạp chiếu trong tầm tay
          </h2>
        </div>

        <hr className="border-t border-primary-green-400/30 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div className="">
            <h3 className="text-base font-semibold mb-6 text-primary-green-200">
              Truy cập nhanh
            </h3>
            <ul className="text-primary-green-10/80 space-y-6 text-xl">
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Trang chủ</li>
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Về Chúng tôi</li>
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Mô hình vận hành</li>
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-6 text-primary-green-200">
              Chính sách & Điều khoản
            </h3>
            <ul className="text-primary-green-10/80 space-y-6 text-xl">
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Chính sách bảo mật</li>
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Điều khoản sử dụng dịch vụ</li>
              <li className="hover:text-primary-green-200 transition-colors cursor-pointer">Câu hỏi thường gặp</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-6 text-primary-green-200">
              Thông tin
            </h3>
            <div className="text-xl space-y-6">
              <p className="text-primary-green-10/80">
                <span className="text-primary-green-200 font-medium">Địa chỉ:</span> 120 phố A, Phường B, Quận C, Thành phố D, Hà Nội, Việt Nam
              </p>
              <p className="text-primary-green-10/80">
                <span className="text-primary-green-200 font-medium">Số điện thoại:</span> +841-900-247-05
              </p>
              <p className="text-primary-green-10/80">
                <span className="text-primary-green-200 font-medium">E-Mail:</span> Gmail@ALPHACINEMA.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-primary-green-200 h-[40px] flex items-center justify-center">
        <p className="text-sm text-white font-medium text-center">
          Bản quyền © 2025 Thuộc về ALPHACINEMA
        </p>
      </div>
    </footer>
  );
};

export default Footer;