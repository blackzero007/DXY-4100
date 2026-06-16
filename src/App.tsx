import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import History from '@/pages/History';
import TarotIndex from '@/pages/TarotIndex';
import Horoscope from '@/pages/Horoscope';
import NavBar from '@/components/NavBar';
import { ThemeProvider } from '@/hooks/useTheme';

export default function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="fixed inset-0" style={{
          background: `linear-gradient(to bottom, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
        }} />
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'var(--glow-bg1)' }} />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--glow-bg2)' }} />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'var(--glow-bg3)' }} />
        </div>
        <div className="fixed inset-0 opacity-50" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/tarot-index" element={<TarotIndex />} />
            <Route path="/horoscope" element={<Horoscope />} />
          </Routes>
        </div>
      </div>
    </Router>
    </ThemeProvider>
  );
}
