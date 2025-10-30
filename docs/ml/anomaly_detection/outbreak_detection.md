# Phân Tích Phát Hiện Bất Thường (Cảnh Báo Dịch Bệnh)

## 1. Mục Đích 🎯

Chức năng này sử dụng các kỹ thuật thống kê và Machine Learning để **phát hiện sự gia tăng đột biến, bất thường** về số ca mắc của một bệnh cụ thể (ví dụ: "cúm").

Kết quả phân tích được hiển thị trên **Dashboard Admin** dưới dạng một **Cảnh báo (Alert)**, nhằm:
* Giúp phòng khám **nhanh chóng nhận diện** các dấu hiệu ban đầu của một đợt bùng phát dịch bệnh.
* Hỗ trợ ban quản lý **điều phối nhân sự** (tăng ca trực, chuẩn bị bác sĩ chuyên khoa) và **chuẩn bị vật tư y tế** (thuốc, thiết bị xét nghiệm) kịp thời.

---

## 2. Dữ Liệu Sử Dụng 💾

* **Nguồn:** Bảng `medical_records` (cột `diagnosis`) và bảng `appointments` (cột `appointmentTime`).
* **Tiền Xử Lý:**
    1.  **Lọc Bệnh:** Lọc ra các hồ sơ khám bệnh có `diagnosis` (đã chuẩn hóa) khớp với tên bệnh cần phân tích (ví dụ: `cúm`).
    2.  **Tổng Hợp Theo Ngày:** Đếm số lượng ca mắc của bệnh đó theo **từng ngày**.
    3.  **Chuẩn Hóa Chuỗi Thời Gian:** Tạo một chuỗi ngày liên tục (dựa trên tổng số ca khám chung) và điền `0` cho những ngày không có ca mắc bệnh đó để đảm bảo dữ liệu không bị ngắt quãng.

---

## 3. Thuật Toán & Cách Hoạt Động ⚙️

### A. Phương Pháp Isolation Forest (Đề xuất Nâng cao)

* **Thuật Toán:** **Isolation Forest** (từ thư viện `scikit-learn`).
* **Lý Do Chọn:** Đây là một thuật toán phát hiện bất thường (anomaly detection) hiệu quả. Nó hoạt động tốt với dữ liệu nhiều chiều (nếu cần) và không cần giả định rằng dữ liệu phải tuân theo phân phối chuẩn (như Z-Score).
* **Cách Hoạt Động:**
    1.  **Huấn Luyện (`model.fit(X)`):** Mô hình được huấn luyện trên DataFrame chứa số ca mắc hàng ngày.
    2.  **Dự Đoán (`model.predict(X)`):** Mô hình gán cho mỗi ngày một "điểm" (score). Các điểm nằm ngoài xu hướng chung sẽ bị "cô lập" nhanh hơn và được gán nhãn là bất thường (ví dụ: `-1`).
    3.  **Cảnh Báo:** API sẽ kiểm tra xem các ngày gần nhất (ví dụ: 3 ngày cuối) có bị gán nhãn `-1` hay không. Nếu có, hệ thống sẽ trả về cảnh báo.

### B. Phương Pháp Z-Score (Đề xuất Ưu tiên)

* **Thuật Toán:** **Z-Score** (sử dụng `pandas`).
* **Lý Do Chọn:** Đơn giản, nhanh chóng và rất dễ diễn giải về mặt y tế/thống kê.
* **Cách Hoạt Động:**
    1.  **Tính Trung Bình Trượt:** Tính toán số ca mắc trung bình (`rolling_mean`) trong một cửa sổ trượt (ví dụ: 30 ngày qua).
    2.  **Tính Độ Lệch Chuẩn Trượt:** Tính độ lệch chuẩn (`rolling_std`) trong cùng cửa sổ đó.
    3.  **Tính Z-Score:** Áp dụng công thức:
        $$Z = \frac{(Số\_ca\_hôm\_nay - Trung\_bình\_trượt)}{Độ\_lệch\_chuẩn\_trượt}$$
    4.  **Cảnh Báo:** Nếu `Z-Score` của ngày hôm nay (hoặc ngày gần nhất) **vượt qua một ngưỡng** nhất định (ví dụ: `> 3.0`), điều đó có nghĩa là số ca mắc hôm nay cao hơn 3 lần độ lệch chuẩn so với mức trung bình, và được coi là một sự kiện đột biến, bất thường.

* **Chế độ chạy:** Phân tích này được chạy **"on-demand"** (mỗi khi Admin yêu cầu kiểm tra một bệnh cụ thể).

---

## 4. API Endpoint Liên Quan 🔗

* **Service Python (`analysis-service`):**
    * `GET /analyze/anomaly-detection?disease={tên_bệnh}`
    * **Input:** `disease` (tên bệnh đã chuẩn hóa, ví dụ: `cum`).
    * **Output:** JSON `{ "anomaly_detected": true/false, "message": "Mô tả cảnh báo", "details": "Thông tin chi tiết..." }`.
* **Service Node.js (`api-server`):**
    * `GET /dashboard/analysis/anomaly-detection`
    * Gọi sang API Python và trả kết quả về cho Frontend.

---

## 5. Hiển Thị Kết Quả 📊

* Kết quả phân tích được hiển thị trên **Dashboard Admin** dưới dạng một **Thẻ Cảnh Báo (Alert Card)**.
* Thẻ sẽ có màu sắc thay đổi (ví dụ: **màu đỏ** nếu `anomaly_detected: true`, **màu xanh** nếu `false`) và hiển thị `message` cùng `details` từ API.