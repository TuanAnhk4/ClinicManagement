<div align="center">
  <a href="https://github.com/TuanAnhk4/clinic-management">
    <img src="docs/images/logo.png" alt="HealthCare Logo" width="200">
  </a>

  <div align="center">
  <h1 style="font-size: 3em; font-weight: bold;">
    <font color="#ffffffff">Health</font><font color="#007bff">Care.</font>
  </h1>
</div>

  <p align="center">
    <strong>Hệ thống quản lý phòng khám thông minh: Tối ưu vận hành & Tích hợp AI dự đoán.</strong>
  </p>

  <p align="center">
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14">
    </a>
    <a href="https://nestjs.com/">
      <img src="https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs" alt="NestJS 10">
    </a>
    <a href="https://www.postgresql.org/">
      <img src="https://img.shields.io/badge/PostgreSQL-14%2B-316192?style=flat-square&logo=postgresql" alt="PostgreSQL">
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=flat-square&logo=typescript" alt="TypeScript 5.0+">
    </a>
    <a href="https://www.python.org/">
      <img src="https://img.shields.io/badge/Python-3.9%2B-3776AB?style=flat-square&logo=python" alt="Python 3.9+">
    </a>
  </p>
</div>

---

## 📖 Overview

**HealthCare** là nền tảng chuyển đổi số dành cho y tế, cung cấp giải pháp quản lý vận hành phòng khám khép kín từ khâu tiếp nhận, khám chữa bệnh đến việc ứng dụng AI để dự đoán chi phí và gợi ý bác sĩ phù hợp.

Hệ thống được xây dựng dựa trên nguyên lý **Clean Architecture**, đảm bảo khả năng mở rộng và bảo trì dễ dàng. Dự án bao gồm Frontend riêng biệt (Next.js), Backend mạnh mẽ (NestJS) và một Service phân tích dữ liệu chuyên dụng (Python/FastAPI) cho các tính năng AI.

---

## ✨ Tính Năng Nổi Bật

### 🩺 Dành Cho Bác Sĩ
- **Quản lý lịch làm việc thông minh:** Đăng ký khung giờ làm việc linh hoạt theo tuần.
- **Bàn làm việc số (Dashboard):** Xem danh sách bệnh nhân trong ngày, lịch sử khám bệnh, chẩn đoán và kê đơn thuốc trên cùng một giao diện.
- **Kê đơn thuốc điện tử:** Chọn thuốc từ kho, tự động tính toán chi phí, in đơn thuốc.
- **Kho tài liệu:** Tra cứu phác đồ điều trị và quy định nội bộ.

### 👤 Dành Cho Bệnh Nhân
- **Đặt lịch khám dễ dàng:** Tìm kiếm bác sĩ theo chuyên khoa, chọn giờ khám theo thời gian thực (Real-time availability).
- **Hồ sơ sức khỏe:** Lưu trữ lịch sử khám, đơn thuốc và theo dõi các chỉ số sức khỏe cá nhân (BMI, tiểu sử bệnh).
- **Minh bạch chi phí:** Xem chi tiết hóa đơn và chi phí điều trị.

### 🛠 Dành Cho Quản Trị Viên (Admin)
- **Dashboard điều hành:** Thống kê doanh thu, lưu lượng bệnh nhân và hiệu suất bác sĩ theo thời gian thực.
- **Quản lý tài nguyên:** Quản lý danh sách bác sĩ, kho thuốc, danh mục chuyên khoa.
- **Cấu hình hệ thống:** Thiết lập các tham số vận hành chung.

---

## 📖 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Khởi Chạy](#-cài-đặt--khởi-chạy)
- [Hình Ảnh Demo](#-hình-ảnh-demo)
- [Đóng Góp](#-đóng-góp)

---

## 🏗 Kiến Trúc Hệ Thống

Dự án tuân theo kiến trúc **Modular Monolith** ở Backend và **Component-Driven** ở Frontend.

### Luồng dữ liệu
> Client (Next.js) ↔ API Gateway (NestJS) ↔ Database (PostgreSQL)

*(Xem thêm trong thư mục `docs/` để thấy các sơ đồ UML chi tiết)*

---

## 🛠 Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Lucide React, React Hook Form, Zod, Recharts |
| **Backend** | NestJS, TypeORM, Passport-JWT, Class-Validator |
| **Database** | PostgreSQL |
| **AI / ML** | Python, FastAPI, Scikit-Learn, XGBoost (Planned) |
| **DevOps** | Docker, ESLint, Prettier |

---

## 📂 Cấu Trúc Dự Án

```text
CLINICMANAGEMENT/
├── api-server/             # Backend (NestJS)
│   ├── src/
│   │   ├── common/         # Tài nguyên dùng chung (Guards, Decorators)
│   │   └── modules/        # Logic nghiệp vụ (Auth, Users, Appointments...)
│   ├── Dockerfile
│   └── README.md           # Hướng dẫn chi tiết cho Backend
│
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # Pages & Layouts
│   │   ├── components/     # UI Components tái sử dụng
│   │   ├── services/       # Gọi API
│   │   └── types/          # Định nghĩa kiểu dữ liệu
│   ├── Dockerfile
│   └── README.md           # Hướng dẫn chi tiết cho Frontend
│
├── analysis-service/       # AI Service (Python - Đang phát triển)
│
├── docs/                   # Tài liệu thiết kế & Hình ảnh
│
└── docker-compose.yml      # File cấu hình Docker


🚀 Cài Đặt & Khởi Chạy
Làm theo các bước sau để chạy dự án trên máy cục bộ (Localhost).

Yêu cầu
Node.js >= 18

PostgreSQL >= 14

Python >= 3.9 (Tùy chọn cho AI service)

Bước 1: Cấu hình Database
Tạo một database rỗng trong PostgreSQL tên là clinic_db.

Bước 2: Khởi chạy Backend

cd api-server
npm install
# Cấu hình file .env (Copy từ .env.example hoặc xem hướng dẫn trong api-server/README.md)
npm run start:dev

Server sẽ chạy tại: http://localhost:3000

Bước 3: Khởi chạy Frontend
Bash

cd client
npm install
# Cấu hình file .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
Client sẽ chạy tại: http://localhost:3001

⚡ Chạy nhanh bằng Docker (One Command Run)
Nếu máy bạn đã cài Docker, bạn có thể chạy toàn bộ hệ thống chỉ với 1 lệnh:

Bash

docker-compose up --build
📸 Hình Ảnh Demo
<div align="center"> <img src="docs/images/dashboard-preview.png" alt="Admin Dashboard" width="45%" /> <img src="docs/images/booking-preview.png" alt="Quy trình đặt lịch" width="45%" /> </div>