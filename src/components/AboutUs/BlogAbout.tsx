import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { ChevronRight } from "lucide-react";
import { blogItems } from "@/config";
import imageAboutUs from "@/assets/images/about-us/about-us-image03.png";

const BlogAbout = () => {
  return (
    <div>
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
      <div className="w-full">
        <img
          src={imageAboutUs}
          alt="About Us"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default BlogAbout;