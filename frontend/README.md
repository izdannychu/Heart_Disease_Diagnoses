# SmartHeartDiagnosis Frontend

SmartHeartDiagnosis is a React + Vite web interface for a heart disease risk estimation system. It lets users enter clinical indicators, call the Flask machine learning API, compare model outputs, explore dataset statistics, and export a printable PDF report from the prediction result.

> This application is an academic data mining project. It is not a medical diagnostic tool and must not replace professional medical advice.

---

## English

### Key Features

- Estimate heart disease risk as a percentage from 11 clinical indicators.
- Compare results from Decision Tree, Naive Bayes, SVM, and Random Forest.
- Display risk factors and reference recommendations.
- Visualize model metrics, ROC curves, and confusion matrices.
- Explore dataset statistics and correlations.
- Support dark mode and light mode.
- Preview and download the prediction result as a PDF report.
- AI assistant powered by the backend OpenAI API integration.
- Responsive layout with a mobile bottom navigation bar.

### Tech Stack

- React
- Vite
- JavaScript / JSX
- CSS
- Lucide React
- Flask API backend
- Scikit-learn models served from the backend
- OpenAI API for the AI assistant

### Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm
- Backend API running locally or deployed

### Environment Variable

Create a `.env` file inside the `frontend` folder if you want to override the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

If this variable is not set, the frontend falls back to:

```txt
http://localhost:5000/api
```

The AI assistant is handled by the backend. Set these variables on the backend server, not in the frontend:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

### Install Dependencies

```bash
npm install
```

### Run Locally

Start the backend first:

```bash
cd ../backend
python app.py
```

Then start the frontend:

```bash
cd ../frontend
npm run dev
```

Open the Vite URL, usually:

```txt
http://localhost:5173
```

### Build

```bash
npm run build
```

The production build is generated in:

```txt
dist/
```

### Preview Production Build

```bash
npm run preview
```

### Export Prediction Result as PDF

After submitting the diagnosis form:

1. Wait for the result popup.
2. Click **Xem trước PDF** to preview the generated report.
3. Click **Xuất PDF** to download the PDF file directly.

The PDF includes:

- Main model risk percentage
- Average risk across all models
- Patient input data
- Per-model probabilities
- Detected risk factors
- Reference recommendations
- Medical disclaimer

### Deployment Notes

For Render Static Site:

```txt
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: frontend/dist
```

Set this environment variable:

```txt
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Project Structure

```txt
frontend/
|-- public/
|-- src/
|   |-- components/
|   |   |-- AboutTab.jsx
|   |   |-- AnalysisTab.jsx
|   |   |-- ChatAssistant.jsx
|   |   |-- DiagnosisTab.jsx
|   |   `-- ExplorerTab.jsx
|   |-- utils/
|   |   `-- api.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
`-- vite.config.js
```

---

## Tiếng Việt

### Giới Thiệu

SmartHeartDiagnosis là giao diện web React + Vite cho hệ thống ước tính nguy cơ bệnh tim. Người dùng nhập các chỉ số lâm sàng, hệ thống gọi Flask API để lấy kết quả từ các mô hình học máy, sau đó hiển thị phần trăm nguy cơ, yếu tố nguy cơ, khuyến nghị tham khảo, biểu đồ phân tích mô hình và thống kê dữ liệu.

> Ứng dụng này là sản phẩm học thuật thuộc môn Khai thác dữ liệu. Kết quả chỉ mang tính tham khảo và không thay thế chẩn đoán của bác sĩ chuyên khoa.

### Chức Năng Chính

- Ước tính phần trăm nguy cơ mắc bệnh tim từ 11 chỉ số lâm sàng.
- So sánh kết quả từ Decision Tree, Naive Bayes, SVM và Random Forest.
- Hiển thị các yếu tố nguy cơ được phát hiện.
- Cung cấp khuyến nghị tham khảo về kiểm tra, điều trị và lối sống.
- Trực quan hóa metrics, ROC Curve và Confusion Matrix.
- Khám phá thống kê dataset và ma trận tương quan.
- Hỗ trợ giao diện sáng/tối.
- Xem trước và tải báo cáo kết quả dưới dạng PDF.
- Trợ lý AI được tích hợp thông qua OpenAI API ở backend.
- Tối ưu responsive cho mobile với thanh điều hướng phía dưới.

### Công Nghệ Sử Dụng

- React
- Vite
- JavaScript / JSX
- CSS
- Lucide React
- Flask API ở backend
- Scikit-learn models được backend phục vụ
- OpenAI API cho trợ lý AI

### Yêu Cầu

- Khuyến nghị Node.js 20.19+ hoặc 22.12+
- npm
- Backend API đang chạy local hoặc đã deploy

### Biến Môi Trường

Tạo file `.env` trong thư mục `frontend` nếu muốn cấu hình API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Khi deploy:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

Nếu không cấu hình biến này, frontend sẽ dùng mặc định:

```txt
http://localhost:5000/api
```

Trợ lý AI được xử lý ở backend. Hãy cấu hình các biến này trên backend, không đặt trong frontend:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

### Cài Đặt

```bash
npm install
```

### Chạy Local

Chạy backend trước:

```bash
cd ../backend
python app.py
```

Sau đó chạy frontend:

```bash
cd ../frontend
npm run dev
```

Mở URL Vite, thường là:

```txt
http://localhost:5173
```

### Build Production

```bash
npm run build
```

File build nằm trong:

```txt
dist/
```

### Xem Thử Bản Build

```bash
npm run preview
```

### Xuất Kết Quả Thành PDF

Sau khi nhập form và phân tích nguy cơ:

1. Chờ popup kết quả hiển thị.
2. Bấm **Xem trước PDF** để kiểm tra báo cáo trước.
3. Bấm **Xuất PDF** để tải file PDF trực tiếp về máy.

Báo cáo PDF bao gồm:

- Phần trăm nguy cơ từ mô hình chính
- Trung bình nguy cơ của 4 mô hình
- Dữ liệu bệnh nhân đã nhập
- Xác suất theo từng mô hình
- Các yếu tố nguy cơ được phát hiện
- Khuyến nghị tham khảo
- Khuyến cáo y khoa

### Deploy Trên Render

Nếu deploy frontend dưới dạng Render Static Site:

```txt
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: frontend/dist
```

Cần cấu hình biến môi trường:

```txt
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Cấu Trúc Dự Án

```txt
frontend/
|-- public/
|-- src/
|   |-- components/
|   |   |-- AboutTab.jsx
|   |   |-- AnalysisTab.jsx
|   |   |-- ChatAssistant.jsx
|   |   |-- DiagnosisTab.jsx
|   |   `-- ExplorerTab.jsx
|   |-- utils/
|   |   `-- api.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
`-- vite.config.js
```
