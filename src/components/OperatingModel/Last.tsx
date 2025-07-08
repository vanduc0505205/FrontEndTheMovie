import React from "react";

const Last = () => {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/farm-bg.png')", // Replace with your background image
      }}
    >
      <div className="bg-gradient-to-r from-[#0f2e1f]/90 to-[#1c4c2d]/90 py-12 px-4 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Left image */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              src="/images/coffee-branch.png" // Replace with your actual image path
              alt="Coffee Cherry"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>

          {/* Right content */}
          <div className="text-white w-full md:w-1/2">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/icons/farmblock-logo.png"
                alt="Farmblock"
                className="w-6 h-6"
              />
              <span className="font-bold text-lg">FARMBLOCK</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              Thấy tận mắt tin tận tâm
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-100 mb-4 leading-relaxed">
              Farmblock cho phép bạn theo dõi trực tiếp các hoạt động canh tác
              thực tế – từ tiến độ gieo trồng, tưới tiêu, đến dữ liệu môi trường
              và hình ảnh thực tế tại các vùng trồng. Tất cả được cập nhật liên
              tục từ thông cảm biến và camera tại nông trại.
            </p>

            <p className="text-sm md:text-base text-gray-200 mb-6">
              Không cần quảng cáo, giờ đây, hãy tự mình nhìn quy trình sản xuất
              đang diễn ra mỗi ngày!
            </p>

            {/* Button */}
            <a
              href="#"
              className="inline-block bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Truy cập ứng dụng →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Last;
