import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from prophet import Prophet # Cần thiết để load mô hình Prophet

from database import load_medical_record_data # Thêm hàm load medical record
from preprocessing import preprocess_diagnosis_data # Thêm hàm preprocess diagnosis
from clustering import analyze_seasonal_patterns_kmeans
from analysis import analyze_peak_times # <-- 1. Import hàm mới

from anomaly_detection import analyze_anomaly_isolation_forest
# Import các hàm từ các file khác
from database import (
    load_appointment_data, 
    get_db_connection
)
from preprocessing import (
    preprocess_appointment_time_series
)
# (Loại bỏ các import clustering, analysis... nếu bạn chưa làm)

app = FastAPI()
MODEL_FILENAME = "prophet_daily_visits_model.joblib" # Đảm bảo tên này khớp

@app.get("/")
def read_root():
    try:
        with get_db_connection() as conn:
            pass
        return {"status": "ok", "message": "Analysis Service is running and connected to DB."}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to database: {e}")

# --- Endpoint Dự đoán số ca khám ---
@app.get("/predict/visits-forecast")
async def get_visits_forecast(periods: int = 30, freq: str = 'D'):
    """
    API dự đoán số lượng ca khám bằng mô hình Prophet đã được huấn luyện trước.
    """
    print(f"Nhận yêu cầu dự đoán cho {periods} kỳ, tần suất {freq}")

    # 1. Kiểm tra file mô hình có tồn tại không
    if not os.path.exists(MODEL_FILENAME):
        print(f"Lỗi: Không tìm thấy file mô hình '{MODEL_FILENAME}'.")
        raise HTTPException(
            status_code=503, 
            detail="Mô hình dự đoán chưa sẵn sàng. Vui lòng chạy script huấn luyện trước."
        )

    try:
        # 2. Tải mô hình đã lưu
        print(f"Đang tải mô hình từ {MODEL_FILENAME}...")
        model = joblib.load(MODEL_FILENAME)
        
        # 3. Tạo DataFrame tương lai
        future_df = model.make_future_dataframe(periods=periods, freq=freq)

        # 4. Thực hiện dự đoán (nhanh)
        print("Đang thực hiện dự đoán...")
        forecast = model.predict(future_df)

        # 5. Xử lý và trả về kết quả dự đoán (chỉ phần tương lai)
        last_history_date = model.history['ds'].max()
        forecast_future = forecast[forecast['ds'] > last_history_date][
            ['ds', 'yhat', 'yhat_lower', 'yhat_upper']
        ].copy()

        # Làm tròn và đảm bảo dự đoán không âm
        forecast_future['yhat'] = forecast_future['yhat'].round().astype(int).clip(lower=0)
        forecast_future['yhat_lower'] = forecast_future['yhat_lower'].round().astype(int).clip(lower=0)
        forecast_future['yhat_upper'] = forecast_future['yhat_upper'].round().astype(int).clip(lower=0)
        
        forecast_future['ds'] = forecast_future['ds'].dt.strftime('%Y-%m-%d')
        
        predictions = forecast_future.to_dict(orient='records')
        print("Đã tạo dự đoán thành công.")

        return {"predictions": predictions}

    except Exception as e:
        print(f"Lỗi không xác định khi dự đoán: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ khi dự đoán: {e}")
    


# --- Endpoint 2: Phân tích thời gian cao điểm (Pandas) ---
@app.get("/analyze/peak-times")
async def get_peak_times():
    """
    API phân tích giờ cao điểm và ngày cao điểm (chạy on-demand).
    """
    print("Nhận yêu cầu phân tích thời gian cao điểm")
    try:
        df_appointments = load_appointment_data()
        if df_appointments.empty:
            raise HTTPException(status_code=404, detail="Không có dữ liệu lịch hẹn.")
        
        # Gọi hàm phân tích từ analysis.py
        peak_times_result = analyze_peak_times(df_appointments)

        return peak_times_result
        
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=f"Lỗi kết nối database: {e}")
    except Exception as e:
        print(f"Lỗi không xác định khi phân tích giờ cao điểm: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")    
    
# --- Endpoint 3: Phân tích bệnh theo mùa (K-Means) ---
@app.get("/analyze/seasonal-patterns")
async def get_seasonal_patterns(num_clusters: int = 4):
    """
    API phân tích các mẫu bệnh theo mùa bằng K-Means (chạy on-demand).
    Args:
        num_clusters (int): Số mùa (cụm) muốn phân tích (mặc định là 4).
    """
    print(f"Nhận yêu cầu phân tích mùa bệnh với K={num_clusters}")
    
    try:
        # 1. Tải dữ liệu medical records
        df_medical_records = load_medical_record_data()
        if df_medical_records.empty:
             raise HTTPException(status_code=404, detail="Không có dữ liệu hồ sơ bệnh án.")

        # 2. Tiền xử lý dữ liệu chẩn đoán theo tháng
        df_monthly_diag = preprocess_diagnosis_data(df_medical_records)
        if df_monthly_diag.empty:
             raise HTTPException(status_code=400, detail="Không đủ dữ liệu chẩn đoán sau tiền xử lý.")

        # 3. Phân tích K-Means
        analysis_result = analyze_seasonal_patterns_kmeans(
            df_monthly_diag, 
            n_clusters=num_clusters
        )

        if not analysis_result.get("cluster_assignments"):
             raise HTTPException(status_code=500, detail="Lỗi trong quá trình phân tích K-Means.")

        return analysis_result

    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=f"Lỗi kết nối database: {e}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Lỗi không xác định khi phân tích mùa bệnh: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")
    
# --- Endpoint 4: Phát hiện bất thường (Isolation Forest) ---
@app.get("/analyze/anomaly-detection")
async def get_anomaly_detection(disease: str = Query(..., min_length=1)):
    """
    API phát hiện bất thường (dịch bệnh) cho một bệnh cụ thể.
    Args:
        disease (str): Tên bệnh cần phân tích (đã chuẩn hóa, vd: "cúm")
    """
    print(f"Nhận yêu cầu phát hiện bất thường cho: {disease}")
    
    try:
        disease_normalized = disease.lower().strip()

        # Cần cả 2 bộ dữ liệu:
        df_appointments = load_appointment_data()
        df_medical_records = load_medical_record_data()
        
        if df_appointments.empty or df_medical_records.empty:
            raise HTTPException(status_code=404, detail="Không đủ dữ liệu để phân tích.")

        # Lấy số ca khám tổng cộng hàng ngày (để làm index chuẩn)
        daily_counts, _ = preprocess_appointment_time_series(df_appointments)
        if daily_counts.empty:
             raise HTTPException(status_code=400, detail="Không có dữ liệu ca khám hoàn thành.")

        # Gọi hàm phân tích
        analysis_result = analyze_anomaly_isolation_forest(
            daily_counts, 
            disease_normalized, 
            df_medical_records
        )
        
        return analysis_result

    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=f"Lỗi kết nối database: {e}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Lỗi không xác định khi phát hiện bất thường: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")