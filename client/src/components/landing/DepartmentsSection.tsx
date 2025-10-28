// src/components/landing/DepartmentsSection.tsx
import React from 'react';
import Link from 'next/link';
// (Tùy chọn) Import icons nếu bạn dùng react-icons

// Dữ liệu mẫu cho các khoa (bạn nên thay thế bằng dữ liệu thật)
const departments = [
  {
    icon: '⚡', // Placeholder icon Emergency
    title: 'Khoa Cấp Cứu',
    description: 'Tiếp nhận và xử lý các trường hợp khẩn cấp 24/7.',
    link: '/departments/emergency',
  },
  {
    icon: '👶', // Placeholder icon Pediatric
    title: 'Khoa Nhi',
    description: 'Chăm sóc sức khỏe toàn diện cho trẻ em và trẻ sơ sinh.',
    link: '/departments/pediatric',
  },
  {
    icon: '♀️', // Placeholder icon Gynecology
    title: 'Khoa Phụ Sản',
    description: 'Khám, tư vấn và điều trị các vấn đề phụ khoa, sản khoa.',
    link: '/departments/gynecology',
  },
  {
    icon: '🧠', // Placeholder icon Neurology
    title: 'Khoa Nội Thần Kinh',
    description: 'Chẩn đoán và điều trị các bệnh lý liên quan đến hệ thần kinh.',
    link: '/departments/neurology',
  },
  {
    icon: '❤️', // Placeholder icon Cardiology (tái sử dụng)
    title: 'Khoa Tim Mạch',
    description: 'Chuyên sâu về phòng ngừa và điều trị bệnh tim mạch.',
    link: '/departments/cardiology',
  },
  // Thêm các khoa khác nếu cần
];

export const DepartmentsSection = () => {
  return (
    // Section với nền trắng hoặc xám nhạt
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto text-center">
        {/* Tiêu đề và Mô tả */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Các Khoa Của Chúng Tôi
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Phòng khám đa khoa với đầy đủ các chuyên khoa, đáp ứng mọi nhu cầu khám chữa bệnh của bạn.
        </p>

        {/* Lưới các thẻ khoa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
          {departments.map((dept, index) => (
            <Link href={dept.link} key={index}>
              <div
                className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center transition-transform hover:scale-105 cursor-pointer flex flex-col items-center h-full"
              >
                {/* Icon */}
                <div className="text-4xl mb-4 bg-white text-blue-600 rounded-full p-3 inline-block">
                  {dept.icon} {/* Thay bằng component Icon thật */}
                </div>
                {/* Tiêu đề */}
                <h3 className="text-xl font-semibold mb-2">
                  {dept.title}
                </h3>
                {/* Mô tả */}
                <p className="text-sm text-blue-100 flex-grow">
                  {dept.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};