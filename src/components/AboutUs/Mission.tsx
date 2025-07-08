import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { accordionData, blogItems, milestones } from "@/config";
import imageAboutUs from "@/assets/images/about-us/about-us-image03.png";
import AboutUsImage2 from "@/assets/images/about-us/about-us-image-2.png";
import AboutUsImage3 from "@/assets/images/about-us/about-us-image-3.png";
import flowerIcon from "@/assets/icons/icon-flower.png";
import icon from "@/assets/icons/image-about-us.png";
import icon01 from "@/assets/icons/image-about-us01.png";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

const Mission = () => {
  return (
    <section>
      <div className="relative h-svh w-full overflow-hidden">
        <img
          src={AboutUsImage2}
          alt="Farm landscape"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(247, 252, 242, 0) 40%, #F7FCF2 60%)",
          }}
        ></div>
        <div className="absolute bottom-0 z-10 pb-20 h-[40%] left-0 right-0 w-full ">
          <div className="container flex gap-12 items-start justify-center">
            <div className="w-1/2s space-y-5">
              <h1 className="text-3xl lg:text-6xl font-bold text-primary-green-400 flex flex-col gap-3 mb-4">
                Sứ mệnh gìn giữ, <span>tầm nhìn vươn xa</span>
              </h1>
              <p className="text-primary-green-400 max-w-xl text-base">
                Farmbly tin rằng bảo vệ đất đai, tôn vinh nông dân, và minh bạch
                hóa nông nghiệp là những điều kiện tiên quyết để tạo ra một hệ
                sinh thái nông nghiệp bền vững.
              </p>
              <p className="text-primary-green-400 max-w-xl text-base">
                Chúng tôi hỗ trợ nông dân Tây Nguyên, mang công nghệ đến từng
                luống đất, và đưa nông sản sạch đến mọi gia đình.
              </p>
            </div>
            <div className="w-1/2 space-y-5">
              <button className="w-full bg-about-us-content text-primary-green-100 text-4xl font-semibold py-6 px-5 rounded flex items-center gap-6">
                <img src={flowerIcon} alt="flowericon" className="w-10 h-15" />
                Bảo vệ thiên nhiên
              </button>
              <button className="w-full bg-about-us-content text-primary-green-100 text-4xl font-semibold py-6 px-5 rounded flex items-center gap-6">
                <img src={icon} alt="icon nong dan" className="w-10 h-15" />
                Tôn vinh nông dân
              </button>
              <button className="w-full bg-about-us-content text-primary-green-100 text-4xl font-semibold py-6 px-5 rounded flex items-center gap-6">
                <img src={icon01} alt="icon01" className="w-10 h-15" />
                Minh bạch hoá nông nghiệp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-background">
        <div className="container ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20  container">
            <div className="w-full h-[580px] rounded-sm overflow-hidden">
              <img
                src={AboutUsImage3}
                alt="Farmer harvesting"
                className="w-full h-full object-cover "
              />
            </div>

            <div className="">
              <p className="text-primary-green-300 lg:text-3xl font-semibold mb-2">
                Con người - Linh hồn của dự án
              </p>
              <h2 className="text-primary-green-400 main-title mb-4 leading-tight">
                Những người gieo mầm tương lai
              </h2>

              <Accordion
                type="single"
                collapsible
                className="w-full space-y-4"
                defaultValue="item-0"
              >
                {accordionData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger
                      className={cn(
                        "px-4 text-2xl font-semibold text-left text-primary-green-400",
                        "data-[state=open]:text-primary-green-200" // màu mới cho tiêu đề khi mở
                      )}
                    >
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 lg:text-lg text-primary-green-400 leading-relaxed">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <section className="bg-primary-background py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-primary-green-400 mb-16">
                Hành trình vươn xa
              </h2>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row border-t mb-5 border-primary-green-200 py-6 gap-6"
                >
                  <div className="flex items-center gap-4 w-full md:w-1/3 mb-4 md:mb-0">
                    <img
                      src={milestone.image}
                      alt={`Mốc ${index + 1}`}
                      className="w-14 h-14"
                    />
                    <h3
                      className={`text-4xl font-bold ${
                        index === 0
                          ? "text-primary-green-200"
                          : "text-primary-green-400"
                      }`}
                    >
                      {milestone.title}
                    </h3>
                  </div>
                  <div className="w-full md:w-1/4 lg:w-1/5 px-4 flex items-center">
                    <p
                      className={`text-2xl font-semibold ${
                        index === 0
                          ? "text-primary-green-200"
                          : "text-primary-green-400"
                      }`}
                    >
                      {milestone.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-full md:flex-1  text-lg px-4 ${
                      index === 0
                        ? "text-primary-green-200"
                        : "text-primary-green-400"
                    }`}
                  >
                    {milestone.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="py-20 bg-primary-background">
            <div className="container">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary-green-400 mb-10 -mt-10 text-center">
                Blogs
              </h2>

              <div className="relative">
                <Carousel opts={{ loop: true }} className="relative">
                  <CarouselContent className="pl-4 pr-4 gap-5">
                    {blogItems.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-full md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="bg-primary-background overflow-hidden h-full flex flex-col">
                          <img
                            src={item.image}
                            alt={`blog-${index}`}
                            className="w-full h-[180px] object-cover"
                          />
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <p className="text-primary-green-400 font-semibold text-2xl line-clamp-3 mb-4">
                              {item.title}
                            </p>
                            <div className="w-full h-[1px] bg-primary-green-200 mb-5"></div>
                            <a
                              href={item.link}
                              className="text-primary-green-300 text-lg font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              Xem thêm <ChevronRight size={16} />
                            </a>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="-left-10 lg:-left-14 bg-primary-green-300 hover:bg-green-600 text-white shadow-md" />
                  <CarouselNext className="-right-10 lg:-right-14 bg-primary-green-300 hover:bg-green-600 text-white shadow-md" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <img
          src={imageAboutUs}
          alt="About Us"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default Mission;
