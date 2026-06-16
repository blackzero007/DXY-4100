import { useState, useMemo } from 'react';
import { Star, Heart, Briefcase, Coins, Activity, Sparkles } from 'lucide-react';
import ZodiacSelector from '@/components/ZodiacSelector';
import { getDailyFortune } from '@/data/horoscope';
import type { ZodiacSign } from '@/data/horoscope';

export default function Horoscope() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  const fortune = useMemo(() => {
    if (!selectedSign) return null;
    return getDailyFortune(selectedSign.id);
  }, [selectedSign]);

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8" style={{ color: 'var(--accent-color)' }} />
            <h1 className="text-3xl sm:text-4xl font-serif" style={{ color: 'var(--text-primary)' }}>星座运势</h1>
          </div>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            输入或选择你的星座，查看今日综合运势
          </p>
        </div>

        <div className="mb-10">
          <ZodiacSelector selectedSign={selectedSign} onSelect={setSelectedSign} autoSelectOnMatch />
        </div>

        {!selectedSign && (
          <div className="text-center py-12 animate-pulse">
            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-color)', opacity: 0.3 }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>请输入或选择你的星座 ✨</p>
          </div>
        )}

        {selectedSign && fortune && (
          <div className="animate-fade-in space-y-6">
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${selectedSign.color} p-6 sm:p-8 border border-white/20 shadow-2xl`}>
              <div className="absolute top-0 right-0 text-[120px] sm:text-[160px] opacity-10 leading-none select-none">
                {selectedSign.symbol}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl sm:text-6xl">{selectedSign.symbol}</span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold">{selectedSign.name}</h2>
                    <p className="text-white/70 text-sm">{selectedSign.dateRange} · {selectedSign.element}象星座</p>
                  </div>
                </div>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">{fortune.overall}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="backdrop-blur-sm rounded-xl p-5 transition-all"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(236, 72, 153, 0.2)' }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <h3 className="text-pink-200 font-medium">爱情运势</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{fortune.love}</p>
              </div>

              <div
                className="backdrop-blur-sm rounded-xl p-5 transition-all"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-blue-200 font-medium">事业运势</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{fortune.career}</p>
              </div>

              <div
                className="backdrop-blur-sm rounded-xl p-5 transition-all"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Coins className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-amber-200 font-medium">财富运势</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{fortune.wealth}</p>
              </div>

              <div
                className="backdrop-blur-sm rounded-xl p-5 transition-all"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-green-200 font-medium">健康运势</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{fortune.health}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 py-4">
              <div
                className="flex items-center gap-2 px-5 py-3 rounded-full"
                style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--border-accent-strong)' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                <span className="text-sm" style={{ color: 'var(--text-accent)' }}>幸运色</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fortune.luckyColor}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-purple-200 text-sm">幸运数字</span>
                <span className="text-purple-100 text-sm font-medium">{fortune.luckyNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
