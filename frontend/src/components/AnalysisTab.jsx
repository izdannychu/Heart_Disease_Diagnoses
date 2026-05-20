import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../utils/api';
import { BarChart2, RefreshCw, AlertCircle, TrendingUp, Award } from 'lucide-react';

export default function AnalysisTab({ selectedModel, setSelectedModel }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getModelMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu hiệu năng mô hình. Hãy đảm bảo Backend đang chạy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadMetrics = async () => {
      try {
        const data = await getModelMetrics();
        if (!cancelled) {
          setMetrics(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('Không thể tải dữ liệu hiệu năng mô hình. Hãy đảm bảo Backend đang chạy.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="loading-spinner" />
        <p>Đang tải dữ liệu hiệu năng mô hình...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={40} className="icon-red" />
        <p className="error-msg">{error}</p>
        <button className="btn btn-primary" onClick={fetchMetrics}>Thử Lại</button>
      </div>
    );
  }

  if (!metrics) return null;

  const modelNames = Object.keys(metrics);
  const metricLabels = [
    { key: 'accuracy', label: 'Accuracy', color: '#3b82f6' },
    { key: 'precision', label: 'Precision', color: '#8b5cf6' },
    { key: 'recall', label: 'Recall', color: '#10b981' },
    { key: 'f1_score', label: 'F1-Score', color: '#f59e0b' },
    { key: 'roc_auc', label: 'ROC-AUC', color: '#ef4444' },
  ];

  // Find the best model overall (by F1 score)
  const bestModel = modelNames.reduce((best, name) =>
    metrics[name].f1_score > metrics[best].f1_score ? name : best
  , modelNames[0]);

  // Confusion Matrix renderer
  const renderConfusionMatrix = (cm, modelName) => {
    const maxVal = Math.max(...cm.flat());

    return (
      <div className={`cm-card ${selectedModel === modelName ? 'cm-active' : ''}`}
        onClick={() => setSelectedModel(modelName)}>
        <div className="cm-header">
          <h4>{modelName}</h4>
          {selectedModel === modelName && <span className="cm-badge">Đang dùng</span>}
          {modelName === bestModel && <Award size={16} className="icon-gold" />}
        </div>
        <div className="cm-grid">
          {/* Column Headers */}
          <div className="cm-corner"></div>
          <div className="cm-col-head">Dự đoán: 0</div>
          <div className="cm-col-head">Dự đoán: 1</div>

          {cm.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              <div className="cm-row-head">Thực tế: {rowIdx}</div>
              {row.map((val, colIdx) => {
                const isDiagonal = rowIdx === colIdx;
                const intensity = val / maxVal;
                const bgColor = isDiagonal
                  ? `rgba(16, 185, 129, ${0.2 + intensity * 0.6})`
                  : `rgba(239, 68, 68, ${0.15 + intensity * 0.5})`;

                return (
                  <div key={colIdx} className="cm-cell" style={{ backgroundColor: bgColor }}>
                    <span className="cm-val">{val}</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="cm-metrics-row">
          <span>Acc: {(metrics[modelName].accuracy * 100).toFixed(1)}%</span>
          <span>F1: {(metrics[modelName].f1_score * 100).toFixed(1)}%</span>
        </div>
      </div>
    );
  };

  // Grouped bar chart for comparing models
  const renderGroupedBarChart = () => {
    const barWidth = 18;
    const groupGap = 40;
    const groupWidth = metricLabels.length * barWidth + groupGap;
    const svgWidth = modelNames.length * groupWidth + 60;
    const svgHeight = 280;
    const chartTop = 20;
    const chartBottom = 240;
    const chartHeight = chartBottom - chartTop;

    return (
      <div className="grouped-bar-chart">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="bar-svg">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = chartBottom - tick * chartHeight;
            return (
              <g key={i}>
                <line x1="50" y1={y} x2={svgWidth - 10} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
                <text x="44" y={y + 4} fill="#94a3b8" fontSize="9" textAnchor="end">{(tick * 100).toFixed(0)}%</text>
              </g>
            );
          })}

          {/* Bars */}
          {modelNames.map((modelName, modelIdx) => {
            const groupX = 60 + modelIdx * groupWidth;
            return (
              <g key={modelName}>
                {metricLabels.map((m, mIdx) => {
                  const val = metrics[modelName][m.key];
                  const barH = val * chartHeight;
                  const x = groupX + mIdx * barWidth;
                  const y = chartBottom - barH;
                  return (
                    <g key={m.key}>
                      <rect x={x} y={y} width={barWidth - 3} height={barH} fill={m.color} rx="3" ry="3" opacity="0.85">
                        <title>{modelName} - {m.label}: {(val * 100).toFixed(1)}%</title>
                      </rect>
                      <text x={x + (barWidth - 3) / 2} y={y - 3} fill={m.color} fontSize="7" textAnchor="middle">
                        {(val * 100).toFixed(0)}
                      </text>
                    </g>
                  );
                })}
                {/* Model name label */}
                <text x={groupX + (metricLabels.length * barWidth) / 2} y={chartBottom + 16} fill="#e2e8f0" fontSize="9" textAnchor="middle" fontWeight="500">
                  {modelName.length > 12 ? modelName.replace(' ', '\n') : modelName}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="chart-legend">
          {metricLabels.map(m => (
            <div key={m.key} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: m.color }}></span>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ROC Curve
  const renderROCCurves = () => {
    const svgSize = 300;
    const pad = 40;
    const plotSize = svgSize - 2 * pad;
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

    return (
      <div className="roc-chart-card">
        <h3 className="section-title"><TrendingUp className="icon-blue" /> Đường Cong ROC</h3>
        <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="roc-svg">
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const pos = pad + (1 - tick) * plotSize;
            const posX = pad + tick * plotSize;
            return (
              <g key={i}>
                <line x1={pad} y1={pos} x2={pad + plotSize} y2={pos} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1={posX} y1={pad} x2={posX} y2={pad + plotSize} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                <text x={pad - 5} y={pos + 3} fill="#94a3b8" fontSize="8" textAnchor="end">{tick.toFixed(2)}</text>
                <text x={posX} y={pad + plotSize + 12} fill="#94a3b8" fontSize="8" textAnchor="middle">{tick.toFixed(2)}</text>
              </g>
            );
          })}

          {/* Diagonal reference line */}
          <line x1={pad} y1={pad + plotSize} x2={pad + plotSize} y2={pad} stroke="#475569" strokeWidth="1" strokeDasharray="5,5" />

          {/* ROC curves */}
          {modelNames.map((name, idx) => {
            const roc = metrics[name].roc_curve;
            if (!roc || !roc.fpr || roc.fpr.length === 0) return null;

            const points = roc.fpr.map((fprVal, i) => {
              const x = pad + fprVal * plotSize;
              const y = pad + (1 - roc.tpr[i]) * plotSize;
              return `${x},${y}`;
            }).join(' ');

            return (
              <polyline key={name} points={points} fill="none" stroke={colors[idx % colors.length]} strokeWidth="2" opacity="0.9" />
            );
          })}

          {/* Axis labels */}
          <text x={pad + plotSize / 2} y={svgSize - 2} fill="#94a3b8" fontSize="9" textAnchor="middle">Tỷ lệ Dương tính Giả (FPR)</text>
          <text x={10} y={pad + plotSize / 2} fill="#94a3b8" fontSize="9" textAnchor="middle" transform={`rotate(-90, 10, ${pad + plotSize / 2})`}>Tỷ lệ Dương tính Thật (TPR)</text>
        </svg>

        <div className="chart-legend">
          {modelNames.map((name, idx) => (
            <div key={name} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: colors[idx % colors.length] }}></span>
              <span>{name} (AUC: {(metrics[name].roc_auc * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="tab-pane fade-in">
      <div className="section-header">
        <BarChart2 className="icon-blue" />
        <h2>Phân Tích Hiệu Năng Mô Hình</h2>
        <p>So sánh các chỉ số đánh giá giữa 4 thuật toán học máy trên tập kiểm thử (Test set: 20%).</p>
      </div>

      <div className="model-selector-hint">
        <AlertCircle size={16} />
        <span>Nhấp vào một Confusion Matrix bên dưới để chọn mô hình chủ đạo cho tab Chẩn Đoán. Mô hình hiện tại: <strong>{selectedModel}</strong></span>
      </div>

      {/* Performance Metrics Table */}
      <div className="card">
        <h3 className="section-title"><BarChart2 className="icon-blue" /> Bảng So Sánh Hiệu Năng Tổng Quan</h3>
        <div className="metrics-table-scroll">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Mô Hình</th>
                {metricLabels.map(m => <th key={m.key}>{m.label}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {modelNames.map(name => (
                <tr key={name} className={selectedModel === name ? 'row-active' : ''} onClick={() => setSelectedModel(name)}>
                  <td className="model-name-cell">
                    {name}
                    {name === bestModel && <Award size={14} className="icon-gold inline-icon" />}
                  </td>
                  {metricLabels.map(m => (
                    <td key={m.key}>
                      <span className="metric-pill" style={{ backgroundColor: `${m.color}22`, color: m.color }}>
                        {(metrics[name][m.key] * 100).toFixed(1)}%
                      </span>
                    </td>
                  ))}
                  <td>
                    {selectedModel === name ? (
                      <span className="badge-active">Đang dùng</span>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); setSelectedModel(name); }}>Chọn</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="card">
        <h3 className="section-title"><BarChart2 className="icon-blue" /> Biểu Đồ Cột So Sánh Hiệu Năng</h3>
        {renderGroupedBarChart()}
      </div>

      {/* ROC + Confusion Matrices side by side */}
      <div className="grid-2-col margin-top-md">
        {renderROCCurves()}

        <div className="card">
          <h3 className="section-title">Ma Trận Nhầm Lẫn (Confusion Matrix)</h3>
          <p className="margin-bottom-sm">Nhấp vào một ma trận để chọn mô hình đó làm thuật toán dự đoán chính.</p>
          <div className="cm-list">
            {modelNames.map(name => renderConfusionMatrix(metrics[name].confusion_matrix, name))}
          </div>
        </div>
      </div>
    </div>
  );
}
