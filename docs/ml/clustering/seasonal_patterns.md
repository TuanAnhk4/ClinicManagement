# Phân Tích Mẫu Bệnh Theo Mùa (K-Means)

## 1. Mục Đích 🎯

Chức năng này sử dụng thuật toán phân cụm **K-Means** để tự động phát hiện các **"mùa bệnh"** trong năm.

Mục tiêu là nhóm các tháng có đặc điểm bệnh lý (số ca mắc của các bệnh) tương đồng lại với nhau, từ đó giúp phòng khám:
* **Hiểu rõ xu hướng bệnh theo mùa:** Ví dụ, "Mùa 1" (Tháng 6, 7, 8) thường có nhiều ca Sốt xuất huyết. "Mùa 2" (Tháng 11, 12, 1) thường có nhiều ca Cúm.
* **Hỗ trợ sắp xếp nhân sự & nguồn lực:** Chủ động chuẩn bị thuốc men và nhân lực bác sĩ chuyên khoa cho các mùa bệnh cụ thể.

## 2. Dữ Liệu Sử Dụng 💾

* **Nguồn:** Bảng `medical_records` (cột `diagnosis`) và bảng `appointments` (cột `appointmentTime`).
* **Tiền Xử Lý (Rất quan trọng):**
    1.  **Chuẩn Hóa Chẩn Đoán:** Tên bệnh (`diagnosis`) được làm sạch (viết thường, bỏ khoảng trắng thừa) để gom nhóm các bệnh giống nhau.
    2.  **Tổng Hợp Theo Tháng:** Đếm tổng số ca mắc của **từng bệnh** theo **từng tháng**.
    3.  **Tạo Bảng Pivot (Pivot Table):** Dữ liệu được chuyển đổi thành một bảng ma trận, trong đó:
        * Mỗi **hàng** là một **tháng** (ví dụ: `2024-01`, `2024-02`...).
        * Mỗi **cột** là một **loại bệnh** (ví dụ: `cúm`, `viêm họng`...).
        * Giá trị trong ô là **số ca mắc** của bệnh đó trong tháng đó.
    4.  **Chuẩn Hóa (Scaling):** Dữ liệu số ca mắc được chuẩn hóa (ví dụ: dùng `StandardScaler` của scikit-learn) để các bệnh có số ca nhiều (như "cúm") không lấn át ảnh hưởng của các bệnh có số ca ít hơn.

## 3. Thuật Toán & Cách Hoạt Động ⚙️

* **Thuật Toán:** **K-Means Clustering** (từ thư viện `scikit-learn`).
* **Lý Do Chọn:** K-Means là một thuật toán phân cụm (clustering) phổ biến, hiệu quả và tương đối dễ diễn giải. Nó rất phù hợp cho việc tìm các nhóm (cụm) tự nhiên trong dữ liệu khi chúng ta chưa biết trước các nhóm đó là gì.
* **Cách Hoạt Động:**
    1.  **Chọn K:** Chúng ta chỉ định số "mùa" (cụm) muốn tìm (ví dụ: `K=4` cho 4 mùa, hoặc `K=3` cho 3 mùa Nóng-Lạnh-Giao mùa).
    2.  **Huấn Luyện (`kmeans.fit(X_scaled)`):** Thuật toán sẽ chạy trên dữ liệu đã được pivot và chuẩn hóa. Nó sẽ cố gắng gán mỗi "tháng" (mỗi hàng) vào một trong K cụm sao cho các tháng trong cùng một cụm có đặc điểm bệnh lý (số ca mắc các bệnh) giống nhau nhất.
    3.  **Phân Tích Trung Tâm Cụm (Centroids):** Sau khi huấn luyện, chúng ta phân tích "trung tâm" (centroid) của mỗi cụm. Trung tâm này cho biết "số ca mắc trung bình" của các bệnh trong cụm đó.
    4.  **Xác Định Bệnh Đặc Trưng:** Bằng cách tìm các giá trị cao nhất trong mỗi trung tâm cụm, chúng ta có thể xác định được các bệnh **đặc trưng** nhất cho "mùa" đó (ví dụ: Cụm 1 có `cúm` và `viêm họng` cao nhất).

* **Chế độ chạy:** Phân tích này được chạy **"on-demand"** (mỗi khi Admin tải trang Dashboard) để đảm bảo tính linh hoạt (có thể thay đổi số K).

---

## 4. API Endpoint Liên Quan 🔗

* **Service Python (`analysis-service`):**
    * `GET /analyze/seasonal-patterns?num_clusters={K}`
    * **Input:** `num_clusters` (số cụm, mặc định là 4).
    * **Output:** JSON `{ "cluster_assignments": {"YYYY-MM": Cụm_ID, ...}, "cluster_characteristics": { "Cụm_ID": ["bệnh 1", "bệnh 2", ...] } }`.
* **Service Node.js (`api-server`):**
    * `GET /dashboard/analysis/seasonal-patterns`
    * Gọi sang API Python và trả kết quả về cho Frontend.

---

## 5. Hiển Thị Kết Quả 📊

* Kết quả phân tích được hiển thị trên **Dashboard Admin** dưới dạng các **Thẻ Thông Tin (Insight Cards)**:
    * **Các cụm (mùa):** Liệt kê các cụm (ví dụ: Cụm 1, Cụm 2...).
    * **Bệnh đặc trưng:** Hiển thị 3 bệnh phổ biến nhất cho từng cụm.
    * **Phân bổ tháng (Tùy chọn):** Liệt kê các tháng thuộc về từng cụm.