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
            <Star className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl sm:text-4xl font-serif text-amber-100">星座运势</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            选择你的星座，查看今日综合运势
          </p>
        </div>

        <div className="mb-10">
          <ZodiacSelector selectedSign={selectedSign} onSelect={setSelectedSign} />
        </div>

        {!selectedSign && (
          <div className="text-center py-12 animate-pulse">
            <Sparkles className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">请选择你的星座 ✨</p>
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
              <div className="bg-white/5 backdrop-blur-sm border border-pink-500/20 rounded-xl p-5 hover:border-pink-400/40 transition-all">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <h3 className="text-pink-200 font-medium">爱情运势</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{fortune.love}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-5 hover:border-blue-400/40 transition-all">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-blue-200 font-medium">事业运势</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{fortune.career}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-xl p-5 hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Coins className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-amber-200 font-medium">财富运势</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{fortune.wealth}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-5 hover:border-green-400/40 transition-all">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-green-200 font-medium">健康运势</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{fortune.health}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 py-4">
              <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-200 text-sm">幸运色</span>
                <span className="text-amber-100 text-sm font-medium">{fortune.luckyColor}</span>
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
