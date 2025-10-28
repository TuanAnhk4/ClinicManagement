// src/components/landing/AboutUsSection.tsx
import React from 'react';
import Link from 'next/link';
// (Tùy chọn) Import Image component nếu dùng ảnh thật
// import Image from 'next/image';

export const AboutUsSection = () => {
  return (
    // Section với nền xanh dương như ảnh mẫu
    <section className="bg-blue-600 text-white py-16 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Phần Hình Ảnh bên trái */}
        <div className="relative">
          {/* Bạn có thể dùng 1 hoặc 2 ảnh ở đây */}
          {/* Ví dụ Placeholder */}
          <div className="bg-white p-2 rounded-lg shadow-lg mb-4 transform -rotate-3">
             {/* <Image src="/path/to/image1.jpg" alt="Team discussing" width={400} height={250} className="rounded-md"/> */}
             <div className="bg-gray-300 h-48 w-full rounded-md">[Ảnh 1]</div>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-lg ml-8 transform rotate-2">
             {/* <Image src="/path/to/image2.jpg" alt="Meeting" width={300} height={200} className="rounded-md"/> */}
             <div className="bg-gray-300 h-40 w-full rounded-md">[Ảnh 2]</div>
          </div>
        </div>

        {/* Phần Text bên phải */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Về Chúng Tôi
          </h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Phòng khám của chúng tôi được thành lập với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, dễ dàng tiếp cận cho mọi người. Chúng tôi tin rằng sức khỏe là tài sản quý giá nhất.
          </p>

          {/* Các điểm nổi bật (checklist) */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              {/* Thay bằng icon check */}
              <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Chăm sóc sức khỏe chất lượng cao.
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Đội ngũ bác sĩ chuyên môn giỏi.
            </li>
             <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Nghiên cứu và ứng dụng công nghệ mới.
            </li>
          </ul>

          {/* Nút Khám Phá Thêm */}
          <Link href="/about"> {/* Link đến trang Giới thiệu chi tiết */}
            <button className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-100 transition-colors">
              Khám Phá Thêm
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};