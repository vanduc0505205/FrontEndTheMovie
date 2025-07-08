import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Video from "@/assets/videos/videoHero.mp4";

const Hero = () => {
  return (
    <section className="relative h-screen ">
      <div className="absolute inset-0 bg-custom-gradient-3 z-30"></div>
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

      <div className="absolute bottom-4 right-0 w-full z-40 text-primary-green-50">
        <div className="container text-center md:text-left items-center md:items-start justify-center md:justify-start">
          <p className="text-2xl font-semibold text-primary-green-100 mb-4 opacity-90 leading-loose">
            Tiên phong trong số hóa tài sản Nông nghiệp
          </p>

          <h1 className="main-title font-semibold mb-6 leading-tight flex flex-col gap-4">
            Hành trình cùng Tây Nguyên
            <span className="">Chạm đến tương lai</span>
          </h1>

          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
            <p className="mb-5 text-base opacity-90 leading-relaxed md:max-w-[60%]">
              Từ những cánh đồng cà phê Tây Nguyên, chúng tôi kết nối thiên
              nhiên với nền tảng công nghệ tiên phong và hệ thống blockchain —
              mang nông sản Việt đến thế giới, cùng người nông dân viết nên câu
              chuyện bền vững.{" "}
            </p>  

            <Button
              size="lg"
              className="bg-custom-gradient-button hover:bg-green-500 text-white text-xl md:text-3xl py-8 md:py-10 rounded-full whitespace-nowrap"
            >
              Khám phá mô hình
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
