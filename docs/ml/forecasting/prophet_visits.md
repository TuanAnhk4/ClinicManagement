# Mô Hình Dự Đoán Số Ca Khám Hàng Ngày (Prophet)

## 1. Mục Đích 🎯

Mô hình này sử dụng thuật toán **Prophet** của Facebook để dự đoán **số lượng ca khám dự kiến sẽ hoàn thành mỗi ngày** trong một khoảng thời gian tương lai (ví dụ: 30 ngày tới).

Kết quả dự đoán này được hiển thị trên **Dashboard của Admin** để:
* Giúp phòng khám **ước lượng tải công việc** sắp tới.
* Hỗ trợ việc **lên kế hoạch nhân sự** (bác sĩ, điều dưỡng) cho phù hợp.
* Chuẩn bị **nguồn lực** (vật tư, thuốc men) dựa trên số lượng bệnh nhân dự kiến.

---

## 2. Dữ Liệu Sử Dụng 💾

* **Nguồn:** Bảng `appointments` trong database PostgreSQL.
* **Trường Dữ Liệu Chính:**
    * `appointmentTime`: Thời gian bắt đầu của lịch hẹn.
    * `status`: Trạng thái của lịch hẹn.
* **Tiền Xử Lý:**
    1.  **Lọc:** Chỉ giữ lại các lịch hẹn có `status = 'COMPLETED'`.
    2.  **Tổng hợp:** Đếm số lượng (`COUNT`) lịch hẹn hoàn thành theo **từng ngày**.
    3.  **Điền Dữ Liệu Thiếu:** Tạo một chuỗi ngày liên tục và điền `0` cho những ngày không có ca khám nào hoàn thành.
    4.  **Đổi Tên Cột:** Dữ liệu cuối cùng đưa vào Prophet là một DataFrame có 2 cột:
        * `ds`: Cột chứa ngày tháng (kiểu `datetime`).
        * `y`: Cột chứa số lượng ca khám hoàn thành (kiểu `integer`).

---

## 3. Thuật Toán & Cách Hoạt Động ⚙️

* **Thuật Toán:** **Prophet** (phát triển bởi Facebook).
* **Lý Do Chọn:** Prophet là một mô hình phân tích chuỗi thời gian (time series) mạnh mẽ, được thiết kế để xử lý tốt các đặc điểm phổ biến của dữ liệu kinh doanh, bao gồm:
    * **Tính mùa vụ (Seasonality)** Tự động phát hiện các mẫu lặp lại theo tuần và theo năm.
    * **Thay đổi xu hướng (Trend Changes)** Tự động tìm ra các "điểm gãy" (changepoints) nơi xu hướng tăng/giảm thay đổi.
    * **Dữ liệu thiếu & Ngoại lệ (Missing Data & Outliers)** Xử lý tốt mà không cần can thiệp thủ công nhiều.
* **Công Thức Kỹ Thuật (Mô hình Cộng tính)**
    * **Prophet mô hình hóa chuỗi thời gian $y(t)$ bằng công thức sau:**
        * **$$y(t) = g(t) + s(t) + h(t) + \epsilon_t$$**

        * $g(t)$ (Growth/Trend): Thành phần xu hướng. Mô hình thể hiện sự tăng trưởng (hoặc giảm) dài hạn. Prophet mặc định sử dụng mô hình tăng trưởng tuyến tính (linear) hoặc logistic. Trong dự án này, chúng ta sử dụng tăng trưởng tuyến tính.
        * $s(t)$ (Seasonality): Thành phần mùa vụ. Mô hình thể hiện các thay đổi định kỳ (ví dụ: theo tuần, theo năm). Prophet sử dụng chuỗi Fourier (Fourier Series) để mô hình hóa tính mùa vụ. Đối với dữ liệu hàng ngày, chúng ta đã bật weekly_seasonality=True để mô hình học các mẫu lặp lại trong tuần (ví dụ: Thứ 7 thường ít ca khám hơn Thứ 2).

        * $h(t)$ (Holidays): Thành phần sự kiện/ngày lễ. Thể hiện ảnh hưởng của các ngày đặc biệt (ví dụ: Tết, nghỉ lễ). (Trong đồ án này chúng ta chưa sử dụng đến thành phần này, nhưng có thể dễ dàng mở rộng).

        * $\epsilon_t$ (Error Term): Sai số ngẫu nhiên, được giả định là nhiễu trắng (white noise).

* **Cách Hoạt Động**
    * **Huấn luyện (model.fit(df_prophet)):**
        * Khi gọi model.fit(), Prophet sẽ sử dụng dữ liệu lịch sử (cột ds và y) để tìm ra các tham số tốt nhất cho $g(t)$ (xu hướng) và $s(t)$ (mùa vụ hàng tuần)
        * Nó sẽ tự động phát hiện các "điểm gãy" (changepoints) nếu xu hướng tăng/giảm thay đổi đột ngột.
    * **Dự đoán (model.predict(future)):**
        * Sau khi huấn luyện, chúng ta tạo một DataFrame future chứa các ngày trong tương lai (ví dụ: 30 ngày tới).
        * Mô hình ngoại suy các thành phần $g(t)$ và $s(t)$ vào các ngày tương lai này.
        * Nó tính toán giá trị dự đoán yhat (chính là $g(t) + s(t)$ trong tương lai) và cung cấp các khoảng tin cậy (yhat_lower, yhat_upper) để thể hiện mức độ không chắc chắn của dự đoán.

* **Huấn Luyện (Trong Đồ Án):** Trong phiên bản hiện tại, mô hình được huấn luyện lại từ đầu với dữ liệu mới nhất mỗi khi API dự đoán được gọi để đảm bảo tính cập nhật. (Ghi chú thực tế: Để tối ưu hiệu năng, mô hình nên được huấn luyện định kỳ, lưu lại bằng joblib hoặc pickle, và API chỉ cần tải mô hình đã lưu để dự đoán).

---

## 4. API Endpoint Liên Quan 🔗

* **Service Python (`analysis-service`):**
    * `GET /predict/visits-forecast?periods={số_ngày}&freq=D`
    * **Input:** `periods` (số ngày dự đoán, mặc định 30), `freq` (tần suất, 'D' là ngày).
    * **Output:** JSON chứa mảng `predictions`, mỗi phần tử có dạng `{ "ds": "YYYY-MM-DD", "yhat": dự_đoán, "yhat_lower": giới_hạn_dưới, "yhat_upper": giới_hạn_trên }`.
* **Service Node.js (`api-server`):**
    * `GET /dashboard/predictions/daily-visits`
    * Endpoint này gọi sang API Python và trả kết quả về cho Frontend.

---

## 5. Hiển Thị Kết Quả 📊

* Kết quả dự đoán (`yhat`) theo ngày (`ds`) được hiển thị trên **Dashboard Admin** dưới dạng **biểu đồ đường (Line Chart)**, giúp Admin hình dung xu hướng số ca khám dự kiến trong thời gian tới.