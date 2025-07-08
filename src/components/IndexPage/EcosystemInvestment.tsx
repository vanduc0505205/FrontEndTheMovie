import backgroundImage from "@/assets/images/index/backGround.png";
import imageHome08 from "@/assets/images/index/image-home08.png";
import modeling from "@/assets/icons/modeling.png";
import blockchain from "@/assets/icons/blockchain.png";

const EcosystemInvestment = () => {
  return (
    <section className="relative lg:py-24 overflow-hidden bg-primary-background">
      <img
        src={backgroundImage}
        alt="background image"
        className="absolute inset-0 h-[250px] w-full md:h-full object-cover object-center z-0"
      />

      <div className="relative z-10 container  ">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-10">
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-between h-full">
            <div className="text-left sm:text-center lg:text-left space-y-5 lg:mb-0">
              <p className="text-primary-green-300 text-xl sm:text-2xl font-semibold px-4 sm:px-0">
                Tại sao nên đồng hành cùng Farmblock?
              </p>

              <h2 className="main-title font-bold text-primary-green-400 leading-[2.5rem] sm:leading-[3.2rem] lg:leading-[4rem] px-4 sm:px-0">
                <span className="block">Niềm tin bắt đầu từ</span>
                <span className="block mt-2">Hệ sinh thái minh bạch</span>
              </h2>

              <p className="text-base text-primary-green-400 leading-relaxed px-4 sm:px-0">
                Farmblock không chỉ tối ưu các mắt xích trong chuỗi giá trị nông
                nghiệp mà còn tạo cầu nối quan hành minh bạch, tự nhiên xuất vận
                hành hiệu lệ. Từ tầm xuống người tiêu dùng phải nhỗ, mọi yếu tố
                đều được sỗ hóa, chuẩn hóa và đồng bộ theo dối giàn thực, tạo
                nên một hệ sinh thái nông nghiệp minh bạch, vật sự cần phải có
                thật năng về nông nghiêp sản xuất đó dạng.
              </p>
            </div>

            <div className="flex py-10 lg:py-0 flex-col md:flex-row gap-4">
              <div className=" flex items-center space-x-4 bg-primary-background p-6 shadow-sm border border-[#B4E27E] w-full md:max-w-[calc(50%-8px)] rounded-lg">
                <div className=" w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <img
                    src={modeling}
                    alt="modeling"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-primary-green-200">
                    6 Khối Chức năng được tích hợp & vận hành đồng bộ
                  </h3>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-primary-background p-6 shadow-sm border border-[#B4E27E] w-full md:max-w-[calc(50%-8px)] rounded-lg">
                <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <img
                    src={blockchain}
                    alt="blockchain"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-primary-green-200">
                    100% Dữ liệu được lưu trữ minh bạch với công nghệ Blockchain
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <img
              src={imageHome08}
              alt="Mountain landscape with agricultural terraces"
              className="shadow-2xl w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemInvestment;
