# analysis-service/clustering.py

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
# Import hàm tiền xử lý từ file preprocessing.py
from preprocessing import preprocess_diagnosis_data 

def analyze_seasonal_patterns_kmeans(
    df_monthly_diag_counts: pd.DataFrame, 
    n_clusters: int = 4
) -> dict:
    """
    Sử dụng K-Means để phân cụm các tháng dựa trên mẫu bệnh.

    Args:
        df_monthly_diag_counts: DataFrame từ preprocess_diagnosis_data.
        n_clusters: Số lượng cụm (mùa) muốn tìm (mặc định là 4).

    Returns:
        Dictionary chứa thông tin về các cụm và các bệnh đặc trưng.
    """
    
    # 1. Kiểm tra dữ liệu đầu vào
    if df_monthly_diag_counts.empty:
        print("Cảnh báo: Không có dữ liệu chẩn đoán để phân cụm.")
        return {"cluster_assignments": {}, "cluster_characteristics": {}}
        
    # 2. CHUẨN BỊ DỮ LIỆU (PIVOT TABLE)
    # Chuyển dữ liệu từ dạng "dài" sang "rộng"
    # Mỗi hàng là một tháng (ví dụ: '2024-01'), mỗi cột là một bệnh, giá trị là số ca
    try:
        df_pivot = df_monthly_diag_counts.pivot_table(
            index='appointmentMonth',
            columns='diagnosis_normalized',
            values='count',
            fill_value=0 # Điền 0 cho các bệnh không xuất hiện
        )
    except Exception as e:
        print(f"Lỗi khi pivot dữ liệu: {e}")
        return {"cluster_assignments": {}, "cluster_characteristics": {}}

    # Kiểm tra xem có đủ dữ liệu (số tháng) để phân cụm không
    if df_pivot.empty or len(df_pivot) < n_clusters:
         print(f"Cảnh báo: Không đủ số tháng ({len(df_pivot)}) để phân thành {n_clusters} cụm.")
         return {"cluster_assignments": {}, "cluster_characteristics": {}}

    # Lấy dữ liệu (X) và tên các cột (bệnh)
    X = df_pivot.values
    disease_names = df_pivot.columns

    # 3. (Tùy chọn nhưng khuyến khích) Chuẩn hóa dữ liệu
    # Giúp các bệnh có số ca nhiều không lấn át các bệnh có số ca ít
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 4. Huấn luyện K-Means
    # n_init='auto' là cài đặt mới để tránh warning
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto').fit(X_scaled)

    # 5. Gán nhãn cụm (cluster label) cho từng tháng
    labels = kmeans.labels_
    
    # Gán nhãn vào index của df_pivot (là các tháng)
    # Chuyển index (Period) về string 'YYYY-MM' cho dễ đọc
    cluster_assignments = {
        month.strftime('%Y-%m'): int(label) 
        for month, label in zip(df_pivot.index.to_timestamp(), labels)
    }

    # 6. Phân tích đặc trưng của từng cụm
    cluster_characteristics = {}
    # Lấy các "trung tâm" của cụm (đã được chuẩn hóa)
    centroids_scaled = kmeans.cluster_centers_ 
    
    # Đảo ngược chuẩn hóa để xem số ca thực tế
    centroids_original = scaler.inverse_transform(centroids_scaled)

    for i in range(n_clusters):
        centroid = centroids_original[i]
        
        # Tìm 3 bệnh có số ca trung bình cao nhất trong cụm này
        # argsort() trả về chỉ số sau khi sắp xếp, [::-1] đảo ngược
        top_disease_indices = np.argsort(centroid)[::-1][:3] # Lấy 3 index cao nhất
        top_diseases = disease_names[top_disease_indices].tolist()
        
        cluster_characteristics[i] = top_diseases

    print(f"Đã phân tích xong các cụm bệnh theo mùa (K={n_clusters}).")
    return {
        "cluster_assignments": cluster_assignments, 
        "cluster_characteristics": cluster_characteristics
    }