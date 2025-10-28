import React from 'react';
import Link from 'next/link';
// (Tùy chọn) Import icons nếu bạn dùng react-icons
// Ví dụ: import { FaSyringe, FaKidneys, FaHeartbeat, FaTooth, FaEye, FaLungs } from 'react-icons/fa';

// Dữ liệu mẫu cho các dịch vụ (bạn nên thay thế bằng dữ liệu thật)
const services = [
  {
    icon: '💉', // Placeholder icon Vaccination
    title: 'Tiêm Chủng',
    description: 'Dịch vụ tiêm chủng phòng ngừa đầy đủ cho mọi lứa tuổi.',
    bgColor: 'bg-blue-600', // Màu nền đặc biệt cho thẻ này
    textColor: 'text-white',
    link: '/services/vaccination',
  },
  {
    icon: '❤️', // Placeholder icon Cardiology
    title: 'Tim Mạch',
    description: 'Khám, chẩn đoán và điều trị các bệnh lý tim mạch.',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    link: '/services/cardiology',
  },
    {
    icon: '👁️', // Placeholder icon Eye Care
    title: 'Nhãn Khoa',
    description: 'Chăm sóc mắt toàn diện, đo khám và điều trị tật khúc xạ.',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    link: '/services/eye-care',
  },
  {
    icon: '🦷', // Placeholder icon Dental Care
    title: 'Nha Khoa',
    description: 'Cung cấp các dịch vụ nha khoa tổng quát và chuyên sâu.',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    link: '/services/dental-care',
  },
   {
    icon: '🩺', // Placeholder icon General Checkup
    title: 'Khám Tổng Quát',
    description: 'Kiểm tra sức khỏe định kỳ giúp phát hiện sớm bệnh lý.',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    link: '/services/general-checkup',
  },
   {
    icon: '🩹', // Placeholder icon Dermatology
    title: 'Da Liễu',
    description: 'Điều trị các bệnh về da, thẩm mỹ da.',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    link: '/services/dermatology',
  },
  // Thêm các dịch vụ khác...
];

export const ServicesSection = () => {
  return (
    // Section với nền trắng hoặc xám nhạt
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto text-center">
        {/* Tiêu đề và Mô tả */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Dịch Vụ Chăm Sóc Sức Khỏe Của Chúng Tôi
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Chúng tôi cung cấp đa dạng các dịch vụ y tế chuyên nghiệp, đáp ứng nhu cầu chăm sóc sức khỏe toàn diện cho cộng đồng.
        </p>

        {/* Lưới các thẻ dịch vụ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg shadow-md text-left transition-transform hover:scale-105 ${service.bgColor} ${service.textColor}`}
            >
              {/* Icon */}
              <div className={`text-4xl mb-4 ${service.bgColor === 'bg-white' ? 'text-blue-600' : 'text-white'}`}>
                {service.icon} {/* Thay bằng component Icon thật */}
              </div>
              {/* Tiêu đề */}
              <h3 className={`text-xl font-semibold mb-2 ${service.bgColor === 'bg-white' ? 'text-gray-900' : 'text-white'}`}>
                {service.title}
              </h3>
              {/* Mô tả */}
              <p className={`text-sm mb-4 ${service.bgColor === 'bg-white' ? 'text-gray-600' : 'text-blue-100'}`}>
                {service.description}
              </p>
              {/* Link Xem Thêm */}
              <Link
                href={service.link}
                className={`inline-flex items-center font-medium text-sm ${service.bgColor === 'bg-white' ? 'text-blue-600 hover:text-blue-800' : 'text-white hover:text-blue-200'}`}
              >
                Xem Thêm
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};