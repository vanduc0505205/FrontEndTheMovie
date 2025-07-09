import banner from "@/assets/images/banner.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen">
        <div className="absolute inset-0 bg-contact-hero z-30" />
        <img
          src={banner}
          className="absolute inset-0 w-full h-full object-cover z-10"
        >
        </img>
        <div className="absolute inset-0 bg-black/30 z-20" />

        <div className="absolute bottom-0 flex justify-center right-0 w-full z-40 primary-green-50 pb-16">
          <div className="container px-4 text-center flex flex-col items-center space-y-8">
            <p className="text-lg font-semibold text-primary-green-100">Liên hệ với chúng tôi</p>

            <div>
              <h1 className="text-4xl text-primary-green-50 md:text-6xl font-bold leading-tight space-y-5">
                <span className="block">Kết nối với thế giới</span>
                <span className="block">điện ảnh đỉnh cao</span>
              </h1>
            </div>

            <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-3xl text-primary-green-50">
              Chúng tôi luôn lắng nghe ý kiến từ khán giả, đối tác và những người yêu điện ảnh.
              Hãy chia sẻ với chúng tôi những đánh giá, góp ý hoặc cơ hội hợp tác để cùng
              tạo nên những tác phẩm điện ảnh chất lượng nhất.
            </p>
          </div>
        </div>
      </section>
  )
}

export default Hero