import pandas as pd
from prophet import Prophet
import joblib # Thư viện để lưu/tải mô hình
import logging
from database import load_appointment_data # Import hàm load data
from preprocessing import preprocess_appointment_time_series # Import hàm tiền xử lý

# Cấu hình logging cho Prophet (giảm thông báo)
logging.getLogger('prophet').setLevel(logging.WARNING)
logging.getLogger('cmdstanpy').setLevel(logging.WARNING)

# Định nghĩa tên file để lưu mô hình
MODEL_FILENAME = "prophet_daily_visits_model.joblib"

def train_and_save_prophet_model():
    """
    Huấn luyện mô hình Prophet với dữ liệu số ca khám hàng ngày và lưu lại.
    """
    print("--- Bắt đầu quá trình huấn luyện mô hình Prophet ---")

    # 1. Tải và tiền xử lý dữ liệu
    print("Đang tải dữ liệu appointments...")
    df_appointments = load_appointment_data()
    if df_appointments.empty:
        print("Lỗi: Không có dữ liệu appointments để huấn luyện.")
        return

    print("Đang tiền xử lý dữ liệu...")
    # Chúng ta ưu tiên dữ liệu theo ngày cho Prophet
    daily_counts, _ = preprocess_appointment_time_series(df_appointments) 
    if daily_counts.empty or len(daily_counts) < 2:
        print("Lỗi: Không đủ dữ liệu sau tiền xử lý để huấn luyện.")
        return

    # 2. Chuẩn bị dữ liệu cho Prophet (đổi tên cột thành 'ds', 'y')
    df_prophet = daily_counts.reset_index()
    
    # Kiểm tra tên cột index sau khi reset (có thể là 'index' hoặc 'appointmentTime')
    if 'appointmentTime' in df_prophet.columns:
         df_prophet.rename(columns={'appointmentTime': 'ds', 'count': 'y'}, inplace=True)
    elif 'index' in df_prophet.columns:
         df_prophet.rename(columns={'index': 'ds', 'count': 'y'}, inplace=True)
    else:
        print("Lỗi: Không tìm thấy cột ngày tháng trong DataFrame đã xử lý.")
        return

    # Đảm bảo cột 'ds' là kiểu datetime
    df_prophet['ds'] = pd.to_datetime(df_prophet['ds'])

    print(f"Sử dụng {len(df_prophet)} điểm dữ liệu để huấn luyện...")

    # 3. Khởi tạo và huấn luyện mô hình Prophet
    model = Prophet(weekly_seasonality=True, daily_seasonality=False)
    try:
        print("Đang huấn luyện mô hình...")
        model.fit(df_prophet)
        print("Huấn luyện thành công!")
    except Exception as e:
        print(f"Lỗi trong quá trình huấn luyện: {e}")
        return

    # 4. Lưu mô hình đã huấn luyện
    try:
        print(f"Đang lưu mô hình vào file: {MODEL_FILENAME}...")
        joblib.dump(model, MODEL_FILENAME)
        print("Lưu mô hình thành công!")
    except Exception as e:
        print(f"Lỗi khi lưu mô hình: {e}")

    print("--- Kết thúc quá trình huấn luyện ---")

# Chạy hàm huấn luyện khi script được thực thi
if __name__ == "__main__":
    train_and_save_prophet_model()