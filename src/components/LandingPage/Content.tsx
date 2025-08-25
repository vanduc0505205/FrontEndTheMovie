import { useQuery } from "@tanstack/react-query";
import { getAllMoviesSimple } from "@/api/movie.api";
import { ArrowRight, Calendar, Clock, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { slideData } from "@/config";
import { phimMai } from "@/assets/path";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAccessToken } from "@/lib/auth";

export default function HomePageContent() {
  // useEffect(() => {
  //   if (!document.querySelector('script[src="https://app.preny.ai/embed-global.js"]')) {
  //     const script = document.createElement("script");
  //     script.src = "https://app.preny.ai/embed-global.js";
  //     script.async = true;
  //     script.defer = true;
  //     script.setAttribute("data-name-bot", "bot-demo");
  //     script.setAttribute("data-button-style", "width:300px;height:300px;");
  //     script.setAttribute("data-language", "vi");
  //     script.setAttribute("data-preny-bot-id", "689f655146712d0465a3bc03");
  //     document.body.appendChild(script);
  //   }
  // }, []);
  const autoplay = Autoplay({ delay: 2000, stopOnInteraction: false });

  const {
    data: movieList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getAllMoviesSimple,
  });
  // Client-only filters/sort state
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "">("");
  const [sortBy, setSortBy] = useState<string | "">("");

  // unique categories derived from movies
  const allCategories = useMemo(() => {
    const map = new Map<string, { _id: string; categoryName: string }>();
    for (const m of movieList) {
      (m.categories || []).forEach((c: any) => {
        if (c?._id && !map.has(c._id)) map.set(c._id, { _id: c._id, categoryName: c.categoryName });
      });
    }
    return Array.from(map.values()).sort((a, b) => a.categoryName.localeCompare(b.categoryName, "vi"));
  }, [movieList]);

  const normalize = (s: string) => (s || "").toLowerCase();

  const applyFiltersAndSort = useCallback(
    (list: any[]) => {
      let arr = [...list];
      // search by title
      if (searchText.trim()) {
        const q = normalize(searchText.trim());
        arr = arr.filter((m) => normalize(m.title).includes(q));
      }
      // category filter
      if (selectedCategoryId) {
        arr = arr.filter((m) => (m.categories || []).some((c: any) => c._id === selectedCategoryId));
      }
      // status filter removed as per requirement
      // sort
      switch (sortBy) {
        case "releaseDate_desc":
          arr.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
          break;
        case "releaseDate_asc":
          arr.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
          break;
        case "title_asc":
          arr.sort((a, b) => normalize(a.title).localeCompare(normalize(b.title), "vi"));
          break;
        case "title_desc":
          arr.sort((a, b) => normalize(b.title).localeCompare(normalize(a.title), "vi"));
          break;
        case "duration_asc":
          arr.sort((a, b) => (a.duration || 0) - (b.duration || 0));
          break;
        case "duration_desc":
          arr.sort((a, b) => (b.duration || 0) - (a.duration || 0));
          break;
      }
      return arr;
    },
    [searchText, selectedCategoryId, sortBy]
  );

  const nowShowingBase = useMemo(() => movieList.filter((m) => m.status === "dang_chieu"), [movieList]);
  const comingSoonBase = useMemo(() => movieList.filter((m) => m.status === "sap_chieu"), [movieList]);
  const nowShowing = useMemo(() => applyFiltersAndSort(nowShowingBase), [applyFiltersAndSort, nowShowingBase]);
  const comingSoon = useMemo(() => applyFiltersAndSort(comingSoonBase), [applyFiltersAndSort, comingSoonBase]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const handleRegisterClick = () => {
    const token = getAccessToken();
    if (token) {
      toast({ title: "Bạn đã đăng nhập", description: "Bạn đã đăng nhập vào hệ thống." });
      return;
    }
    navigate("/dang-ky");
  };

  // Component cho movie card với animation
  const MovieCard = ({ movie, type = "now-showing" }) => {
    const isComingSoon = type === "coming-soon";
    const accentColor = isComingSoon ? "blue" : "red";
    
    return (
      <div className="group relative">
        <Link
          to={`/phim/${movie._id}`}
          className={`
            flex h-full flex-col bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl 
            shadow-xl overflow-hidden transition-all duration-500 ease-out
            hover:scale-[1.02] hover:shadow-2xl border border-gray-700/50
            ${isComingSoon 
              ? 'hover:shadow-blue-500/25 hover:border-blue-500/50' 
              : 'hover:shadow-red-500/25 hover:border-red-500/50'
            }
            transform-gpu
          `}
        >
          {/* Poster Container */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Status Badge */}
            <div className={`
              absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold
              backdrop-blur-sm border transition-all duration-300
              ${isComingSoon 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                : 'bg-red-500/20 text-red-300 border-red-500/30'
              }
            `}>
              {isComingSoon ? 'Sắp chiếu' : 'Đang chiếu'}
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                backdrop-blur-md border-2 transform scale-75 group-hover:scale-100
                transition-all duration-500 hover:scale-110
                ${isComingSoon 
                  ? 'bg-blue-500/20 border-blue-400/50 text-blue-300' 
                  : 'bg-red-500/20 border-red-400/50 text-red-300'
                }
              `}>
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300 h-14">
              {movie.title}
            </h3>
            
            {/* Movie Info */}
            <div className="mt-auto text-sm text-gray-400">
              <div className="flex items-center gap-2 h-5">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} phút</span>
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</span>
              </div>
              
              {/* Categories */}
              <div className="flex flex-nowrap gap-1 h-7 overflow-hidden">
                {movie.categories.slice(0, 2).map((cat, idx) => (
                  <span 
                    key={cat._id} 
                    className={`
                      px-2 py-1 rounded-md text-xs font-medium transition-colors duration-300 shrink-0
                      ${isComingSoon 
                        ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20' 
                        : 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                      }
                    `}
                  >
                    {cat.categoryName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
            <p className="text-amber-400 text-lg">Đang tải phim...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-400 text-lg">Không thể tải danh sách phim.</p>
        </div>
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
                    <Link to="/lich-chieu" className="inline-block">
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-semibold px-6 py-3 shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0">
                      Đặt vé ngay
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Phim đang chiếu */}
          <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              {/* Filters Bar */}
              <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Tìm theo tên phim..."
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {allCategories.map((c) => (
                    <option key={c._id} value={c._id}>{c.categoryName}</option>
                  ))}
                </select>
                {/* Status select removed */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Sắp xếp</option>
                  <option value="releaseDate_desc">Mới nhất</option>
                  <option value="releaseDate_asc">Cũ nhất</option>
                  <option value="title_asc">Tên A-Z</option>
                  <option value="title_desc">Tên Z-A</option>
                  <option value="duration_asc">Thời lượng tăng dần</option>
                  <option value="duration_desc">Thời lượng giảm dần</option>
                </select>
                <button
                  onClick={() => { setSearchText(""); setSelectedCategoryId(""); setSortBy(""); }}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 transition"
                >
                  Xóa bộ lọc
                </button>
              </div>

              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent to-red-500 rounded-full"></div>
                  <Star className="w-8 h-8 text-red-500" />
                  <div className="w-12 h-1 bg-gradient-to-l from-transparent to-red-500 rounded-full"></div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent mb-4">
                  Phim đang chiếu
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Khám phá những bộ phim hot nhất đang được chiếu tại rạp
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {nowShowing.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="h-full animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <MovieCard movie={movie} type="now-showing" />
                  </div>
                ))}
              </div>

              {nowShowing.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <Star className="w-12 h-12 text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-lg">Hiện tại không có phim nào đang chiếu</p>
                </div>
              )}
            </div>
          </section>

          {/* Phim sắp chiếu */}
          <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">

              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div className="w-12 h-1 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-sky-500 bg-clip-text text-transparent mb-4">
                  Phim sắp chiếu
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Khám phá những bộ phim sắp được chiếu tại rạp
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {comingSoon.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="h-full animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <MovieCard movie={movie} type="coming-soon" />
                  </div>
                ))}
              </div>

              {comingSoon.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-lg">Hiện tại không có phim nào sắp chiếu</p>
                </div>
              )}
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
              <Button onClick={handleRegisterClick} className="bg-custom-gradient-button text-white text-xl font-semibold px-8 py-4 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300">
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