import image1 from "@/assets/images/operating-model/image-method1.png";
import greenHouse from "@/assets/images/operating-model/image-method-greenhouse.png";
import juniper from "@/assets/images/operating-model/image-method-juniper.png";
import image2 from "@/assets/images/operating-model/image-method2.png";
import image3 from "@/assets/images/operating-model/image-method3.png";

const FarmingMethod = () => {
  return (
    <section className="py-20">
  <div className="container grid md:grid-cols-2 items-start gap-10">
    <div>
      <img
        src={image1}
        alt="Modern Farming"
      />
    </div>

    <div className="flex flex-col ">
      <h2 className="main-title text-primary-green-400  ">
        Áp dụng các phương pháp canh tác hiện đại
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-primary-green-50 rounded-lg p-4 shadow-sm flex flex-col items-start gap-3">
          <img src={greenHouse} alt="Planning" className="w-15 h-20" />
          <div>
            <h3 className="font-bold text-primary-green-200 mb-3">Quy hoạch bài bản</h3>
            <p className="text-sm text-primary-green-400">
              Các vùng trồng được thiết kế dưới sự cố vấn của chuyên gia trong nước và quốc tế, với ảnh hưởng dài hạn và phân khu rõ ràng.
            </p>
          </div>
        </div>

        <div className="bg-primary-green-50 rounded-lg p-4 flex flex-col items-start gap-3">
          <img src={juniper} alt="Diverse Crops" className="w-15 h-20" />
          <div>
            <h3 className="font-bold text-primary-green-200 mb-3">Danh mục nông sản đa dạng</h3>
            <p className="text-sm text-primary-green-400">
              Các giống cây được lựa chọn dựa trên tính sinh thái và hiệu quả mùa vụ, kết hợp cây dài và ngắn ngày.
            </p>
          </div>
        </div>

        <div className="bg-primary-green-50 rounded-lg p-4 flex flex-col items-start gap-3">
          <img src={image2} alt="High Yield" className="w-15 h-20" />
          <div>
            <h3 className="font-bold text-primary-green-200 mb-3">Giống cây năng suất cao</h3>
            <p className="text-sm text-primary-green-400">
              Sử dụng giống cây trồng mới, nghiên cứu và kiểm chứng để tăng năng suất, giảm rủi ro.
            </p>
          </div>
        </div>

        <div className="bg-primary-green-50 rounded-lg p-4 flex flex-col items-start gap-3">
          <img src={image3} alt="Quality Standards" className="h-20" />
          <div>
            <h3 className="font-bold text-primary-green-200 mb-3">Tiêu chuẩn chất lượng uy tín</h3>
            <p className="text-sm text-primary-green-400">
              Canh tác theo tiêu chuẩn GlobalG.A.P, ISO 22000 và HACCP đảm bảo chất lượng và nhu cầu thị trường.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

export default FarmingMethod