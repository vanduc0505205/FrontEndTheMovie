import { useQuery } from "@tanstack/react-query";
import { getAllMovies } from "@/api/movie.api";
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
    queryFn: getAllMovies,
  });

  const nowShowing = movieList.filter((movie) => movie.status === "dang_chieu");
  const comingSoon = movieList.filter((movie) => movie.status === "sap_chieu");

  return (
    <div>
      {isLoading ? (
        <p className="col-span-full text-center text-main-color-300">Đang tải phim...</p>
      ) : isError ? (
        <p className="col-span-full text-center text-red-500">Không thể tải danh sách phim.</p>
      ) : (
        <div>
          {/* Hero Section */}
          <section className="pt-20 pb-20 bg-custom-gradient-content">
            <div className="container">
              <div className="rounded-xl overflow-hidden bg-main-color-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="order-1 lg:order-1">
                    <img
                      src={phimMai}
                      alt="Đặt vé xem phim"
                      className="shadow-2xl w-full h-[250px] lg:h-[400px]"
                    />
                  </div>
                  <div className="order-2 lg:order-2 space-y-6 px-4 lg:px-0">
                    <h1 className="text-3xl lg:text-5xl font-bold text-main-color-200 leading-tight">
                      Đặt vé xem phim trực tuyến dễ dàng
                    </h1>
                    <p className="text-base text-main-color-400 leading-relaxed pr-6">
                      Trải nghiệm đặt vé xem phim nhanh chóng, tiện lợi và bảo mật.
                      Khám phá các bộ phim hot nhất, chọn suất chiếu phù hợp và nhận vé
                      ngay trên website!
                    </p>
                    <ul className="list-disc pl-5 text-main-color-400 text-sm">
                      <li>Đặt vé mọi lúc, mọi nơi</li>
                      <li>Thanh toán trực tuyến an toàn</li>
                      <li>Chọn chỗ ngồi yêu thích</li>
                      <li>Nhận thông báo phim mới & ưu đãi</li>
                    </ul>
                    <Button className="bg-custom-gradient-button text-white text-xl font-semibold px-2 py-2">
                      Đặt vé ngay
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Phim đang chiếu */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-left mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-main-color-300 mb-4">
                  Phim đang chiếu
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {nowShowing.map((movie) => (
                  <Link
                    to={`/phim/${movie._id}`}
                    key={movie._id}
                    className="bg-main-color-10 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-bold text-base text-main-color-200 mb-1 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex flex-col text-xs text-main-color-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {movie.categories.map((cat) => (
                              <span key={cat._id}>{cat.categoryName}</span>
                            ))}
                          </div>
                          <span>{movie.duration} phút</span>
                        </div>
                        <span>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Phim sắp chiếu */}
          <section className="py-16 bg-main-color-50">
            <div className="container mx-auto px-4">
              <div className="text-left mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-main-color-300 mb-4">
                  Phim sắp chiếu
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {comingSoon.map((movie) => (
                  <Link to={`/phim/${movie._id}`} key={movie._id} className="block">
                    <div className="bg-main-color-10 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-bold text-base text-main-color-200 mb-1 line-clamp-2">
                          {movie.title}
                        </h3>
                        <div className="flex flex-col text-xs text-main-color-400 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {movie.categories.map((cat) => (
                                <span key={cat._id}>{cat.categoryName}</span>
                              ))}
                            </div>
                            <span>{movie.duration} phút</span>
                          </div>
                          <span>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Carousel Section */}
          <section className="py-10 lg:py-20 bg-main-color-50">
            <div className="mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl font-bold text-main-color-300 mb-6">
                  Công nghệ của ALPHACINEMA
                </h2>
                <p className="main-title font-bold text-main-color-400 mx-auto">
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
                              <h3 className="text-3xl font-bold text-main-color-100 mb-3">
                                {slide.title}
                              </h3>
                              <p className="text-main-color-50 text-base leading-relaxed">
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
                <Button className="bg-custom-gradient-button text-white text-base font-semibold py-7">
                  Khám phá công nghệ
                  <ArrowRight className="h-2 w-2 ml-2" />
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl lg:text-4xl font-bold text-main-color-300 mb-4">
                  Tại sao chọn chúng tôi?
                </h2>
                <p className="text-main-color-400 text-base">
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
                    className="bg-main-color-10 rounded-xl p-8 shadow-md text-center"
                  >
                    <h3 className="font-bold text-xl text-main-color-200 mb-2">{feature.title}</h3>
                    <p className="text-main-color-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 bg-main-color-50">
            <div className="container mx-auto text-center">
              <h2 className="text-2xl lg:text-4xl font-bold text-main-color-300 mb-6">
                Sẵn sàng đặt vé xem phim?
              </h2>
              <p className="text-main-color-400 text-base mb-8">
                Đăng ký tài khoản ngay để nhận nhiều ưu đãi và trải nghiệm dịch vụ tốt nhất!
              </p>
              <Button className="bg-custom-gradient-button text-white text-xl font-semibold px-8 py-4">
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
