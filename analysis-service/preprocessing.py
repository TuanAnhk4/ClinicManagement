import pandas as pd
# Import các hàm load dữ liệu từ database.py
from database import load_appointment_data, load_medical_record_data

# --- Hàm Tiền Xử Lý Chuỗi Thời Gian Số Ca Khám ---
def preprocess_appointment_time_series(df_appointments: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Tiền xử lý dữ liệu appointments để tạo chuỗi thời gian số ca khám
    đã hoàn thành theo ngày và tháng.

    Args:
        df_appointments: DataFrame từ load_appointment_data().

    Returns:
        Tuple chứa (daily_counts, monthly_counts).
        Index là DateTimeIndex, cột là 'count'.
    """
    if df_appointments.empty:
        print("Cảnh báo: DataFrame appointments rỗng.")
        date_index = pd.to_datetime([])
        return pd.DataFrame({'count': []}, index=date_index), pd.DataFrame({'count': []}, index=date_index.to_period('M'))

    # Lọc các cuộc hẹn đã hoàn thành ('COMPLETED')
    df_completed = df_appointments[df_appointments['status'] == 'COMPLETED'].copy()

    if df_completed.empty:
        print("Cảnh báo: Không có cuộc hẹn nào hoàn thành để xử lý.")
        date_index = pd.to_datetime([])
        return pd.DataFrame({'count': []}, index=date_index), pd.DataFrame({'count': []}, index=date_index.to_period('M'))

    # Đảm bảo cột thời gian là kiểu datetime và đặt làm index
    df_completed['appointmentTime'] = pd.to_datetime(df_completed['appointmentTime'], errors='coerce')
    df_completed.dropna(subset=['appointmentTime'], inplace=True)
    df_completed.set_index('appointmentTime', inplace=True)

    # Tổng hợp số lượng theo ngày ('D') và điền 0 cho ngày thiếu
    if not df_completed.empty:
        full_date_range_daily = pd.date_range(start=df_completed.index.min(), end=df_completed.index.max(), freq='D')
        daily_counts = df_completed.resample('D').size().reindex(full_date_range_daily, fill_value=0).rename('count').to_frame()
    else:
        daily_counts = pd.DataFrame({'count': []}, index=pd.to_datetime([]))

    # Tổng hợp số lượng theo đầu tháng ('MS') và điền 0 cho tháng thiếu
    if not df_completed.empty:
        full_date_range_monthly = pd.date_range(start=df_completed.index.min(), end=df_completed.index.max(), freq='MS')
        monthly_counts = df_completed.resample('MS').size().reindex(full_date_range_monthly, fill_value=0).rename('count').to_frame()
    else:
         monthly_counts = pd.DataFrame({'count': []}, index=pd.to_datetime([]))

    print("Đã tiền xử lý xong chuỗi thời gian số ca khám.")
    return daily_counts, monthly_counts

# --- Hàm Tiền Xử Lý Dữ Liệu Chẩn Đoán ---
def preprocess_diagnosis_data(df_medical_records: pd.DataFrame) -> pd.DataFrame:
    """
    Tiền xử lý dữ liệu medical_records để tạo DataFrame số ca mắc
    theo chẩn đoán đã chuẩn hóa và tháng.

    Args:
        df_medical_records: DataFrame từ load_medical_record_data().

    Returns:
        DataFrame có các cột 'appointmentMonth' (Period), 'diagnosis_normalized' (str), 'count' (int).
    """
    if df_medical_records.empty:
         print("Cảnh báo: DataFrame medical_records rỗng.")
         return pd.DataFrame(columns=['appointmentMonth', 'diagnosis_normalized', 'count'])

    df = df_medical_records.copy()

    # Đảm bảo cột thời gian là datetime và trích xuất tháng (dạng Period: YYYY-MM)
    df['appointmentTime'] = pd.to_datetime(df['appointmentTime'], errors='coerce')
    df.dropna(subset=['appointmentTime'], inplace=True)
    df['appointmentMonth'] = df['appointmentTime'].dt.to_period('M')

    # Chuẩn hóa tên bệnh: viết thường, loại bỏ khoảng trắng thừa, bỏ dòng rỗng/NA
    df['diagnosis_normalized'] = df['diagnosis'].astype(str).str.lower().str.strip()
    df = df[df['diagnosis_normalized'].notna() & (df['diagnosis_normalized'] != '')]

    # (Tùy chọn) Thêm logic chuẩn hóa phức tạp hơn (thay thế từ đồng nghĩa)
    # replacements = {'đau họng': 'viêm họng', 'sốt cao': 'sốt'}
    # df['diagnosis_normalized'] = df['diagnosis_normalized'].replace(replacements)

    if df.empty:
        print("Cảnh báo: Không còn dữ liệu chẩn đoán sau khi làm sạch.")
        return pd.DataFrame(columns=['appointmentMonth', 'diagnosis_normalized', 'count'])

    # Đếm số ca mắc của từng bệnh theo tháng
    monthly_diagnosis_counts = df.groupby(['appointmentMonth', 'diagnosis_normalized']).size().reset_index(name='count')

    print("Đã tiền xử lý xong dữ liệu chẩn đoán theo tháng.")
    return monthly_diagnosis_counts

# --- Khối Test (Để chạy file này độc lập) ---
if __name__ == "__main__":
    print("--- Testing Preprocessing Functions ---")
    print("Đang tải dữ liệu...")
    df_app_test = load_appointment_data()
    df_med_test = load_medical_record_data()

    if not df_app_test.empty:
        print("\nTesting preprocess_appointment_time_series...")
        daily_counts_test, monthly_counts_test = preprocess_appointment_time_series(df_app_test)
        if not daily_counts_test.empty:
            print("\nDaily Counts (head):")
            print(daily_counts_test.head())
        if not monthly_counts_test.empty:
            print("\nMonthly Counts:")
            print(monthly_counts_test)
    else:
        print("Bỏ qua test appointments (dữ liệu rỗng).")

    if not df_med_test.empty:
        print("\nTesting preprocess_diagnosis_data...")
        monthly_diag_test = preprocess_diagnosis_data(df_med_test)
        if not monthly_diag_test.empty:
            print("\nMonthly Diagnosis Counts (head):")
            print(monthly_diag_test.head(10))
    else:
        print("Bỏ qua test medical records (dữ liệu rỗng).")
    print("\n--- Preprocessing Test Complete ---")