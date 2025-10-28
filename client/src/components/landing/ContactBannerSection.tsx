// src/components/landing/ContactBannerSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const ContactBannerSection = () => {
  return (
    // Section với nền xanh dương đậm
    <section className="bg-blue-600 py-12 px-4 mt-16 relative overflow-hidden"> {/* Thêm mt-16 để tạo khoảng cách */}
      <div className="container mx-auto grid md:grid-cols-12 gap-8 items-center relative z-10">

        {/* Phần ảnh bên trái (chiếm 3/12 cột) */}
        <div className="hidden md:block md:col-span-3">
          {/* Thay bằng component Image */}
          {/* <Image src="/images/contact-bg-left.jpg" alt="Medical team" width={300} height={200} className="rounded-lg opacity-80"/> */}
          <div className="bg-gray-400 h-40 w-full rounded-lg opacity-80">[Ảnh Trái]</div>
        </div>

        {/* Phần nội dung ở giữa (chiếm 6/12 cột) */}
        <div className="md:col-span-6 text-center text-white">
          <h2 className="text-2xl font-semibold mb-3">
            Bạn Có Câu Hỏi? Hãy Liên Hệ Với Chúng Tôi!
          </h2>
          {/* Số điện thoại lớn */}
          <p className="text-4xl font-bold mb-6">
            +84 123-456-6630 {/* Thay bằng SĐT thật */}
          </p>
          {/* Nút Contact Us */}
          <Link href="/contact">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              Liên Hệ Ngay
            </button>
          </Link>
        </div>

        {/* Phần ảnh bên phải (chiếm 3/12 cột) */}
        <div className="hidden md:block md:col-span-3 text-right">
           {/* Thay bằng component Image */}
           {/* <Image src="/images/contact-doctor-phone.png" alt="Doctor on phone" width={200} height={300} className="inline-block"/> */}
           <div className="bg-gray-400 h-60 w-40 inline-block rounded-lg">[Ảnh Phải]</div>
        </div>

      </div>
       {/* (Tùy chọn) Thêm hiệu ứng nền mờ nếu muốn */}
       {/* <div className="absolute inset-0 bg-blue-700 opacity-20 z-0"></div> */}
    </section>
  );
};