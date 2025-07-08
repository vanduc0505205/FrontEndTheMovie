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
            <p className="text-lg font-semibold text-primary-green-100">Liên hệ</p>

            <div>
              <h1 className="text-4xl text-primary-green-50 md:text-6xl font-bold leading-tight space-y-5">
                <span className="block">Kết nối với Tây Nguyên,</span>
                <span className="block">nơi đất đỏ kể chuyện</span>
              </h1>
            </div>

            <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-3xl text-primary-green-50">
              Chúng tôi ở đây để lắng nghe câu chuyện của bạn, chia sẻ tầm nhìn
              về một nền nông nghiệp bền vững, và cùng bạn chạm đến giá trị
              trường tồn từ miền đất đỏ bazan trù phú.
            </p>
          </div>
        </div>
      </section>
  )
}

export default Hero