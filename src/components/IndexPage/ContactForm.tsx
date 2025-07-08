import { ChevronRight } from "lucide-react";

import logo from "@/assets/images/logo.png";
import imagehome09 from "@/assets/images/index/image-home09.png";
import imagehome10 from "@/assets/images/index/image-home10.png";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  return (
    <div className="relative overflow-hidden py-5 lg:py-20">
      <img
        src={imagehome10}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 z-10 bg-custom-gradient-form"></div>

      <div className="container py-10 lg:py-20 relative z-20">
        <div className=" bg-white/80 shadow-lg flex flex-col lg:flex-row overflow-hidden">
          <div className="lg:w-1/2 w-full">
            <img
              src={imagehome09}
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:w-1/2 w-full p-6 lg:p-10 bg-custom-gradient-form-02 text-white">
            <div className="flex items-center mb-6">
              <img src={logo} alt="logo" className="h-12 w-auto" />
              <h2 className="text-2xl lg:text-3xl font-semibold ml-3">
                FarmBlock
              </h2>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-primary-green-100 !leading-snug">
              Hãy cùng chúng tôi viết tiếp câu chuyện về Tây Nguyên
            </h2>

            <p className="text-sm lg:text-sm mb-6 text-white/90 leading-relaxed">
              Dự án nông nghiệp công nghệ cao FarmBlock là nơi thiên nhiên, con
              người và công nghệ cùng tạo nên những giá trị bền vững.
              <br /> <br />
              Hãy liên hệ với chúng tôi để cùng khám phá những cách để bạn có
              thể trở thành một phần của hành trình này.
            </p>

            {/* Form */}
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
      </div>
    </div>
  );
};

export default ContactForm;
