import logo from "@/assets/images/logoBanner.png";
import AboutUsImage1 from "@/assets/images/about-us/about-us-image-1.png";
import BgAboutUsInfo from "@/assets/images/about-us/bg-about-us-info.png";

const Info = () => {
  return (
    <section className="relative bg-about-us-info">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src={BgAboutUsInfo}
          alt="Background AboutUs Info"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
        linear-gradient(180deg, rgba(14, 59, 22, 0.85) 0%, rgba(45, 102, 57, 0.5) 100%),
        linear-gradient(180deg, #0E3B16 0%, rgba(45, 102, 57, 0) 100%)
      `,
        }}
      ></div>

      <div className="container relative  z-10">
        <div className="w-full py-20 flex justify-center">
          <div className="grid w-full lg:grid-cols-2 overflow-hidden">
            <div className="order-2 lg:order-1 w-full h-full">
              <img
                src={AboutUsImage1}
                alt="AboutUs-image-1"
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>

            <div className="order-1 lg:order-2 px-10 rounded-r-lg flex flex-col justify-center space-y-5 bg-about-us-content">
              <h1 className="text-primary-green-100 text-3xl md:text-4xl font-bold">
                Từ miền đất đỏ bazan trù phú
              </h1>
              <div className="space-y-4 text-primary-green-50 text-sm leading-relaxed">
                <p>
                  Tây Nguyên là vùng đất đỏ bazan nơi những hạt cà phê đậm đà và
                  những trái sầu riêng ngọt ngào lớn lên với khí hậu nhiệt đới
                  gió mùa cao nguyên. Hơn 30ha đất đai trù phú ở đây là nơi
                  chúng tôi bắt đầu, không chỉ để trồng cây, mà để gieo trồng
                  những hạt giống của một nền nông nghiệp bền vững.
                </p>
                <p>
                  Chúng tôi tin rằng nông nghiệp không chỉ là canh tác, mà là
                  câu chuyện về con người, thiên nhiên, và tương lai.
                </p>
                <p>
                  Với tâm huyết của nông dân Tây Nguyên và công nghệ tiên phong
                  từ Israel, chúng tôi chăm sóc từng luống đất, minh bạch từng
                  vụ mùa, từ đó dẫn đường để mang nông sản Việt đến bàn ăn của
                  các gia đình trên thế giới.
                </p>
                <p>
                  Từ 30ha hôm nay, chúng tôi mơ về 200ha – một cánh đồng thông
                  minh, nơi thiên nhiên và công nghệ hòa quyện, nơi mỗi người
                  nông dân là một người anh hùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-10 pb-28 text-center relative z-10">
        <p className="text-primary-green-100 text-2xl font-semibold mb-4">
          Hợp tác vì sự bền vững
        </p>
        <h2 className="main-title text-primary-green-50 mb-20">
          Chúng tôi đồng hành cùng những người tiên phong
        </h2>
        <div className="w-full h-[1px] bg-primary-green-300 mb-10 "></div>  
        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-nowrap overflow-hidden lg:flex-row justify-center gap-10">
            <img
              src={logo}
              alt="ALPHACINEMA"
              className="w-15 h-10 object-contain"
            />
            <img
              src={logo}
              alt="ALPHACINEMA"
              className="w-15 h-10 object-contain"
            />
            <img
              src={logo}
              alt="ALPHACINEMA"
              className="w-15 h-10 object-contain"
            />
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-nowrap overflow-hidden lg:flex-row justify-center gap-10">
              <img
                src={logo}
                alt="ALPHACINEMA"
                className="w-15 h-10 object-contain"
              />
              <img
                src={logo}
                alt="ALPHACINEMA"
                className="w-15 h-10 object-contain"
              />
              <img
                src={logo}
                alt="ALPHACINEMA"
                className="w-15 h-10 object-contain"
              />
              <img
                src={logo}
                alt="ALPHACINEMA"
                className="w-15 h-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
