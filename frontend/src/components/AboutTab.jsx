import { Heart, Cpu, Database, Award } from 'lucide-react';

export default function AboutTab() {
  return (
    <div className="tab-pane fade-in">
      <div className="hero-banner">
        <Heart className="hero-heart-icon" />
        <div className="hero-content">
          <h1>Hệ Thống Hỗ Trợ Chẩn Đoán & Điều Trị Bệnh Tim</h1>
          <p>Ứng dụng khai thác dữ liệu hỗ trợ chẩn đoán nguy cơ bệnh mạch vành dựa trên các dấu hiệu lâm sàng và chỉ số xét nghiệm.</p>
        </div>
      </div>

      <div className="card grid-2-col">
        <div>
          <h2 className="section-title">
            <Award className="icon-blue" /> Thông Tin Đề Tài & Nhóm Thực Hiện
          </h2>
          <div className="project-details">
            <p><strong>Môn học:</strong> Khai thác dữ liệu (Data Mining)</p>
            <p><strong>Đề tài:</strong> Ứng dụng khai thác dữ liệu trong chẩn đoán lâm sàng nguy cơ bệnh mạch vành.</p>
            <p><strong>Đơn vị:</strong> Nhóm 19 - Trường Đại Học Công Thương TP.Hồ Chí Minh(HUIT) </p>
            <p><strong>Thành viên thực hiện:</strong></p>
            <ul className="member-list">
              <li>Đỗ Công Tôn Sách</li>
              <li>Các thành viên nhóm 19</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="section-title">
            <Cpu className="icon-green" /> Các Thuật Toán Khai Thác Dữ Liệu
          </h2>
          <p className="margin-bottom-sm">Hệ thống của chúng tôi tích hợp và huấn luyện đồng thời 4 thuật toán phân lớp phổ biến trên tập dữ liệu tim mạch:</p>
          <div className="algorithm-grid">
            <div className="algo-card">
              <h4>Decision Tree</h4>
              <p>Mô hình cây quyết định phân chia các chỉ số lâm sàng thành các luật IF-THEN rõ ràng, giúp bác sĩ dễ dàng hiểu được logic chẩn đoán.</p>
            </div>
            <div className="algo-card">
              <h4>Naive Bayes</h4>
              <p>Dựa trên định lý xác suất Bayes với giả thuyết độc lập giữa các thuộc tính. Hoạt động cực kỳ hiệu quả và nhanh chóng trên dữ liệu y khoa lâm sàng.</p>
            </div>
            <div className="algo-card">
              <h4>SVM</h4>
              <p>Support Vector Machine tìm siêu phẳng tối ưu để phân tách bệnh nhân lành tính và bệnh nhân có nguy cơ mắc bệnh tim với độ chính xác cao.</p>
            </div>
            <div className="algo-card">
              <h4>Random Forest</h4>
              <p>Phương pháp học máy ensemble kết hợp nhiều cây quyết định độc lập, tăng độ tin cậy và hạn chế tối đa hiện tượng Overfitting.</p>
            </div>
          </div>
        </div>
      </div>


      {/* <div className="warning-box">
        <ShieldAlert className="warning-icon" />
        <div className="warning-text">
          <h4>
            <Info size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
            Khuyến Cáo Y Khoa (Medical Disclaimer)
          </h4>
          <p>
            Ứng dụng này là sản phẩm nghiên cứu học thuật thuộc môn học Khai thác dữ liệu. Kết quả dự đoán và các khuyến nghị điều trị chỉ mang tính chất tham khảo cho nhân viên y tế, không thể thay thế cho các chẩn đoán lâm sàng, xét nghiệm chuyên sâu và quyết định của bác sĩ chuyên khoa tim mạch.
          </p>
        </div>
      </div> */}
    </div>
  );
}
