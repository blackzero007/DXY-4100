import { Link, useLocation } from 'react-router-dom';
import { Sparkles, History } from 'lucide-react';

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-950/95 to-purple-950/70 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <span className="text-xl font-serif text-amber-100 group-hover:text-white transition-colors">
              塔罗占卜
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'text-amber-300 bg-amber-500/10'
                  : 'text-gray-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>今日抽牌</span>
            </Link>
            <Link
              to="/history"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/history'
                  ? 'text-amber-300 bg-amber-500/10'
                  : 'text-gray-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>历史记录</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
