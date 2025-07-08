import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../ui/carousel'

const RealImage = () => {
  const slides = [
    {
      src: "/images/slide1.png",
      caption: "Trang trại của Farmblock tại Lâm Đồng",
    },
    {
      src: "/images/slide2.png",
      caption:
        "Giống Robusta xanh lùn được sử dụng tại một số vùng trồng của Farmblock tại Lâm Đồng",
    },
    {
      src: "/images/slide3.png",
      caption: "Chuyên gia nông nghiệp kiểm tra cây giống",
    },
  ]

  return (
    <section className="bg-[#F9FDF5] py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-4">
          Những hình ảnh thực tế từ các <br /> vùng trồng của Farmblock
        </h2>

        {/* Description */}
        <p className="text-gray-700 max-w-3xl mx-auto mb-10">
          Những hình ảnh dưới đây được ghi nhận tại các vùng trồng trong hệ thống Farmblock – nơi các mô hình sản xuất, giống cây và hạ tầng công nghệ đang từng bước được áp dụng, giám sát và phát triển.
        </p>

        {/* Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="mx-auto">
              {slides.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 p-2"
                >
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={item.src}
                      alt={item.caption}
                      width={800}
                      height={600}
                      className="object-cover w-full h-[240px]"
                    />
                    <p className="text-sm text-center text-green-800 mt-2 px-2 font-medium">
                      {item.caption}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation */}
            <div className="flex justify-center mt-6 gap-3">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default RealImage