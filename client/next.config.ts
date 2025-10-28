import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**', // Cho phép mọi đường dẫn trên hostname này
      },
      // Thêm các hostname khác nếu bạn dùng ảnh từ nguồn khác
    ],
  },
};

export default nextConfig;
