# analysis-service/analysis.py

import pandas as pd
from database import load_appointment_data

def analyze_peak_times(df_appointments: pd.DataFrame) -> dict:
    """
    Phân tích giờ cao điểm trong ngày và ngày cao điểm trong tuần.

    Args:
        df_appointments: DataFrame thô từ load_appointment_data().

    Returns:
        Dictionary chứa giờ và ngày cao điểm. 
        Ví dụ: {"peak_hour": "10:00", "peak_day": "Monday"}
    """
    if df_appointments.empty:
        print("Cảnh báo: DataFrame appointments rỗng.")
        return {"peak_hour": "N/A", "peak_day": "N/A"}

    # 1. Lọc các cuộc hẹn đã hoàn thành ('COMPLETED')
    df_completed = df_appointments[df_appointments['status'] == 'COMPLETED'].copy()

    if df_completed.empty:
        print("Cảnh báo: Không có cuộc hẹn nào hoàn thành để phân tích.")
        return {"peak_hour": "N/A", "peak_day": "N/A"}
        
    # Đảm bảo 'appointmentTime' là kiểu datetime
    df_completed['appointmentTime'] = pd.to_datetime(df_completed['appointmentTime'])

    # 2. Phân tích giờ cao điểm (Peak Hour)
    # Trích xuất giờ từ appointmentTime (0-23)
    df_completed['hour_of_day'] = df_completed['appointmentTime'].dt.hour
    # Đếm số ca theo giờ
    peak_hours_count = df_completed.groupby('hour_of_day').size()
    # Tìm giờ có nhiều ca nhất
    peak_hour = peak_hours_count.idxmax() # Trả về số (ví dụ: 10)

    # 3. Phân tích ngày cao điểm (Peak Day)
    # Trích xuất tên ngày trong tuần (vd: 'Monday', 'Tuesday')
    df_completed['day_of_week'] = df_completed['appointmentTime'].dt.day_name()
    # Đếm số ca theo ngày
    peak_days_count = df_completed.groupby('day_of_week').size()
    # Tìm ngày có nhiều ca nhất
    peak_day = peak_days_count.idxmax() # Trả về string (ví dụ: 'Monday')

    print("Đã phân tích xong giờ và ngày cao điểm.")
    
    # Trả về kết quả
    return {
        "peak_hour": f"{peak_hour:02d}:00", # Định dạng lại thành "10:00"
        "peak_day": peak_day
    }

# --- Khối Test (Để chạy file này độc lập) ---
if __name__ == "__main__":
    print("--- Testing Peak Time Analysis ---")
    print("Đang tải dữ liệu appointments...")
    df_app_test = load_appointment_data()

    if not df_app_test.empty:
        print("\nĐang phân tích...")
        peak_analysis = analyze_peak_times(df_app_test)
        print("\nKết quả phân tích:")
        print(peak_analysis)
    else:
        print("Bỏ qua test (dữ liệu rỗng).")
    print("\n--- Test Complete ---")