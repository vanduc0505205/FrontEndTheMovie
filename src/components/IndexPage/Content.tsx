import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import coffeeImage from "@/assets/images/index/image-home01.png";
import hoa from "@/assets/icons/icon-flower.png";
import emergingIndustries from "@/assets/icons/emerging-industries.png";
import friendship from "@/assets/icons/friendship.png";
import modeling from "@/assets/icons/modeling.png";
import imageHome02 from "@/assets/images/index/image-home02.png";
import imageHome03 from "@/assets/images/index/image-home03.png";
import imageHome07 from "@/assets/images/index/image-home07.png";
import { itemsData, slideData } from "@/config";

const Content = () => {
  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: false });

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
                  Hành trình ra thế giới,
                  <br />
                  định hình nông sản Việt Nam
                </h2>
                <p className="text-sm text-primary-green-400 leading-relaxed pr-6">
                  Trên 30ha đất đỏ Gia Lai, chúng tôi gieo những hạt giống đầu
                  tiên – không chỉ là cà phê, sầu riêng, mà là giấc mơ về một
                  nền nông nghiệp bền vững. Với công nghệ tiên phong từ Israel,
                  chúng tôi chăm sóc từng cây trồng, minh bạch từng vụ mùa, và
                  cùng nông dân Tây Nguyên viết nên câu chuyện vươn xa.
                </p>
                <p className="text-sm text-primary-green-400 leading-relaxed">
                  Hôm nay là 30ha, ngày mai là 200ha, và xa hơn là nông sản Việt
                  trên bàn ăn toàn cầu
                </p>
                <Button style={{ marginBottom: "10px" }} className="bg-custom-gradient-button text-white text-xl font-semibold px-2 py-2 mb-3 lg:mb-0">
                  Khám phá hành trình
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 pb-20 bg-primary-green-10">
        <div className="container">
          <h2 className="main-title font-bold text-primary-green-400 text-center mb-12">
            Giá trị trường tồn từ đất đai và con người
          </h2>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-primary-green-10 p-4 rounded-sm border border-primary-green-150 flex flex-row md:flex-col items-center md:items-start gap-4">
              <div className="w-14 h-14 shrink-0">
                <img
                  src={hoa}
                  alt="hoa"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary-green-200 mb-1">
                  Thiên nhiên trù phú
                </h3>
                <p className="text-custom-black text-sm leading-relaxed">
                  Những cánh đồng ở Gia Lai là nơi đất đỏ bazan nuôi dưỡng mùi
                  vị cà phê đậm đà và hương thơm sầu riêng ngọt ngào. Chúng tôi
                  kết hợp trồng trọt với công tác cải tạo, bảo vệ thiên nhiên,
                  để đất đai mãi màu mỡ.
                </p>
              </div>
            </div>

            <div className="bg-primary-green-10 p-4 rounded-sm border border-primary-green-150 flex flex-row md:flex-col items-center md:items-start gap-4">
              <div className="w-14 h-14 shrink-0">
                <img
                  src={modeling}
                  alt="modeling"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary-green-200 mb-1">
                  Công nghệ tiên phong
                </h3>
                <p className="text-custom-black text-sm leading-relaxed">
                  Chúng tôi áp dụng các công nghệ hiện đại như drone theo dõi,
                  hệ thống cảm biến thông minh và công nghệ blockchain minh
                  bạch, tạo tiền đề cho một nền nông nghiệp tương lai từ tinh
                  túy đất Việt.
                </p>
              </div>
            </div>

            <div className="rounded-md overflow-hidden border border-primary-green-150">
              <img
                src={imageHome03}
                alt="imageHome03"
                className="w-full object-cover"
              />
            </div>

            <div className="rounded-md overflow-hidden border border-primary-green-150">
              <img
                src={imageHome02}
                alt="imageHome02"
                className="w-full object-cover"
              />
            </div>

            <div className="bg-primary-green-10 p-4 rounded-sm border border-primary-green-150 flex flex-row md:flex-col items-center md:items-start gap-4">
              <div className="w-14 h-14 shrink-0">
                <img
                  src={friendship}
                  alt="friendship"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary-green-200 mb-1">
                  Cộng đồng bền vững
                </h3>
                <p className="text-custom-black text-sm leading-relaxed">
                  Chúng tôi hỗ trợ nông dân Tây Nguyên trong hoạt động canh tác,
                  đào tạo nâng cao chuyên môn và trao cơ hội việc làm. Mỗi cây
                  trồng là một nụ cười, mỗi vụ mùa là một câu chuyện.
                </p>
              </div>
            </div>

            <div className="bg-primary-green-10 p-4 rounded-sm border border-primary-green-150 flex flex-row md:flex-col items-center md:items-start gap-4">
              <div className="w-14 h-14 shrink-0">
                <img
                  src={emergingIndustries}
                  alt="emergingIndustries"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary-green-200 mb-1">
                  Tầm nhìn toàn cầu
                </h3>
                <p className="text-custom-black text-sm leading-relaxed">
                  Cùng các đối tác và các chuyên gia nông nghiệp đến từ Israel
                  và châu Âu, chúng tôi đưa nông sản Việt Nam đến bữa ăn của các
                  gia đình toàn cầu, nâng tầm giá trị nông nghiệp.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button className="bg-[linear-gradient(to_right,#008242,#7ED839)] text-white px-8 py-6 rounded-md">
              Khám phá giá trị của chúng tôi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="relative">
        {/* Background grid with gradients */}
        <div className="absolute inset-0 grid md:grid-cols-1 lg:grid-cols-2 z-0">
          <div className="bg-custom-gradient-row"></div>
          <div className="bg-custom-gradient-r2"></div>
          <div className="bg-custom-gradient-r3"></div>
          <div className="bg-custom-gradient-r3"></div>
        </div>
        {/* Foreground grid with content */}
        <div className="container relative z-10 text-primary-green-50">
          <div className="grid md:grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center py-16">
              <h1 className="text-6xl font-bold mb-3">10+</h1>
              <p className="text-lg">Đối tác Chiến lược</p>
            </div>
            <div className="flex flex-col justify-center py-16 pl-10">
              <h1 className="text-6xl font-bold mb-3 ">10+</h1>
              <p className="text-lg ">Dự án Đang Triển khai</p>
            </div>
            <div className="flex flex-col justify-center py-16">
              <h1 className="text-6xl font-bold mb-3">30%</h1>
              <p className="text-lg">Lợi nhuận Trung bình Hàng năm</p>
            </div>
            <div className="flex flex-col justify-center py-16 pl-10">
              <h1 className="text-6xl font-bold mb-3 ">5 triệu USD</h1>
              <p className="text-lg ">Tổng Giá trị Tài sản đang quản lý</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-20 bg-primary-green-50">
        <div className=" mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-primary-green-300 mb-6">
              Công nghệ của Farmblock
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

      <section className="py-10 lg:py-20 bg-primary-background">
        <div className="container ">
          <div className="text-center mb-16">
            <p className="text-primary-green-300 text-2xl font-bold mb-6">
              Hệ sinh thái của Farmblock
            </p>
            <h2 className="main-title font-bold text-primary-green-400 mb-8">
              Cùng đồng hành kiến tạo, cùng chia sẻ giá trị
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <img
                src={imageHome07}
                alt="Farmer working in coffee plantation"
                className="shadow-2xl w-full h-[250px] md:h-[550px] object-cover rounded-md"
              />
            </div>

            <div className="w-full overflow-hidden h-full space-y-2">
              {itemsData.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-row md:grid md:grid-cols-2 gap-6 py-5 border-t border-[#3A8047]`}
                >
                  <div className="text-primary-green-200 font-semibold px-4 flex items-center text-sm md:text-xl w-1/2 md:w-auto">
                    {item.title}
                  </div>
                  <div className="text-primary-green-400 leading-snug text-sm pr-4 w-1/2 md:w-auto">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;
