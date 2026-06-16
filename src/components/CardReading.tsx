import type { DrawnCard } from '@/types';
import { Heart, Briefcase, Coins, Activity, Sparkles } from 'lucide-react';
import { useTarotStore } from '@/store/useTarotStore';
import { playSound } from '@/utils/soundManager';

interface CardReadingProps {
  card: DrawnCard;
}

export default function CardReading({ card }: CardReadingProps) {
  const { isReversed } = card;
  const meaning = isReversed ? card.reversedMeaning : card.meaning;
  const loveFortune = isReversed ? card.reversedLoveFortune : card.loveFortune;
  const careerFortune = isReversed ? card.reversedCareerFortune : card.careerFortune;
  const wealthFortune = isReversed ? card.reversedWealthFortune : card.wealthFortune;
  const healthFortune = isReversed ? card.reversedHealthFortune : card.healthFortune;

  const { currentRecordId, toggleFavorite, isCurrentCardFavorite } = useTarotStore();
  const isFavorite = isCurrentCardFavorite();

  const handleToggleFavorite = () => {
    if (!currentRecordId) return;
    toggleFavorite(currentRecordId);
    if (!isFavorite) {
      playSound('success');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl"
        style={{
          background: `linear-gradient(to bottom right, var(--reading-bg-from), var(--reading-bg-to))`,
          border: '1px solid var(--border-accent-hover)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
          <h3 className="text-xl font-serif" style={{ color: 'var(--text-accent)' }}>今日运势解读</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isReversed
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}
          >
            {isReversed ? '逆位' : '正位'}
          </span>
        </div>

        <p className="leading-relaxed mb-8 text-lg" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>
          {meaning}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--info-bg)', border: '1px solid rgba(236, 72, 153, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <h4 className="text-pink-300 font-medium">感情运势</h4>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
              {loveFortune}
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--info-bg)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h4 className="text-blue-300 font-medium">事业运势</h4>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
              {careerFortune}
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--info-bg)', border: '1px solid rgba(234, 179, 8, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h4 className="text-yellow-300 font-medium">财运运势</h4>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
              {wealthFortune}
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--info-bg)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <h4 className="text-green-300 font-medium">健康运势</h4>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
              {healthFortune}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-accent)' }}>
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-95 ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-white/5 text-pink-300/70 border border-pink-500/20 hover:bg-pink-500/10 hover:text-pink-300'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? '已收藏' : '收藏'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
