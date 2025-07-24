import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { slideData } from "@/config";
import { BKLR, deMen, dieuUocCuoiCuong, elio, maXuongMia, motNuaHoanHao, nhiemVuBatKhaThi, phimMai, phimXitrum, superman, trangQuynhNhi, utlan } from "@/assets/path";

const movies = [
	{
		id: 1,
		title: "NHIỆM VỤ: BẤT KHẢ THI - KỲ THI CUỐI CÙNG",
		poster: nhiemVuBatKhaThi,
		genre: "Hành động",
		releaseDate: "30/05/2025",
	},
	{
		id: 2,
		title: "SUPERMAN-T13",
		poster: superman,
		genre: "Hành động",
		releaseDate: "11/07/2025",
	},
	{
		id: 3,
		title: "BÍ KÍP LUYỆN RỒNG - K",
		poster: BKLR,
		genre: "Phiêu lưu",
		releaseDate: "16/06/2025",
	},
	{
		id: 4,
		title: "PHIM XÌ TRUM-P (Lồng tiếng)",
		poster: phimXitrum,
		genre: "Hoạt hình",
		releaseDate: "18/07/2025",
	},
	{
		id: 5,
		title: "ELIO - CẬU BÉ ĐẾN TỪ TRÁI ĐẤT-P",
		poster: elio,
		genre: "Hoạt hình",
		releaseDate: "20/06/2025",
	},
	{
		id: 6,
		title: "ÚT LAN: OÁN LINH GIỮ CỬA-T18",
		poster: utlan,
		genre: "Kinh dị",
		releaseDate: "20/06/2025",
	},
	{
		id: 7,
		title: "ĐỀ MÈN: CUỘC PHIÊU LƯU TỚI XÓM LẤY LỘI",
		poster: deMen,
		genre: "Hoạt hình",
		releaseDate: "30/05/2025",
	},
	{
		id: 8,
		title: "TRẠNG QUỲNH NHÍ: TRUYỀN THUYẾT KIM NGƯU",
		poster: trangQuynhNhi,
		genre: "Hoạt hình",
		releaseDate: "16/06/2025",
	},
	{
		id: 9,
		title: "ĐIỀU ƯỚC CUỐI CÙNG-T16",
		poster: dieuUocCuoiCuong,
		genre: "Tâm lý, tình cảm",
		releaseDate: "04/07/2025",
	},
	{
		id: 10,
		title: "MA XƯỚNG MÍA - T18",
		poster: maXuongMia,
		genre: "Kinh dị",
		releaseDate: "11/07/2025",
	},
	{
		id: 11,
		title: "MỘT NỬA HOÀN HẢO-T16",
		poster: motNuaHoanHao,
		genre: "Tâm lý, tình cảm",
		releaseDate: "04/07/2025",
	},
];

const Content = () => {
    const autoplay = Autoplay({ delay: 2000, stopOnInteraction: false });

    return (
        <div>
            {/* Hero Section */}
            <section className="pt-20 pb-20 bg-custom-gradient-content">
                <div className="container">
                    <div className="rounded-xl overflow-hidden bg-primary-green-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-1 lg:order-1">
                                <img
                                    src={phimMai}
                                    alt="Đặt vé xem phim"
                                    className="shadow-2xl w-full h-[250px] lg:h-[400px]"
                                />
                            </div>
                            <div className="order-2 lg:order-2 space-y-6 px-4 lg:px-0">
                                <h1 className="text-3xl lg:text-5xl font-bold text-primary-green-200 leading-tight">
                                    Đặt vé xem phim trực tuyến dễ dàng
                                </h1>
                                <p className="text-base text-primary-green-400 leading-relaxed pr-6">
                                    Trải nghiệm đặt vé xem phim nhanh chóng, tiện lợi và bảo mật.
                                    Khám phá các bộ phim hot nhất, chọn suất chiếu phù hợp và nhận vé
                                    ngay trên website!
                                </p>
                                <ul className="list-disc pl-5 text-primary-green-400 text-sm">
                                    <li>Đặt vé mọi lúc, mọi nơi</li>
                                    <li>Thanh toán trực tuyến an toàn</li>
                                    <li>Chọn chỗ ngồi yêu thích</li>
                                    <li>Nhận thông báo phim mới & ưu đãi</li>
                                </ul>
                                <Button
                                    style={{ marginBottom: "10px" }}
                                    className="bg-custom-gradient-button text-white text-xl font-semibold px-2 py-2 mb-3 lg:mb-0"
                                >
                                    Đặt vé ngay
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danh sách phim đang chiếu*/}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-left mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-primary-green-300 mb-4">
                            Phim đang chiếu
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className="bg-primary-green-10 rounded-xl shadow-md overflow-hidden flex flex-col"
                            >
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-3 flex-1 flex flex-col">
                                    <h3 className="font-bold text-base text-primary-green-200 mb-1 line-clamp-2">
                                        {movie.title}
                                    </h3>
                                    <span className="text-xs text-primary-green-400 mb-1">
                                        {movie.genre}
                                    </span>
                                    <span className="text-xs text-primary-green-400">
                                        {movie.releaseDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="py-10 lg:py-20 bg-primary-green-50">
                <div className=" mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-primary-green-300 mb-6">
                            Công nghệ của ALPHACINEMA
                        </h2>
                        <p className="main-title font-bold text-primary-green-400 mx-auto">
                            Trải nghiệm điện ảnh đỉnh cao với công nghệ
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
                                            <div className="absolute inset-0 bg-custom-gradient-carousel z-10"></div>
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

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl lg:text-4xl font-bold text-primary-green-300 mb-4">
                            Tại sao chọn chúng tôi?
                        </h2>
                        <p className="text-primary-green-400 text-base">
                            Website đặt vé xem phim hàng đầu Việt Nam với trải nghiệm người dùng tuyệt
                            vời.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-primary-green-10 rounded-xl p-8 shadow-md text-center">
                            <h3 className="font-bold text-xl text-primary-green-200 mb-2">
                                Giao diện thân thiện
                            </h3>
                            <p className="text-primary-green-400">
                                Dễ dàng tìm kiếm phim, rạp và suất chiếu phù hợp.
                            </p>
                        </div>
                        <div className="bg-primary-green-10 rounded-xl p-8 shadow-md text-center">
                            <h3 className="font-bold text-xl text-primary-green-200 mb-2">
                                Thanh toán linh hoạt
                            </h3>
                            <p className="text-primary-green-400">
                                Hỗ trợ nhiều hình thức thanh toán trực tuyến an toàn.
                            </p>
                        </div>
                        <div className="bg-primary-green-10 rounded-xl p-8 shadow-md text-center">
                            <h3 className="font-bold text-xl text-primary-green-200 mb-2">
                                Ưu đãi hấp dẫn
                            </h3>
                            <p className="text-primary-green-400">
                                Nhận ưu đãi, voucher và thông báo phim mới mỗi ngày.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-primary-green-50">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl lg:text-4xl font-bold text-primary-green-300 mb-6">
                        Sẵn sàng đặt vé xem phim?
                    </h2>
                    <p className="text-primary-green-400 text-base mb-8">
                        Đăng ký tài khoản ngay để nhận nhiều ưu đãi và trải nghiệm dịch vụ tốt
                        nhất!
                    </p>
                    <Button className="bg-custom-gradient-button text-white text-xl font-semibold px-8 py-4">
                        Đăng ký ngay
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Content;
