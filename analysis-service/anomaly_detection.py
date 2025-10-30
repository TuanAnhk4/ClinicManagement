import pandas as pd
from sklearn.ensemble import IsolationForest
from preprocessing import preprocess_appointment_time_series # Cần hàm này

def analyze_anomaly_isolation_forest(
    df_daily_counts: pd.DataFrame, 
    disease_name: str, 
    df_medical_records: pd.DataFrame
) -> dict:
    """
    Phát hiện bất thường (dịch bệnh đột biến) cho một bệnh cụ thể
    bằng Isolation Forest.

    Args:
        df_daily_counts (pd.DataFrame): DataFrame số ca khám TỔNG CỘNG hàng ngày (từ preprocess).
        disease_name (str): Tên bệnh cần kiểm tra (đã chuẩn hóa, vd: 'cúm').
        df_medical_records (pd.DataFrame): DataFrame medical records thô (từ load_medical_record_data).

    Returns:
        Dictionary chứa kết quả phân tích.
    """
    if df_medical_records.empty:
        return {"anomaly_detected": False, "message": "Không có dữ liệu hồ sơ bệnh án."}

    # 1. Tiền xử lý dữ liệu chẩn đoán cho CHỈ bệnh này
    df = df_medical_records.copy()
    df['appointmentTime'] = pd.to_datetime(df['appointmentTime'], errors='coerce')
    df.dropna(subset=['appointmentTime'], inplace=True)
    
    df['diagnosis_normalized'] = df['diagnosis'].astype(str).str.lower().str.strip()
    df_disease = df[df['diagnosis_normalized'] == disease_name]

    if df_disease.empty:
        return {"anomaly_detected": False, "message": f"Không tìm thấy dữ liệu cho bệnh: {disease_name}"}

    # 2. Tạo chuỗi thời gian SỐ CA MẮC HÀNG NÀY cho bệnh này
    # Dùng index của df_daily_counts (đã điền đủ ngày) để đảm bảo tính liên tục
    daily_disease_counts_df = df_disease.resample('D', on='appointmentTime').size().reindex(df_daily_counts.index, fill_value=0).rename('count').to_frame()
    
    if daily_disease_counts_df.empty or len(daily_disease_counts_df) < 14: # Cần ít nhất dữ liệu 2 tuần
        return {"anomaly_detected": False, "message": "Không đủ dữ liệu lịch sử để phân tích."}

    # 3. Chuẩn bị dữ liệu cho Isolation Forest (chỉ cần giá trị 'count')
    X = daily_disease_counts_df[['count']]

    # 4. Huấn luyện mô hình Isolation Forest
    # contamination='auto' hoặc một số nhỏ (ví dụ 0.05 - 5% là bất thường)
    model = IsolationForest(contamination='auto', random_state=42)
    model.fit(X)

    # 5. Lấy điểm bất thường (anomaly score)
    # -1 là bất thường, 1 là bình thường
    predictions = model.predict(X)
    daily_disease_counts_df['anomaly'] = predictions

    # 6. Kiểm tra ngày gần nhất (hoặc 3 ngày gần nhất)
    last_days = daily_disease_counts_df.tail(3) # Kiểm tra 3 ngày cuối
    anomalies_found = last_days[last_days['anomaly'] == -1]

    if not anomalies_found.empty:
        # Tìm ngày bất thường gần nhất
        last_anomaly = anomalies_found.iloc[-1]
        date_str = last_anomaly.name.strftime('%Y-%m-%d')
        count = int(last_anomaly['count'])
        
        return {
            "anomaly_detected": True,
            "message": f"Cảnh báo: Phát hiện số ca mắc '{disease_name}' tăng đột biến!",
            "details": f"Ngày {date_str} ghi nhận {count} ca, được xác định là bất thường."
        }
    else:
        last_count = int(daily_disease_counts_df.iloc[-1]['count'])
        return {
            "anomaly_detected": False,
            "message": f"Số ca mắc '{disease_name}' trong tầm kiểm soát.",
            "details": f"Ngày gần nhất ghi nhận {last_count} ca (bình thường)."
        }