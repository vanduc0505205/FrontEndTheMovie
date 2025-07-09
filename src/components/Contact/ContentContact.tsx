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
                  Hãy cùng tạo nên kiệt tác điện ảnh!
                </h1>
                <div className="space-y-4 text-sm text-primary-green-50 leading-relaxed">
                  <p>
                    Bạn có ý tưởng phim hay, kịch bản hấp dẫn hay đơn giản là mong muốn
                    hợp tác sản xuất phim chất lượng cao?
                  </p>
                  <p>
                    Đội ngũ ALPHACINEMA luôn tìm kiếm những cơ hội hợp tác mới, những ý tưởng
                    sáng tạo và những đối tác cùng chí hướng trong ngành công nghiệp điện ảnh.
                  </p>
                  <p>
                    Dù bạn là đạo diễn, biên kịch, diễn viên hay đơn vị sản xuất, chúng tôi
                    đều sẵn sàng lắng nghe và cùng bạn hiện thực hóa những giấc mơ điện ảnh.
                  </p>
                  <p>
                    Hãy điền vào mẫu liên hệ bên cạnh, đội ngũ của chúng tôi sẽ phản hồi
                    trong thời gian sớm nhất. Cùng nhau, chúng ta sẽ tạo nên những tác phẩm
                    để đời, ghi dấu ấn trong lòng khán giả.
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
                        Ông
                      </SelectItem>
                      <SelectItem
                        value="0"
                        className="h-12 bg-primary-background !hover:bg-primary-green-100"
                      >
                        Bà
                      </SelectItem>
                      <SelectItem
                        value="2"
                        className="h-12 bg-primary-background !hover:bg-primary-green-100"
                      >
                        Công ty
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
                  placeholder="Nội dung chi tiết về dự án/yêu cầu của bạn *"
                  className="w-full p-3 rounded-none bg-primary-green-50 text-sm"
                  rows={5}
                  required
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
                  <strong>Trụ sở chính:</strong> Tòa nhà Alpha, Số 1 Lương Yên, Quận Hai Bà Trưng, Hà Nội
                </p>
                <p className="text-primary-green-50">
                  <strong>Văn phòng đại diện:</strong> Tầng 10, Tòa nhà Bitexco, 2 Hải Triều, Quận 1, TP.HCM
                </p>
                <p className="text-primary-green-50">
                  <strong>Điện thoại:</strong> +84 24 7300 5555 - Ext: 1234
                </p>
                <p className="text-primary-green-50">
                  <strong>Email:</strong> info@alphacinema.vn
                </p>
                <p className="text-primary-green-50">
                  <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:30 - 18:00
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
