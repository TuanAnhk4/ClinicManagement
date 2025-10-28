// src/components/landing/WhyChooseUsSection.tsx
import React from 'react';
// (Tùy chọn) Import icons nếu bạn dùng react-icons
// import { FaHeadset, FaCalendarCheck } from 'react-icons/fa';

export const WhyChooseUsSection = () => {
  return (
    // Section với nền xanh dương như ảnh mẫu
    <section className="bg-blue-600 text-white py-16 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Phần Text bên trái */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Tại Sao Chọn Phòng Khám Của Chúng Tôi? {/* Sửa lại tên nếu cần */}
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Chúng tôi tự hào mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, với đội ngũ y bác sĩ tận tâm và trang thiết bị hiện đại. Sự hài lòng và sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
          </p>

          {/* Các điểm nổi bật */}
          <div className="space-y-6">
            {/* Điểm 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-white text-blue-600 rounded-full p-3">
                {/* Thay bằng icon thật */}
                {/* <FaHeadset className="w-6 h-6" /> */} ❤️
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Hỗ Trợ 24/7</h4>
                <p className="text-blue-100 text-sm">Đội ngũ luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn mọi lúc.</p>
              </div>
            </div>
            {/* Điểm 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-white text-blue-600 rounded-full p-3">
                {/* Thay bằng icon thật */}
                {/* <FaCalendarCheck className="w-6 h-6" /> */} 🗓️
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Đặt Lịch Dễ Dàng</h4>
                <p className="text-blue-100 text-sm">Hệ thống đặt lịch trực tuyến nhanh chóng và tiện lợi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phần Hình Ảnh/Video bên phải */}
        <div className="relative text-center">
          {/* Thay bằng component Image hoặc video */}
          {/* <Image src="/path/to/team-image.jpg" alt="Đội ngũ bác sĩ" width={500} height={400} className="rounded-lg shadow-lg" /> */}
          <div className="bg-gray-400 h-80 w-full inline-block rounded-lg shadow-lg relative"> {/* Placeholder */}
            [Hình ảnh/Video đội ngũ bác sĩ]
            {/* Nút Play (nếu là video) */}
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.5-10.5l5 3.5-5 3.5v-7z"></path></svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};