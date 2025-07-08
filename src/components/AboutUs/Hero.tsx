import Video from "@/assets/videos/about-us-video.mp4";

const Hero = () => {
  return (
    <section className="relative h-screen ">
      <div className="absolute inset-0 bg-about-us-hero z-30"></div>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-10"
      >
        <source src={Video} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <div className="absolute inset-0 bg-black/30 z-20" />

      <div className="absolute bottom-10 right-0 w-full z-40 text-primary-green-50">
  <div className="container flex flex-col items-center justify-center text-center space-y-6">
    <h3 className="text-primary-green-100 text-xl md:text-3xl">Tây Nguyên</h3>

    <h1 className="text-primary-green-50 main-title">
      Hành trình từ miền đất đỏ đến tương lai
    </h1>

    <h4 className="text-primary-green-50 text-sm md:text-xl max-w-xl">
      Trên mảnh đất bazan trù phú, chúng tôi gieo những hạt giống của sự bền vững, <br />
      kết nối thiên nhiên với công nghệ, cùng nông dân Tây Nguyên viết nên câu chuyện vươn ra thế giới.
    </h4>
  </div>
</div>

    </section>
  );
};

export default Hero;
