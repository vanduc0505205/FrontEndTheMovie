import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import backgroundImage from "@/assets/images/contact/backGroundContact.png";
import backgroundImageMobile from "@/assets/images/contact/bg-about-us-info-mobile.png";

const ContentContact = () => {
  return (
    <section className="min-h-screen relative overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={backgroundImageMobile} />
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover opacity-100"
          />
        </picture>
      </div>
      <div className="absolute inset-0 z-[1] lg:bg-custom-layered"></div>
      <div className="container py-10 lg:py-20 relative z-10 px-4">
        <div className="lg:bg-none lg:bg-transparent bg-contact-info p-4 lg:p-0">
          <div className="grid lg:grid-cols-2 gap-10 mb-10 items-stretch">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h1 className="text-4xl md:text-5xl text-primary-green-100 font-bold mb-6 leading-tight">
                  Hãy bắt đầu hành trình cùng chúng tôi!
                </h1>
                <div className="space-y-4 text-sm text-primary-green-50 leading-relaxed">
                  <p>
                    Bạn yêu thiên nhiên, quan tâm đến đầu tư bền vững, đam mê
                    các mô hình công nghệ tiên tiến?
                  </p>
                  <p>
                    Bạn muốn hiểu cách chúng tôi kết nối đất đỏ Tây Nguyên với
                    những tiến bộ công nghệ mới nhất – hoặc đơn giản là mong một
                    lần đứng giữa cánh đồng cà phê, lắng nghe câu chuyện của
                    người nông dân bản địa?
                  </p>
                  <p>
                    Hãy chia sẻ điều bạn tìm kiếm – chúng tôi luôn sẵn sàng lắng
                    nghe và đồng hành.
                  </p>
                  <p>
                    Từ 30 ha hôm nay đến 200 ha ngày mai, hành trình của
                    ALPHACINEMA đang rộng mở – và chúng tôi mời bạn cùng viết tiếp
                    câu chuyện phát triển bền vững ấy, từ từng góc cây đến những
                    giá trị thật.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center h-full">
              <form className="space-y-4 text-primary-green-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select defaultValue="1">
                    <SelectTrigger className="bg-primary-green-50 h-12 rounded-none">
                      <SelectValue placeholder="Chọn danh xưng" />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem
                        value="1"
                        className="h-12 bg-primary-background !hover:bg-primary-green-100"
                      >
                        Anh
                      </SelectItem>
                      <SelectItem
                        value="0"
                        className="h-12 bg-primary-background !hover:bg-primary-green-100"
                      >
                        Chị
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Họ và tên *"
                    className="rounded-none h-12 p-3 bg-primary-green-50 text-sm w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Số điện thoại *"
                    className="rounded-none h-12 p-3 bg-primary-green-50 text-sm w-full"
                    required
                  />

                  <Input
                    type="email"
                    placeholder="E-Mail *"
                    className="rounded-none h-12 p-3 bg-primary-green-50 text-sm w-full"
                    required
                  />
                </div>

                <Textarea
                  placeholder="Tin nhắn"
                  className="w-full p-3 rounded-none bg-primary-green-50 text-sm"
                  rows={5}
                ></Textarea>

                <button
                  type="submit"
                  className="rounded-sm w-full py-3 flex  items-center justify-center gap-2 bg-custom-gradient-button text-white font-semibold hover:brightness-110 transition"
                >
                  Liên hệ <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-20 lg:h-80 ">
            <div className="order-2 lg:order-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.734034872638!2d105.84117131540286!3d21.003091786012245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab879eccc5d1%3A0x8d876fc1e95f932e!2zMTIwIFAuIEPhuqd1IEPhuqd1LCBQaMaw4budbmcgQsOsLCBRdeG6rW4gQ8O0LCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="lg:p-6 text-white flex flex-col justify-center order-1 lg:order-2">
              <h3 className="text-4xl font-bold mb-4 text-primary-green-100">
                Thông tin liên hệ
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-primary-green-50">
                  <strong>Địa chỉ:</strong> 120 phố A, Phường B, Quận C, Thành
                  phố Đ, Hà Nội, Việt Nam
                </p>
                <p className="text-primary-green-50">
                  <strong>Số điện thoại:</strong> +841-900-247-05
                </p>
                <p className="text-primary-green-50">
                  <strong>E-Mail:</strong> Gmail@ALPHACINEMA.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentContact;
