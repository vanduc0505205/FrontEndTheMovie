import imageBg from "@/assets/images/operating-model/imgae-replication.png";

const ReplicationModel = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={imageBg}
          alt="Aerial view of aquaculture farms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 text-center px-4 container">
        <h1 className="main-title">
          Mô hình trai mẫu dễ dàng nhận rộng
        </h1>
        
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
            Các vùng trồng trong hệ thống ALPHACINEMA được thiết kế như các mô hình trai mẫu – với quy trình sản xuất bài bản, hạ tầng công nghệ 
            tích hợp và tiêu chuẩn chất lượng rõ ràng. Đây là nền tảng để ALPHACINEMA có thể nhân rộng, chuyển giao kỹ thuật và mở rộng hợp tác 
            đầu tư, sản xuất hoặc nghiên cứu theo từng khu vực cụ thể.
          </p>
          
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Hãy kết nối cùng chúng tôi để hợp tác quy hoạch, vận hành và mở rộng mô hình trai mẫu tại địa phương của bạn!
          </p>
        </div>

        <button className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
          Liên hệ hợp tác
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      
    </section>
  )
}

export default ReplicationModel