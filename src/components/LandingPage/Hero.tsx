import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Video from "@/assets/video/NA-TRA-MA-DONG-NAO-HAI.mp4";
import { Link } from "react-router-dom";

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
      {/* <div className="absolute inset-0 bg-black/30 z-20" /> */}

      <div className="absolute bottom-4 right-0 w-full z-40 text-main-color-50">
        <div className="container text-center md:text-left items-center md:items-start justify-center md:justify-start">
          <p className="text-2xl font-semibold text-main-color-100 mb-4 opacity-90 leading-loose">
            Khám phá thế giới điện ảnh đỉnh cao
          </p>

          <h1 className="main-title font-semibold mb-6 leading-tight flex flex-col gap-4">
            Đắm chìm trong những câu chuyện
            <span className="">Đỉnh cao của điện ảnh</span>
          </h1>

          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
            <p className="mb-5 text-base opacity-90 leading-relaxed md:max-w-[60%]">
              Từ những bộ phim bom tấn đình đám đến những tác phẩm nghệ thuật đầy cảm xúc, 
              chúng tôi mang đến cho bạn trải nghiệm xem phim tuyệt vời nhất. 
              Hãy cùng khám phá thế giới điện ảnh đa sắc màu.{" "}
            </p>  

            <Link to={`/lich-chieu`}>
            <Button
              size="lg"
              className="bg-custom-gradient-button text-white text-xl md:text-3xl py-8 md:py-10 rounded-full whitespace-nowrap"
            >
              Xem phim ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
