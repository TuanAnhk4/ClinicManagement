# HealthCare Client (Frontend) 🏥

Giao diện người dùng (Frontend) cho hệ thống Quản lý Phòng khám HealthCare. Được xây dựng bằng **Next.js 13+ (App Router)**, dự án cung cấp trải nghiệm mượt mà, hiện đại và tối ưu hóa SEO cho Bệnh nhân, Bác sĩ và Quản trị viên.

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Forms & Validation:** React Hook Form + Zod
- **HTTP Client:** Axios (với Interceptors tùy chỉnh)
- **Charts:** Recharts
- **Calendar:** React-Calendar
- **State Management:** React Context API + Hooks

---

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: Phiên bản 18.17 trở lên.
- **npm**: Trình quản lý gói.
- **Backend**: HealthCare API Server đang chạy (mặc định port 3000).

---

## 🚀 Cài Đặt & Chạy Dự Án

### 1. Cài đặt thư viện
Di chuyển vào thư mục `client` và chạy lệnh:

```bash
cd client
npm install

# --- API CONFIG ---
# Đường dẫn đến Backend NestJS (Mặc định backend chạy port 3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# --- APP INFO ---
NEXT_PUBLIC_APP_NAME="HealthCare System"

npm run dev
npm run build
npm start


src/
├── app/                 # Next.js App Router (Pages & Layouts)
│   ├── (auth)/          # Nhóm trang xác thực (Login, Register...)
│   ├── (public)/        # Nhóm trang công khai (Home, About, Services...)
│   ├── (private)/       # Nhóm trang quản trị (Admin, Doctor, Patient)
│   ├── globals.css      # Global Styles (Tailwind imports)
│   └── layout.tsx       # Root Layout & Providers
│
├── components/          # Các thành phần UI tái sử dụng
│   ├── ui/              # Basic UI (Button, Input, Modal, Table...)
│   ├── forms/           # Các Form nghiệp vụ phức tạp (UserForm, BookingForm...)
│   ├── layout/          # Header, Sidebar, Footer cho từng vai trò
│   ├── charts/          # Biểu đồ thống kê (Recharts)
│   └── landing/         # Các section của trang chủ
│
├── contexts/            # Global State (Auth, Theme, Toast, UI)
├── hooks/               # Custom Hooks (useAuth, useDebounce, useToast...)
├── services/            # API Services (Tách biệt logic gọi API)
├── types/               # TypeScript Definitions (Interfaces, Enums, DTOs)
├── constants/           # Hằng số (API Urls, Menu config, Regex...)
└── lib/                 # Cấu hình thư viện (Axios instance, Utils)

🔑 Các Tính Năng Chính
1. Phân Quyền (Role-based Access Control)
Hệ thống tự động điều hướng dựa trên vai trò người dùng:

Patient: /patient (Đặt lịch, Xem hồ sơ, Lịch sử khám).

Doctor: /doctor (Lịch làm việc, Danh sách bệnh nhân, Khám bệnh & Kê đơn).

Admin: /admin (Dashboard thống kê, Quản lý User, Thuốc, Chuyên khoa).

2. Quy trình Đặt lịch (Booking Flow)
Chọn Chuyên khoa -> Chọn Bác sĩ.

Hệ thống hiển thị Lịch làm việc của Bác sĩ.

Chọn Ngày -> Chọn Giờ trống (Real-time check).

Xác nhận đặt lịch.

3. Quy trình Khám bệnh (Consultation Flow)
Bác sĩ nhận bệnh nhân từ danh sách chờ.

Nhập chẩn đoán và triệu chứng.

Kê đơn thuốc (Chọn thuốc từ kho, nhập số lượng, liều dùng).

Hệ thống tự động tính tổng chi phí.

Lưu hồ sơ và hoàn tất.

⚠️ Xử Lý Lỗi Thường Gặp (Troubleshooting)
1. Lỗi ECONNREFUSED hoặc API 404

Nguyên nhân: Frontend không kết nối được Backend.

Khắc phục:

Kiểm tra Backend đã chạy chưa (npm run start:dev ở folder api-server).

Kiểm tra file .env.local xem NEXT_PUBLIC_API_URL có đúng port của Backend không.

2. Lỗi Hydration failed

Nguyên nhân: HTML render ở Server khác với Client (thường do Extension trình duyệt hoặc Date time).

Khắc phục: Tắt các Extension như Grammarly/AdBlock hoặc dùng suppressHydrationWarning (đã thêm ở RootLayout).

3. Lỗi CSS không nhận (Tailwind)

Khắc phục: Đảm bảo bạn đã cài @tailwindcss/postcss và cấu hình postcss.config.mjs đúng chuẩn Tailwind v4. Xóa folder .next và chạy lại npm run dev.


Đóng Góp (Contributing)
Tuân thủ quy tắc đặt tên Component (PascalCase) và file (kebab-case cho logic, PascalCase cho component).

Luôn định nghĩa Type/Interface trong src/types/.

Không gọi API trực tiếp trong Component, hãy dùng src/services/.