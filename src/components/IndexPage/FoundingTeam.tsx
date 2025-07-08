import founder from "@/assets/images/index/founder.png";

const FoundingTeam = () => {
  return (
    <section className="py-10 lg:py-20 bg-primary-green-50">
      <div className="container ">
        <div className="text-center mb-20">
          <h2 className="main-title text-primary-green-400 mt-10 mb-4">
            Đội ngũ sáng lập
          </h2>
        </div>

        {/* Wrapper scroll horizontal on mobile */}
        <div className="block lg:hidden overflow-x-auto">
          <div className="flex gap-6 w-max px-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-w-[280px] max-w-[320px] flex-shrink-0 shadow-sm overflow-hidden bg-white"
              >
                <div className="text-center">
                  <div className="mx-auto relative">
                    <img src={founder} alt="" className="w-full h-full" />
                  </div>
                </div>

                <div className="bg-[#13331C] text-white p-6">
                  <h3 className="font-bold mb-1 text-primary-green-100 text-2xl">
                    Họ và tên
                  </h3>
                  <p className="text-primary-green-100 text-lg mb-3 font-bold">
                    Chức danh
                  </p>
                  <div className="h-[1px] w-full bg-[#204D2B] my-3" />
                  <p className="text-white text-base leading-relaxed">
                    Đây là ví dụ đoạn giới thiệu ngắn về một thành viên trong
                    đội ngũ sáng lập của Farmblock.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid layout for desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="shadow-sm overflow-hidden">
              <div className="text-center">
                <div className="mx-auto relative">
                  <img src={founder} alt="" className="w-full h-full" />
                </div>
              </div>

              <div className="bg-[#13331C] text-white p-6">
                <h3 className="text-2xl font-bold mb-1 text-primary-green-100">
                  Họ và tên
                </h3>
                <p className="text-primary-green-100 text-lg mb-3">Chức danh</p>
                <div className="h-[1px] w-full bg-[#204D2B] my-3" />
                <p className="text-white text-base leading-relaxed">
                  Đây là ví dụ đoạn giới thiệu ngắn về một thành viên trong đội
                  ngũ sáng lập của Farmblock.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundingTeam;
