# Phân Tích Thời Điểm Cao Điểm

### 1. Mục Đích

Chức năng này dùng để phân tích dữ liệu lịch sử nhằm tìm ra **thời điểm cao điểm** (bận rộn nhất) của phòng khám.

Kết quả được hiển thị trên **Dashboard Admin** để:
* Hỗ trợ **sắp xếp nhân sự** và ca trực bác sĩ cho phù hợp.
* Giúp phòng khám **dự đoán và chuẩn bị** cho các khung giờ/ngày có tải công việc cao.

---

## 2. Dữ Liệu Sử Dụng 💾

* **Nguồn:** Bảng `appointments` trong database PostgreSQL.
* **Trường Dữ Liệu Chính:**
    * `appointmentTime`: Thời gian bắt đầu của lịch hẹn.
    * `status`: Trạng thái của lịch hẹn.
* **Tiền Xử Lý:**
    1.  **Lọc:** Chỉ giữ lại các lịch hẹn có `status = 'COMPLETED'`.
    2.  **Trích xuất:** Dùng `pandas` để trích xuất hai thông tin mới từ `appointmentTime`:
        * Giờ trong ngày (ví dụ: 9, 10, 11...).
        * Tên ngày trong tuần (ví dụ: 'Monday', 'Tuesday'...).

---

## 3. Thuật Toán & Cách Hoạt Động ⚙️

* **Thuật Toán:** Thống kê mô tả đơn giản sử dụng thư viện **Pandas**. Không cần dùng mô hình ML phức tạp.
* **Cách Hoạt Động:**
    1.  **Phân tích Giờ Cao Điểm:**
        * Nhóm (group by) toàn bộ các lịch hẹn đã hoàn thành theo **giờ trong ngày**.
        * Đếm (`count()`) số lượng lịch hẹn trong mỗi nhóm.
        * Tìm ra giờ có số lượng cao nhất (`idxmax()`).
    2.  **Phân tích Ngày Cao Điểm:**
        * Nhóm (group by) toàn bộ các lịch hẹn đã hoàn thành theo **tên ngày trong tuần**.
        * Đếm (`count()`) số lượng lịch hẹn trong mỗi nhóm.
        * Tìm ra ngày có số lượng cao nhất (`idxmax()`).

* **Chế độ chạy:** Phân tích này được chạy **"on-demand"** (mỗi khi Admin tải trang Dashboard) để đảm bảo dữ liệu luôn mới nhất.

---

## 4. API Endpoint Liên Quan 🔗

* **Service Python (`analysis-service`):**
    * `GET /analyze/peak-times`
    * **Output:** JSON `{ "peak_hour": "HH:00", "peak_day": "Tên_Ngày" }` (ví dụ: `{ "peak_hour": "10:00", "peak_day": "Monday" }`).
* **Service Node.js (`api-server`):**
    * `GET /dashboard/analysis/peak-times`
    * Gọi sang API Python và trả kết quả về cho Frontend.

---

## 5. Hiển Thị Kết Quả 📊

* Kết quả phân tích được hiển thị trên **Dashboard Admin** dưới dạng các **Thẻ Thông Tin (Insight Cards)**, ví dụ:
    * `GIỜ BẬN RỘN NHẤT: 10:00`
    * `NGÀY ĐÔNG KHÁCH NHẤT: Thứ Hai`