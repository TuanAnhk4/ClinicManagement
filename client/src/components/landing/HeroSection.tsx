// src/components/landing/HeroSection.tsx
import Link from 'next/link';
// (Tùy chọn) Import component Image của Next.js nếu bạn muốn tối ưu hình ảnh
// import Image from 'next/image';

export const HeroSection = () => {
  return (
    // Section chính với nền gradient hoặc màu nhạt
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20 px-4">
      <div className="container mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Phần Text bên trái */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Đối Tác Tin Cậy Cho Sức Khỏe & Hạnh Phúc Của Bạn
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao với đội ngũ chuyên gia tận tâm. Đặt lịch hẹn trực tuyến ngay hôm nay để được tư vấn.
          </p>
          {/* Nút Kêu Gọi Hành Động */}
          <Link href="/login"> {/* Nên dẫn đến login nếu chưa đăng nhập */}
            <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg">
              Đặt Lịch Hẹn Ngay
            </button>
          </Link>

          {/* Ba thẻ thông tin nhỏ bên dưới */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {/* Thẻ 1 */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
              {/* Thêm Icon ở đây */}
              <h4 className="font-semibold text-blue-700 mb-1">Bác Sĩ Chuyên Môn Cao</h4>
              <p className="text-sm text-gray-500">Đội ngũ y bác sĩ giàu kinh nghiệm, tận tâm.</p>
            </div>
            {/* Thẻ 2 */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
              {/* Thêm Icon ở đây */}
              <h4 className="font-semibold text-blue-700 mb-1">Trang Thiết Bị Hiện Đại</h4>
              <p className="text-sm text-gray-500">Ứng dụng công nghệ tiên tiến trong chẩn đoán.</p>
            </div>
            {/* Thẻ 3 */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
              {/* Thêm Icon ở đây */}
              <h4 className="font-semibold text-blue-700 mb-1">Dịch Vụ Chu Đáo</h4>
              <p className="text-sm text-gray-500">Luôn đặt sự thoải mái của bệnh nhân lên hàng đầu.</p>
            </div>
          </div>
        </div>

        {/* Phần Hình Ảnh bên phải (Ẩn trên mobile) */}
        <div className="hidden lg:block relative text-center">
          {/* Thay bằng component Image của Next.js */}
          {/* <Image src="/path/to/your/doctor-image.png" alt="Bác sĩ" width={400} height={500} className="inline-block" /> */}
          <div className="bg-gray-300 h-96 w-72 inline-block rounded-lg shadow-lg"> {/* Placeholder */}
            [Hình ảnh bác sĩ/phòng khám]
          </div>
          {/* Có thể thêm các hình tròn trang trí xung quanh ảnh nếu muốn */}
        </div>
      </div>
    </section>
  );
};