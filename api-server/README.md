# HealthCare API Server 🏥

Hệ thống Backend mạnh mẽ, có khả năng mở rộng cho ứng dụng **Quản lý Phòng khám HealthCare**. Được xây dựng bằng **NestJS**, hệ thống cung cấp các API RESTful cho phía Client (Next.js) và xử lý các logic nghiệp vụ phức tạp, quản lý cơ sở dữ liệu và tổng hợp dữ liệu thống kê.

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Core Framework:** [NestJS](https://nestjs.com/) (Node.js / TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** Passport-JWT (Chiến lược Access Token)
- **Validation:** `class-validator` & `class-transformer`
- **Architecture:** Modular Monolith (Modules, Controllers, Services, DTOs, Entities)

---

## 📋 Yêu Cầu Hệ Thống (Prerequisites)

Trước khi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt:

- **[Node.js](https://nodejs.org/)**: Phiên bản 18.x trở lên.
- **[PostgreSQL](https://www.postgresql.org/)**: Phiên bản 14.x trở lên (kèm theo **pgAdmin** để quản lý).
- **[npm](https://www.npmjs.com/)**: Trình quản lý gói (thường đi kèm với Node.js).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Cài đặt thư viện
Mở terminal tại thư mục `api-server` và chạy lệnh:

```bash
npm install

# --- CẤU HÌNH SERVER ---
PORT=3000

# --- CẤU HÌNH DATABASE (PostgreSQL) ---
# Hãy thay đổi username/password khớp với cài đặt PostgreSQL trên máy bạn
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_DATABASE=clinic_db

# --- XÁC THỰC JWT ---
# Khóa bí mật để ký token (Nên đổi chuỗi này khi deploy thực tế)
JWT_SECRET=HealthCare_Super_Secret_Key_2024
JWT_EXPIRATION_TIME=1d


npm run start:dev

npm run build
npm run start:prod


src/
├── common/              # Các thành phần dùng chung (Hạ tầng cốt lõi)
│   ├── decorators/      # Decorators tùy chỉnh (@GetUser, @Roles, @Public)
│   ├── filters/         # Bộ lọc lỗi toàn cục (Global Exception Filters)
│   ├── guards/          # Các lớp bảo vệ Auth & Role (JwtAuthGuard, RolesGuard)
│   ├── interceptors/    # Chuyển đổi phản hồi & Ghi log (Transform, Logging)
│   ├── interfaces/      # Interfaces chung (ApiResponse, Pagination)
│   └── utils/           # Các hàm tiện ích (HashUtil, DateUtil)
│
├── modules/             # Các Module Tính năng (Logic Nghiệp vụ)
│   ├── auth/            # Xác thực (Đăng nhập, Đăng ký, JWT)
│   ├── users/           # Quản lý Người dùng (Admin, Bác sĩ, Bệnh nhân)
│   ├── appointments/    # Logic Đặt lịch & Lên lịch
│   ├── medical-records/ # Hồ sơ Bệnh án & Chẩn đoán
│   ├── prescriptions/   # Quản lý Đơn thuốc
│   ├── prescription-items/# Chi tiết từng loại thuốc trong đơn (Sửa/Xóa lẻ)
│   ├── medicines/       # Kho thuốc (Dược phẩm)
│   ├── specialties/     # Chuyên khoa Y tế (Tim mạch, Nha khoa...)
│   ├── doctor-schedules/# Quản lý lịch làm việc của Bác sĩ
│   └── dashboard/       # Thống kê & Phân tích (Sử dụng QueryBuilder)
│
├── app.module.ts        # Module Gốc (Kết nối DB, Config)
└── main.ts              # Điểm khởi chạy (CORS, ValidationPipe)


🔑 Hướng Dẫn Sử Dụng API
1. Thiết lập ban đầu (Tạo tài khoản Admin đầu tiên)
Vì hệ thống không cho phép đăng ký công khai quyền Admin, hãy làm theo các bước sau để tạo tài khoản Admin đầu tiên:

Sử dụng Postman hoặc Frontend để đăng ký một user mới qua API POST /auth/register.

Mở pgAdmin (hoặc công cụ quản lý DB của bạn).

Tìm bảng users và tìm dòng user vừa tạo.

Sửa thủ công cột role từ 'PATIENT' thành 'ADMIN'.

Lưu lại. Bây giờ bạn có thể đăng nhập với quyền Admin để quản lý hệ thống.

2. Các Endpoints Chính
Xác thực (Authentication)
POST /auth/register: Đăng ký tài khoản mới (Mặc định: Bệnh nhân).

POST /auth/login: Đăng nhập (Trả về JWT Access Token).

GET /auth/profile: Lấy thông tin user hiện tại (Yêu cầu Token).

Người dùng & Bác sĩ
GET /users: Lấy tất cả users (Chỉ Admin/Bác sĩ).

GET /users?role=DOCTOR: Lấy danh sách bác sĩ.

PATCH /users/:id: Cập nhật hồ sơ (Có kiểm tra quyền sở hữu).

Lịch hẹn (Appointments)
POST /appointments: Tạo lịch hẹn mới.

GET /appointments/doctor/me: Xem lịch làm việc (Cho bác sĩ đang đăng nhập).

GET /appointments/patient/me: Xem lịch sử khám (Cho bệnh nhân đang đăng nhập).

GET /doctor-schedules/doctor/:id: Xem khung giờ rảnh của một bác sĩ cụ thể.

Thống kê (Dashboard)
GET /dashboard/overview: Các chỉ số KPI tổng quan (Doanh thu, Số lượng user...).

GET /dashboard/daily-stats: Biểu đồ xu hướng doanh thu và lịch hẹn (30 ngày).

GET /dashboard/top-diagnoses: Các bệnh lý phổ biến nhất.