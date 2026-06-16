import { Link, useLocation } from 'react-router-dom';
import { Sparkles, History, BookOpen, Star, Sun, Moon } from 'lucide-react';
import { playSound } from '@/utils/soundManager';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${year}年${month}月${day}日 ${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = () => {
    playSound('navClick');
  };

  const handleThemeToggle = () => {
    playSound('buttonClick');
    toggleTheme();
  };

  const navLinks = [
    { to: '/', icon: Sparkles, label: '今日抽牌' },
    { to: '/horoscope', icon: Star, label: '星座运势' },
    { to: '/history', icon: History, label: '历史记录' },
    { to: '/tarot-index', icon: BookOpen, label: '塔罗图鉴' },
  ];

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

          <div
            className="text-sm font-medium hidden sm:block"
            style={{ color: 'rgba(245, 158, 11, 0.6)' }}
          >
            {currentTime}
          </div>

          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              const isHovered = hoveredLink === link.to;
              const showIndicator = isActive || isHovered;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-300"
                  style={{
                    color: isActive ? 'var(--text-accent)' : isHovered ? 'var(--text-accent-hover)' : 'var(--nav-text)',
                  }}
                  onMouseEnter={() => {
                    setHoveredLink(link.to);
                  }}
                  onMouseLeave={() => {
                    setHoveredLink(null);
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: showIndicator ? '60%' : '0%',
                      backgroundColor: 'var(--accent-color)',
                      opacity: showIndicator ? 1 : 0,
                    }}
                  />
                </Link>
              );
            })}

            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ml-2"
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
