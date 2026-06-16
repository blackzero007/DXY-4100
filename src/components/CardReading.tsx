import type { TarotCard } from '@/types';
import { Heart, Briefcase, Coins, Activity, Sparkles } from 'lucide-react';

interface CardReadingProps {
  card: TarotCard;
}

export default function CardReading({ card }: CardReadingProps) {
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
        </div>

        <p className="leading-relaxed mb-8 text-lg" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>
          {card.meaning}
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
              {card.loveFortune}
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
              {card.careerFortune}
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
              {card.wealthFortune}
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
              {card.healthFortune}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
