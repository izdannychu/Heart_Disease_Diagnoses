import { useEffect, useState } from 'react';
import DiagnosisTab from './components/DiagnosisTab';
import AnalysisTab from './components/AnalysisTab';
import ExplorerTab from './components/ExplorerTab';
import AboutTab from './components/AboutTab';
import { HeartPulse, BarChart2, Database, Info, Moon, Sun } from 'lucide-react';

const TABS = [
  { id: 'about', label: 'Giới Thiệu', icon: Info },
  { id: 'diagnosis', label: 'Chẩn Đoán', icon: HeartPulse },
  { id: 'analysis', label: 'Phân Tích Mô Hình', icon: BarChart2 },
  { id: 'explorer', label: 'Khám Phá Dữ Liệu', icon: Database },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [selectedModel, setSelectedModel] = useState('Random Forest');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('cardioai-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('cardioai-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'diagnosis': return <DiagnosisTab selectedModel={selectedModel} />;
      case 'analysis': return <AnalysisTab selectedModel={selectedModel} setSelectedModel={setSelectedModel} />;
      case 'explorer': return <ExplorerTab />;
      case 'about': return <AboutTab />;
      default: return null;
    }
  };

  return (
    <div className="app-layout">
      <header className="floating-header">
        <div className="header-brand">
          <HeartPulse className="brand-icon" />
          <span className="brand-text">CardioAI</span>
        </div>

        <nav className="header-nav" aria-label="Điều hướng chính">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? 'nav-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="model-badge">
            <span className="model-badge-dot"></span>
            <span>{selectedModel}</span>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        {renderTab()}
      </main>
    </div>
  );
}
