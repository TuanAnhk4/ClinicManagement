// src/components/landing/PublicFooter.tsx
import Link from 'next/link';
// (Tùy chọn) Import icons từ react-icons nếu bạn muốn dùng icon thật
// import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

export const PublicFooter = () => {
  return (
    <footer className="mt-16"> {/* Thêm khoảng cách trên nếu cần */}
      {/* --- Phần Trên: Subscription --- */}
      <section className="bg-indigo-900 text-indigo-100 py-12 px-4"> {/* Màu nền tím đậm */}
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Hình ảnh (Placeholder) */}
          <div className="hidden md:block text-center">
            {/* Thay bằng component Image của Next.js để tối ưu */}
            {/* <img src="/images/doctors-group.png" alt="Đội ngũ bác sĩ" className="max-w-xs mx-auto" /> */}
                        <p className="mt-2 text-sm">Hình ảnh đội ngũ y tế</p>
          </div>

          {/* Form đăng ký */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Trở Thành Người Đăng Ký</h2>
            <p className="mb-4">Nhận thông tin cập nhật và ưu đãi mới nhất từ chúng tôi.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="flex-grow p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-white text-indigo-900 font-semibold py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
              >
                Đăng Ký Ngay
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- Phần Dưới: Thông tin & Links --- */}
      <section className="bg-blue-600 text-blue-100 py-16 px-4"> {/* Màu nền xanh dương */}
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-4">
            <h4 className="text-2xl font-bold text-white">Health Care.</h4>
            <p className="text-sm">Mô tả ngắn về phòng khám, sứ mệnh, giá trị cốt lõi...</p>
            <div className="flex items-start space-x-2">
              {/* <FaMapMarkerAlt className="mt-1 text-white" /> */} 📍
              <p className="text-sm">Địa chỉ cụ thể, Phường, Quận, Thành phố</p>
            </div>
            <div className="flex items-start space-x-2">
              {/* <FaPhoneAlt className="mt-1 text-white" /> */} 📞
              <p className="text-sm">(+84) 123 456 789</p>
            </div>
          </div>

          {/* Cột 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">Về chúng tôi</Link></li>
              <li><Link href="/services" className="hover:text-white">Dịch vụ</Link></li>
              <li><Link href="/doctors" className="hover:text-white">Đội ngũ Bác sĩ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Liên hệ</Link></li>
              {/* Thêm link khác */}
            </ul>
          </div>

          {/* Cột 3: More Links (Ví dụ) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hữu Ích</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/book-appointment" className="hover:text-white">Đặt lịch hẹn</Link></li>
              <li><Link href="/faq" className="hover:text-white">Câu hỏi thường gặp</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Chính sách bảo mật</Link></li>
              <li><Link href="/terms" className="hover:text-white">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Cột 4: Clinic Hours */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Giờ Làm Việc</h4>
            <ul className="space-y-2 text-sm">
              <li>Thứ 2 - Thứ 6: <span className="float-right">9:00 AM - 7:00 PM</span></li>
              <li>Thứ 7: <span className="float-right">10:00 AM - 5:00 PM</span></li>
              <li>Chủ Nhật: <span className="float-right">Đóng cửa</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- Dòng Copyright & Social --- */}
      <div className="bg-blue-700 text-blue-200 py-4 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} Tên Phòng Khám. Bảo lưu mọi quyền.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            {/* Thay bằng icon mạng xã hội thật */}
            <a href="#" aria-label="Facebook" className="hover:text-white">FB</a>
            <a href="#" aria-label="Instagram" className="hover:text-white">IG</a>
            <a href="#" aria-label="Youtube" className="hover:text-white">YT</a>
            <a href="#" aria-label="Twitter" className="hover:text-white">TW</a>
          </div>
        </div>
      </div>
    </footer>
  );
};