import Link from 'next/link';
interface PublicHeaderProps {
  onBookNowClick: () => void; // Hàm được gọi khi nhấn Book Now
}

export const PublicHeader = ({ onBookNowClick }: PublicHeaderProps) => {
  return (
    // Màu nền nhạt, có thể thêm shadow nếu muốn
    <header className="bg-blue-100 py-3 sticky top-0 z-40"> {/* Thay bg-blue-100 bằng màu nền bạn muốn */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo Bên Trái */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Health Care. {/* Thay bằng logo hoặc tên phòng khám */}
          </Link>
        </div>

        {/* Điều Hướng Ở Giữa (Ẩn trên màn hình nhỏ) */}
        <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
          <Link href="/doctors" className="text-gray-700 hover:text-blue-600 font-medium">Doctors</Link>
          {/* Thêm các link khác nếu cần */}
          {/* <Link href="/blogs" className="text-gray-700 hover:text-blue-600 font-medium">Blogs</Link> */}
          {/* <Link href="/pages" className="text-gray-700 hover:text-blue-600 font-medium">Pages</Link> */}
        </div>

        {/* Hành Động Bên Phải */}
        <div className="flex items-center space-x-4">
          {/* Nút CTA "Book Now" */}
            <button 
            onClick={onBookNowClick}
            className="bg-purple-800 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-purple-900 transition-colors">
              Book Now
            </button>

          {/* Icon Tìm Kiếm */}
          <button className="text-gray-700 hover:text-blue-600 hidden md:block">
            {/* Thay bằng icon thật sau */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Nút Menu Mobile (Hamburger) */}
          <button className="text-gray-700 hover:text-blue-600 md:hidden">
            {/* Thay bằng icon thật sau */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Thêm logic hiển thị menu mobile dropdown nếu cần */}
    </header>
  );
};