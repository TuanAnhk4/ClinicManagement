import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Tải biến môi trường từ file .env
load_dotenv()

# Lấy thông tin kết nối từ biến môi trường
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USERNAME = os.getenv("DB_USERNAME", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DATABASE = os.getenv("DB_DATABASE")

# Kiểm tra xem các biến cần thiết có tồn tại không
if not DB_PASSWORD or not DB_DATABASE:
    raise ValueError("Database credentials not found in .env file")

# Tạo chuỗi kết nối SQLAlchemy
DATABASE_URL = f"postgresql+psycopg2://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"

# Tạo engine kết nối (nên tạo một lần và tái sử dụng)
try:
    engine = create_engine(DATABASE_URL)
    print("Database engine created successfully.") # Log để kiểm tra
except Exception as e:
    print(f"Error creating database engine: {e}")
    engine = None

def get_db_connection():
    """Hàm để lấy kết nối, có thể mở rộng để quản lý connection pool."""
    if engine is None:
        raise ConnectionError("Database engine is not initialized.")
    try:
        # Kiểm tra kết nối nhanh
        connection = engine.connect()
        print("Database connection successful.")
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise ConnectionError(f"Could not connect to the database: {e}")


def load_appointment_data() -> pd.DataFrame:
    """Tải dữ liệu cần thiết từ bảng appointments."""
    if engine is None:
        return pd.DataFrame() # Trả về DataFrame rỗng nếu không có kết nối

    query = """
    SELECT
        id,
        "appointmentTime", -- Tên cột có thể cần đặt trong dấu ngoặc kép nếu có chữ hoa
        status,
        "doctorId"        -- Tên cột có thể cần đặt trong dấu ngoặc kép nếu có chữ hoa
    FROM appointments
    ORDER BY "appointmentTime" ASC;
    """
    try:
        # Dùng pandas để đọc trực tiếp từ SQL vào DataFrame
        df = pd.read_sql(sql=text(query), con=engine, parse_dates=["appointmentTime"])
        print(f"Loaded {len(df)} appointments.")
        return df
    except Exception as e:
        print(f"Error loading appointment data: {e}")
        return pd.DataFrame() # Trả về DataFrame rỗng nếu lỗi

def load_medical_record_data() -> pd.DataFrame:
    """Tải dữ liệu cần thiết từ bảng medical_records."""
    if engine is None:
        return pd.DataFrame()

    query = """
    SELECT
        mr.id,
        mr.diagnosis,
        a."appointmentTime" -- Lấy thời gian từ bảng appointments liên quan
    FROM medical_records mr
    JOIN appointments a ON mr."appointmentId" = a.id -- Join để lấy ngày tháng
    ORDER BY a."appointmentTime" ASC;
    """
    try:
        df = pd.read_sql(sql=text(query), con=engine, parse_dates=["appointmentTime"])
        print(f"Loaded {len(df)} medical records.")
        return df
    except Exception as e:
        print(f"Error loading medical record data: {e}")
        return pd.DataFrame()

# Có thể thêm các hàm tải dữ liệu khác nếu cần (ví dụ: medicines)

# Kiểm tra kết nối khi file được import (tùy chọn)
# with get_db_connection() as conn:
#     pass