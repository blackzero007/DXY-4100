import { useEffect } from 'react';
import { X, Heart, Briefcase, Coins, Activity, Sparkles } from 'lucide-react';
import type { TarotCard } from '@/types';

interface CardDetailModalProps {
  card: TarotCard | null;
  onClose: () => void;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  useEffect(() => {
    if (!card) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [card, onClose]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 to-indigo-950/95 rounded-2xl border border-amber-500/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`bg-gradient-to-br ${card.color} p-8 border-b border-amber-500/30`}>
          <div className="flex flex-col items-center text-center">
            <div className="text-8xl mb-4 drop-shadow-2xl">{card.symbol}</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif drop-shadow-lg mb-2">
              {card.name}
            </h2>
            <p className="text-white/80 text-lg font-serif italic">{card.nameEn}</p>
            <div className="mt-4 w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-serif text-amber-300">卡牌解读</h3>
          </div>

          <p className="text-gray-200 leading-relaxed mb-8 text-lg">{card.meaning}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <h4 className="text-pink-300 font-medium">感情运势</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{card.loveFortune}</p>
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h4 className="text-blue-300 font-medium">事业运势</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{card.careerFortune}</p>
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <h4 className="text-yellow-300 font-medium">财运运势</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{card.wealthFortune}</p>
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-green-400" />
                <h4 className="text-green-300 font-medium">健康运势</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{card.healthFortune}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
