import React from 'react';
import Image from 'next/image'; // Sử dụng Image component

// Dữ liệu mẫu cho testimonial (thay thế bằng dữ liệu thật)
const testimonial = {
  stars: 5, // Số sao đánh giá
  text: 'Dịch vụ rất tuyệt vời! Bác sĩ tận tình, chu đáo, giải thích cặn kẽ. Cơ sở vật chất sạch sẽ, hiện đại. Tôi rất hài lòng và chắc chắn sẽ quay lại.',
  authorName: 'Chị Nguyễn Thị Lan',
  authorTitle: 'Khách hàng',
  authorAvatar: '/images/avatar-lan.jpg', // Đường dẫn ảnh placeholder
};

export const TestimonialsSection = () => {
  return (
    // Section với nền xanh dương và ảnh nền mờ (tùy chọn)
    <section className="bg-blue-600 text-white py-16 px-4 relative overflow-hidden">
      {/* (Tùy chọn) Ảnh nền mờ */}
      <div className="absolute inset-0 opacity-10 z-0">
        {/* <Image src="/images/background-pattern.svg" layout="fill" objectFit="cover" alt="Background pattern" /> */}
        [Ảnh nền mờ nếu có]
      </div>

      <div className="container mx-auto text-center relative z-10">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold mb-12">
          Khách Hàng Nói Gì Về Chúng Tôi
        </h2>

        {/* Thẻ Testimonial */}
        <div className="bg-white text-gray-800 rounded-lg shadow-xl max-w-2xl mx-auto p-8 relative">
          {/* Dấu nháy kép trang trí (tùy chọn) */}
          <span className="absolute top-4 left-4 text-6xl text-blue-100 opacity-50 font-serif">“</span>
          <span className="absolute bottom-4 right-4 text-6xl text-blue-100 opacity-50 font-serif">”</span>

          {/* Đánh giá sao */}
          <div className="flex justify-center mb-4">
            {Array.from({ length: testimonial.stars }).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.45a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.38-2.45a1 1 0 00-1.175 0l-3.38 2.45c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.04 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z"></path></svg>
            ))}
          </div>

          {/* Nội dung đánh giá */}
          <p className="text-gray-600 italic mb-6 leading-relaxed">
          </p>

          {/* Thông tin người đánh giá */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-blue-200">
              <Image src={testimonial.authorAvatar} alt={testimonial.authorName} width={48} height={48} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{testimonial.authorName}</p>
              <p className="text-sm text-gray-500">{testimonial.authorTitle}</p>
            </div>
          </div>

          {/* Nút điều hướng slider (Placeholder) */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white text-2xl hidden sm:block">←</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white text-2xl hidden sm:block">→</button>
        </div>
      </div>
    </section>
  );
};