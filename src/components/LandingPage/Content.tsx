import { useQuery } from "@tanstack/react-query";
import { getAllMoviesSimple } from "@/api/movie.api";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { slideData } from "@/config";
import { phimMai } from "@/assets/path";
import { Link } from "react-router-dom";

export default function HomePageContent() {
  const autoplay = Autoplay({ delay: 2000, stopOnInteraction: false });

  const {
    data: movieList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getAllMoviesSimple,
  });

  const nowShowing = movieList.filter((movie) => movie.status === "dang_chieu");
  const comingSoon = movieList.filter((movie) => movie.status === "sap_chieu");

  return (
    <div>
      {isLoading ? (
        <p className="col-span-full text-center text-amber-400">Đang tải phim...</p>
      ) : isError ? (
        <p className="col-span-full text-center text-red-400">Không thể tải danh sách phim.</p>
      ) : (
        <div>
          {/* Hero Section */}
          <section className="pt-20 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="container">
              <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="order-1 lg:order-1">
                    <img
                      src={phimMai}
                      alt="Đặt vé xem phim"
                      className="shadow-2xl w-full h-[250px] lg:h-[400px] rounded-lg"
                    />
                  </div>
                  <div className="order-2 lg:order-2 space-y-6 px-6 lg:px-8 py-6">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                      Đặt vé xem phim trực tuyến dễ dàng
                    </h1>
                    <p className="text-base text-gray-100 leading-relaxed pr-6 drop-shadow-sm">
                      Trải nghiệm đặt vé xem phim nhanh chóng, tiện lợi và bảo mật.
                      Khám phá các bộ phim hot nhất, chọn suất chiếu phù hợp và nhận vé
                      ngay trên website!
                    </p>
                    <ul className="list-disc pl-5 text-gray-200 text-sm space-y-1">
                      <li>Đặt vé mọi lúc, mọi nơi</li>
                      <li>Thanh toán trực tuyến an toàn</li>
                      <li>Chọn chỗ ngồi yêu thích</li>
                      <li>Nhận thông báo phim mới & ưu đãi</li>
                    </ul>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-semibold px-6 py-3 shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0">
                      Đặt vé ngay
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Phim đang chiếu */}
{/* Phim đang chiếu */}
<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="text-left mb-8">
      <h2 className="text-2xl lg:text-3xl font-bold text-red-500 mb-4">
        Phim đang chiếu
      </h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {nowShowing.map((movie) => (
        <Link
          to={`/phim/${movie._id}`}
          key={movie._id}
          className="bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 border border-gray-800 hover:border-red-500/50 group relative"
        >
          {/* Poster */}
          <div className="w-full aspect-[2/3] bg-black">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Luôn hiển thị tên phim */}
          <div className="p-3">
            <h3 className="font-bold text-base text-white mb-1 line-clamp-2">
              {movie.title}
            </h3>
          </div>

          {/* Overlay chi tiết (hover mới hiện) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-col text-xs text-gray-300 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {movie.categories.map((cat) => (
                    <span key={cat._id} className="text-amber-400">
                      {cat.categoryName}
                    </span>
                  ))}
                </div>
                <span>{movie.duration} phút</span>
              </div>
              <span className="text-gray-400">
                {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

{/* Phim sắp chiếu */}
<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="text-left mb-8">
      <h2 className="text-2xl lg:text-3xl font-bold text-blue-500 mb-4">
        Phim sắp chiếu
      </h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {comingSoon.map((movie) => (
        <Link
          to={`/phim/${movie._id}`}
          key={movie._id}
          className="bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 border border-gray-800 hover:border-blue-500/50 group relative"
        >
          {/* Poster */}
          <div className="w-full aspect-[2/3] bg-black">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Luôn hiển thị tên phim */}
          <div className="p-3">
            <h3 className="font-bold text-base text-white mb-1 line-clamp-2">
              {movie.title}
            </h3>
          </div>

          {/* Overlay chi tiết (hover mới hiện) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-col text-xs text-gray-300 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {movie.categories.map((cat) => (
                    <span key={cat._id} className="text-amber-400">
                      {cat.categoryName}
                    </span>
                  ))}
                </div>
                <span>{movie.duration} phút</span>
              </div>
              <span className="text-gray-400">
                {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>


          {/* Carousel Section */}
          <section className="py-10 lg:py-20">
            <div className="mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl font-bold text-amber-400 mb-6">
                  Công nghệ của ALPHACINEMA
                </h2>
                <p className="main-title font-bold text-gray-300 mx-auto">
                  Trải nghiệm điện ảnh đỉnh cao với công nghệ
                </p>
              </div>
              <div className="relative mx-auto">
                <Carousel opts={{ loop: true }} plugins={[autoplay]}>
                  <CarouselContent>
                    {slideData.map((slide, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="relative rounded-xl overflow-hidden shadow-lg h-[500px] w-full">
                          <div className="absolute inset-0 bg-custom-gradient-carousel z-10"></div>
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 z-20">
                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                              <h3 className="text-3xl font-bold text-white mb-3">
                                {slide.title}
                              </h3>
                              <p className="text-gray-200 text-base leading-relaxed">
                                {slide.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
              <div className="text-center mt-10">
                <Button className="bg-custom-gradient-button text-white text-base font-semibold py-7 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300">
                  Khám phá công nghệ
                  <ArrowRight className="h-2 w-2 ml-2" />
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                  Tại sao chọn chúng tôi?
                </h2>
                <p className="text-gray-300 text-base">
                  Website đặt vé xem phim hàng đầu Việt Nam với trải nghiệm người dùng tuyệt vời.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Giao diện thân thiện", desc: "Dễ dàng tìm kiếm phim, rạp và suất chiếu phù hợp." },
                  { title: "Thanh toán linh hoạt", desc: "Hỗ trợ nhiều hình thức thanh toán trực tuyến an toàn." },
                  { title: "Ưu đãi hấp dẫn", desc: "Nhận ưu đãi, voucher và thông báo phim mới mỗi ngày." },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900 rounded-xl p-8 shadow-md text-center border border-gray-800 hover:border-red-500/50 transition-all duration-300"
                  >
                    <h3 className="font-bold text-xl text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16">
            <div className="container mx-auto text-center">
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6">
                Sẵn sàng đặt vé xem phim?
              </h2>
              <p className="text-gray-300 text-base mb-8">
                Đăng ký tài khoản ngay để nhận nhiều ưu đãi và trải nghiệm dịch vụ tốt nhất!
              </p>
              <Button className="bg-custom-gradient-button text-white text-xl font-semibold px-8 py-4 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300">
                Đăng ký ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}