// src/components/landing/RecentArticlesSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Sử dụng Image component của Next.js

// Dữ liệu mẫu cho các bài viết (bạn nên thay thế bằng dữ liệu thật hoặc fetch từ API)
const articles = [
  {
    imageUrl: '/images/article1.jpg', // Đường dẫn ảnh placeholder
    author: 'Bs. Nguyễn Văn A',
    date: '26 Tháng 10, 2025',
    title: 'Cách Phòng Ngừa Bệnh Cảm Cúm Hiệu Quả Mùa Mưa',
    link: '/blog/bai-viet-1',
  },
  {
    imageUrl: '/images/article2.jpg', // Đường dẫn ảnh placeholder
    author: 'Bs. Trần Thị B',
    date: '25 Tháng 10, 2025',
    title: 'Tầm Quan Trọng Của Việc Khám Sức Khỏe Định Kỳ',
    link: '/blog/bai-viet-2',
  },
  {
    imageUrl: '/images/article3.jpg', // Đường dẫn ảnh placeholder
    author: 'Phòng Khám ABC',
    date: '24 Tháng 10, 2025',
    title: 'Phòng Khám ABC Ra Mắt Dịch Vụ Đặt Lịch Trực Tuyến',
    link: '/blog/bai-viet-3',
  },
];

export const RecentArticlesSection = () => {
  return (
    // Section với nền trắng hoặc xám nhạt
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto text-center">
        {/* Tiêu đề và Mô tả */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bài Viết & Tin Tức Mới Nhất
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Cập nhật những thông tin y tế hữu ích và tin tức mới nhất từ phòng khám của chúng tôi.
        </p>

        {/* Lưới các thẻ bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl">
              {/* Ảnh bài viết */}
              <Link href={article.link}>
                <div className="relative h-48 w-full"> {/* Đặt chiều cao cố định cho ảnh */}
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    layout="fill" // Fill sẽ tự điều chỉnh kích thước
                    objectFit="cover" // Cover đảm bảo ảnh lấp đầy khung mà không bị méo
                    className="cursor-pointer"
                  />
                </div>
              </Link>

              {/* Nội dung thẻ */}
              <div className="p-6">
                {/* Meta data */}
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span>👤 {article.author}</span>
                  <span className="mx-2">|</span>
                  <span>📅 {article.date}</span>
                </div>
                {/* Tiêu đề bài viết */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                  <Link href={article.link}>
                    {article.title}
                  </Link>
                </h3>
                {/* Link Đọc Thêm */}
                <Link
                  href={article.link}
                  className="inline-flex items-center font-medium text-sm text-blue-600 hover:text-blue-800"
                >
                  Đọc Thêm
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};