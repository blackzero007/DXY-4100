import { useEffect, useState } from 'react';
import { Wind } from 'lucide-react';

interface MeditationCountdownProps {
  isActive: boolean;
  onComplete: () => void;
  duration?: number;
}

export default function MeditationCountdown({
  isActive,
  onComplete,
  duration = 5,
}: MeditationCountdownProps) {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setCount(duration);
      return;
    }

    setCount(duration);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, duration, onComplete]);

  const breathText = count % 2 === 0 ? '吸气...' : '呼气...';
  const scaleClass = count % 2 === 0 ? 'scale-110' : 'scale-100';

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-2 text-amber-300/80 text-lg font-serif">
          <Wind className="w-5 h-5 animate-pulse" />
          <span>冥想模式</span>
          <Wind className="w-5 h-5 animate-pulse" />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full border-4 border-amber-400/20 animate-ping-slow" />
          <div className="absolute w-60 h-60 rounded-full border-4 border-amber-400/30 animate-pulse" />
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-amber-500/10 to-purple-600/10 border-2 border-amber-400/40" />
          
          <div
            className={`relative z-10 transition-all duration-1000 ease-in-out ${scaleClass}`}
          >
            <span className="text-8xl sm:text-9xl font-serif text-amber-100 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              {count > 0 ? count : '✨'}
            </span>
          </div>
        </div>

        <div
          className={`text-2xl sm:text-3xl font-serif text-amber-200 tracking-widest transition-all duration-1000 ease-in-out ${scaleClass}`}
        >
          {count > 0 ? breathText : '准备抽牌...'}
        </div>

        <p className="text-gray-400 text-sm max-w-xs text-center">
          深呼吸，让心静下来，专注于你的问题
        </p>
      </div>
    </div>
  );
}
