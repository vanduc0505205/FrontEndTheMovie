import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import coffeeImage from "@/assets/images/index/image-home01.png";
import { slideData } from "@/config";

const Content = () => {
  const autoplay = Autoplay({ delay: 2000, stopOnInteraction: false });

  return (
    <div>
      <section className="pt-20 pb-20 bg-custom-gradient-content">
        <div className="container">
          <div className="rounded-xl overflow-hidden bg-primary-green-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1 lg:order-1">
                <img
                  src={coffeeImage}
                  alt="Coffee farmer harvesting"
                  className="shadow-2xl w-full h-[250px] lg:h-[400px]"
                />
              </div>
              <div className="order-2 lg:order-2 space-y-6 px-4 lg:px-0">
                <h2 className="text-2xl lg:text-4xl font-bold text-primary-green-200 leading-tight">
                  Điện ảnh đỉnh cao,
                  <br />
                  Kể những câu chuyện đáng nhớ
                </h2>
                <p className="text-sm text-primary-green-400 leading-relaxed pr-6">
                  Từ những bộ phim kinh điển đến những tác phẩm mới nhất, chúng tôi mang đến cho bạn 
                  trải nghiệm xem phim tuyệt vời nhất. Với công nghệ hình ảnh và âm thanh đỉnh cao, 
                  mỗi thước phim đều là một tác phẩm nghệ thuật đích thực.
                </p>
                <p className="text-sm text-primary-green-400 leading-relaxed">
                  Hàng ngàn bộ phim đa dạng thể loại đang chờ đón bạn khám phá
                </p>
                <Button style={{ marginBottom: "10px" }} className="bg-custom-gradient-button text-white text-xl font-semibold px-2 py-2 mb-3 lg:mb-0">
                  Xem ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-20 bg-primary-green-50">
        <div className=" mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-primary-green-300 mb-6">
              Công nghệ của ALPHACINEMA
            </h2>
            <p className="main-title font-bold text-primary-green-400 mx-auto">
              Công nghệ định hình tương lai nông nghiệp
            </p>
          </div>
          <div className="relative mx-auto">
            <Carousel opts={{ loop: true }} plugins={[autoplay]}>
              <CarouselContent>
                {slideData.map((slide, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-lg h-[500px] w-full">
                      <div className="absolute inset-0 bg-custom-gradient-4 z-10"></div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 z-20">
                        <div className="absolute inset-0  flex flex-col justify-end p-6">
                          <h3 className="text-3xl font-bold text-primary-green-100 mb-3">
                            {slide.title}
                          </h3>
                          <p className="text-primary-green-50 text-base leading-relaxed">
                            {slide.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="right-4 top-1/2 -translate-y-1/2 z-10" /> */}
            </Carousel>
          </div>
          <div className="text-center mt-10 ">
            <Button className="bg-custom-gradient-button text-white text-base font-semibold py-7 ">
              Khám phá công nghệ
              <ArrowRight className=" h-2 w-2" />
            </Button>
          </div>
        </div>
      </section>  
    </div>
  );
};

export default Content;
