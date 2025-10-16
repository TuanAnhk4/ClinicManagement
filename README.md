#  Hệ Thống Quản Lý Phòng Khám Tư Nhân 🏥

Đây là đồ án chuyên ngành xây dựng một hệ thống quản lý toàn diện cho phòng khám tư. Hệ thống không chỉ giúp quản lý các nghiệp vụ cốt lõi như thông tin bệnh nhân, bác sĩ, lịch hẹn mà còn tích hợp các mô hình **Machine Learning** để phân tích và đưa ra các dự đoán thông minh, giúp tối ưu hóa vận hành và nâng cao hiệu quả khám chữa bệnh.

---

## ✨ Tính Năng Nổi Bật

* **👨‍⚕️ Quản lý thông tin:** Quản lý toàn diện hồ sơ Bệnh nhân, Bác sĩ và các vai trò khác.
* **📅 Đặt lịch khám thông minh:** Giao diện đặt lịch trực quan, tự động kiểm tra và tránh trùng lặp lịch của bác sĩ.
* **💊 Quản lý khám bệnh & Kê đơn:** Ghi nhận hồ sơ khám bệnh và tạo đơn thuốc điện tử.
* **📊 Dashboard Phân Tích & Dự Đoán:** Đây là chức năng cốt lõi và nổi bật nhất của hệ thống:
    * **Trực quan hóa dữ liệu:** Sử dụng biểu đồ để theo dõi doanh thu, số lượng ca khám, các bệnh phổ biến...
    * **Dự đoán doanh thu & số ca khám** cho tháng kế tiếp bằng các mô hình Time Series (ARIMA).
    * **Phát hiện xu hướng bệnh** theo mùa bằng thuật toán phân cụm (K-Means Clustering).
    * **Cảnh báo dịch bệnh** đột biến bằng các thuật toán phát hiện bất thường (Isolation Forest).


## 🚀 Công Nghệ Sử Dụng

| Hạng Mục | Công Nghệ |
| :--- | :--- |
| **Frontend** | `Next.js`, `Tailwind CSS`, `Recharts` / `Chart.js` |
| **API Server (Backend)** | `Node.js`, `NestJS` (hoặc `Express.js`), `PostgreSQL` |
| **Analysis Service (ML)** | `Python`, `FastAPI`, `Scikit-learn`, `Statsmodels` |
| **Quản lý dự án** | `GitHub`, `Jira` |

