# 🫀 Hệ Thống Hỗ Trợ Chẩn Đoán & Điều Trị Bệnh Tim
> **Môn học:** Khai thác dữ liệu (Data Mining)  
> **Đề tài:** Ứng dụng khai thác dữ liệu trong chẩn đoán lâm sàng nguy cơ bệnh mạch vành.

---

## 📋 1. Thu Thập Thông Tin Lâm Sàng (Input Features)

Người dùng hoặc bác sĩ nhập các chỉ số kiểm tra của bệnh nhân vào form bên dưới để làm đầu vào cho mô hình phân lớp (Classification).

### A. Thông tin cơ bản & Triệu chứng chính
*   **Tuổi (Age):** `[   ]` *(Năm)*
*   **Giới tính (Sex):** 
    *   ( ) Nam (M)
    *   ( ) Nữ (F)
*   **Loại đau ngực (ChestPainType):**
    *   ( ) Đau thắt ngực điển hình (TA - Typical Angina)
    *   ( ) Đau thắt ngực không điển hình (ATA - Atypical Angina)
    *   ( ) Đau không do thắt ngực (NAP - Non-Anginal Pain)
    *   ( ) Không có triệu chứng (ASY - Asymptomatic)
*   **Đau ngực khi vận động (ExerciseAngina):**
    *   ( ) Có (Y)
    *   ( ) Không (N)

### B. Chỉ số sinh tồn & Xét nghiệm máu
*   **Huyết áp tâm thu lúc nghỉ (RestingBP):** `[   ]` *(mm Hg)*
*   **Lượng Cholesterol huyết thanh (Cholesterol):** `[   ]` *(mm/dl)*
*   **Đường huyết lúc đói (FastingBS):**
    *   ( ) FastingBS > 120 mg/dl (1)
    *   ( ) FastingBS ≤ 120 mg/dl (0)

### C. Kết quả Điện tâm đồ (ECG) & Kiểm tra Gắng sức
*   **Kết quả điện tâm đồ lúc nghỉ (RestingECG):**
    *   ( ) Bình thường (Normal)
    *   ( ) Có bất thường sóng ST-T (ST) *(Đảo ngược sóng T và/hoặc ST chênh lên/xuống > 0.05 mV)*
    *   ( ) Phì đại thất trái (LVH) *(Theo tiêu chuẩn Estes)*
*   **Nhịp tim tối đa đạt được (MaxHR):** `[   ]` *(Giá trị từ 60 - 202 nhịp/phút)*
*   **Độ chênh ST (Oldpeak):** `[   ]` *(Độ hạ đoạn ST do vận động so với lúc nghỉ)*
*   **Độ dốc đoạn ST (ST_Slope):**
    *   ( ) Dốc lên (Up)
    *   ( ) Đi ngang (Flat)
    *   ( ) Dốc xuống (Down)

---

## 🤖 2. Phân Tích & Dự Đoán Từ Mô Hình Khai Thác Dữ Liệu

*Sau khi nhấn nút **"Phân Tích Nguy Cơ"**, hệ thống sẽ sử dụng các thuật toán học máy (như Decision Tree, Naive Bayes, hoặc SVM) đã được huấn luyện trên tập dữ liệu để đưa ra kết quả.*

### 📊 Kết quả dự đoán (HeartDisease)
> [!IMPORTANT]
> ### **KẾT QUẢ: 1 (Phát hiện nguy cơ mắc bệnh Tim)**
> *Độ tin cậy của mô hình (Confidence): **92.4%***

#### **Các yếu tố nguy cơ cao được phát hiện từ dữ liệu của bệnh nhân:**
1. **Loại đau ngực:** ASY (Không triệu chứng nhưng có tổn thương ngầm).
2. **ST_Slope:** Flat/Down kết hợp với **Oldpeak cao** là dấu hiệu điển hình của thiếu máu cơ tim cục bộ.
3. **MaxHR:** Thấp hơn mức trung bình so với độ tuổi khi gắng sức.

---

## 🩺 3. Khuyến Nghị Điều Trị Y Khoa (Dành cho Bác sĩ tham khảo)

Dựa trên kết quả phân lớp dữ liệu, hệ thống đưa ra phác đồ gợi ý:

### 🔬 Chỉ định cận lâm sàng tiếp theo (Nếu HeartDisease = 1)
*   Chụp cắt lớp vi tính (CT) động mạch vành để đánh giá mức độ hẹp.
*   Siêu âm tim gắng sức (Stress Echocardiography).

### 💊 Hướng dẫn điều trị & Thay đổi lối sống
*   **Y khoa:** Kiểm soát huyết áp (duy trì dưới 130/80 mm Hg) và tối ưu hóa chỉ số Cholesterol bằng Statins nếu có chỉ định.
*   **Dinh dưỡng:** Giảm thiểu chất béo bão hòa, hạn chế muối (dưới 2g/ngày).
*   **Vận động:** Tập thể dục nhẹ nhàng, tránh các bài tập gắng sức đột ngột do có tiền sử `ExerciseAngina = Y`.

---
*Lưu ý: Ứng dụng này là sản phẩm nghiên cứu thuộc môn học Khai thác dữ liệu, kết quả chỉ mang tính chất tham khảo và không thay thế cho chẩn đoán của bác sĩ chuyên khoa.*