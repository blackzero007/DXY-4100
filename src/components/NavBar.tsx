import { Link, useLocation } from 'react-router-dom';
import { Sparkles, History, BookOpen, Star, Sun, Moon } from 'lucide-react';
import { playSound } from '@/utils/soundManager';
import { useTheme } from '@/hooks/useTheme';

export default function NavBar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const handleNavClick = () => {
    playSound('navClick');
  };

  const handleThemeToggle = () => {
    playSound('buttonClick');
    toggleTheme();
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: `linear-gradient(to bottom, var(--bg-nav-from), var(--bg-nav-to))`,
        borderBottom: '1px solid var(--border-accent)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={handleNavClick}>
            <Sparkles className="w-6 h-6 transition-colors" style={{ color: 'var(--accent-color)' }} />
            <span
              className="text-xl font-serif transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              塔罗占卜
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              onClick={handleNavClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === '/' ? 'var(--text-accent)' : 'var(--nav-text)',
                backgroundColor: location.pathname === '/' ? 'var(--accent-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nav-hover-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
                }
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>今日抽牌</span>
            </Link>
            <Link
              to="/horoscope"
              onClick={handleNavClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === '/horoscope' ? 'var(--text-accent)' : 'var(--nav-text)',
                backgroundColor: location.pathname === '/horoscope' ? 'var(--accent-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/horoscope') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nav-hover-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/horoscope') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
                }
              }}
            >
              <Star className="w-4 h-4" />
              <span>星座运势</span>
            </Link>
            <Link
              to="/history"
              onClick={handleNavClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === '/history' ? 'var(--text-accent)' : 'var(--nav-text)',
                backgroundColor: location.pathname === '/history' ? 'var(--accent-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/history') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nav-hover-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/history') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
                }
              }}
            >
              <History className="w-4 h-4" />
              <span>历史记录</span>
            </Link>
            <Link
              to="/tarot-index"
              onClick={handleNavClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === '/tarot-index' ? 'var(--text-accent)' : 'var(--nav-text)',
                backgroundColor: location.pathname === '/tarot-index' ? 'var(--accent-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/tarot-index') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nav-hover-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/tarot-index') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-text)';
                }
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>塔罗图鉴</span>
            </Link>

            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: 'var(--accent-light)',
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-color)',
              }}
              title={isDark ? '切换亮色模式' : '切换暗色模式'}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
