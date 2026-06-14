import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import History from '@/pages/History';
import NavBar from '@/components/NavBar';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-purple-950 text-gray-100 relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950" />
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl" />
        </div>
        <div className="fixed inset-0 opacity-50" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
