import logo from "@/assets/images/logoBanner.png";

const PartnerSection = () => {
  return (
    <section className="bg-[#10451D] text-white py-20">
      <div className="container text-center">
        <p className="text-primary-green-100 text-2xl font-semibold mb-6">
          Hợp tác vì sự bền vững
        </p>
        <h2 className="main-title text-primary-green-50  font-bold mb-10">
          Chúng tôi đồng hành cùng những người tiên phong
        </h2>

        <div className="h-[2px] bg-white/10 w-full mb-10" />

        <div className="flex flex-col items-center space-y-20">
          <div className="flex flex-nowrap overflow-hidden lg:flex-row justify-center gap-10">
            <img
              src={logo}
              alt="Farmblock"
              className="w-15 h-12 object-contain"
            />

            <img
              src={logo}
              alt="Farmblock"
              className="w-15 h-12 object-contain"
            />

            <img
              src={logo}
              alt="Farmblock"
              className="w-15 h-12 object-contain"
            />
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-nowrap overflow-hidden lg:flex-row justify-center gap-10">
              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />

              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />

              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />

              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-20 mt-20">
          <div className="flex flex-nowrap overflow-hidden lg:flex-row justify-center gap-10">
            <img
              src={logo}
              alt="Farmblock"
              className="w-15 h-12 object-contain"
            />

            <img
              src={logo}
              alt="Farmblock"
              className="w-15 h-12 object-contain"
            />

            <img
              src={logo}
              alt="Farmblock"
              className="w-15 h-12 object-contain"
            />
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-nowrap overflow-hidden lg:flex-row justify-center gap-10">
              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />

              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />

              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />

              <img
                src={logo}
                alt="Farmblock"
                className="w-15 h-12 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
