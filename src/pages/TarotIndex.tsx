import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { tarotCards } from '@/data/tarotCards';
import type { TarotCard } from '@/types';
import CardDetailModal from '@/components/CardDetailModal';
import { playSound } from '@/utils/soundManager';

export default function TarotIndex() {
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const handleCardClick = (card: TarotCard) => {
    playSound('buttonClick');
    playSound('modalOpen');
    setSelectedCard(card);
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" style={{ color: 'var(--accent-color)' }} />
            <h1 className="text-3xl sm:text-4xl font-serif" style={{ color: 'var(--text-primary)' }}>塔罗牌图鉴</h1>
          </div>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            大阿卡纳牌 · 共 22 张 · 点击卡牌查看详细解读
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {tarotCards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div
                className={`relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br ${card.color} shadow-lg group-hover:-translate-y-1 transition-all duration-300`}
                style={{
                  border: '2px solid',
                  borderColor: 'var(--border-accent-strong)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent-hover)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 25px -5px var(--accent-color), 0 8px 10px -6px var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent-strong)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <div className="text-4xl sm:text-5xl mb-2 drop-shadow-lg group-hover:scale-110 transition-transform">
                    {card.symbol}
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-serif font-bold text-sm sm:text-base drop-shadow-lg">
                      {card.name}
                    </h3>
                    <p className="text-white/70 text-[10px] sm:text-xs font-serif italic mt-0.5">
                      {card.nameEn}
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 left-2 text-white/50 text-[10px] font-serif">
                  {String(card.id).padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2 text-white/70 text-lg">
                  {card.symbol}
                </div>
                <div className="absolute bottom-2 left-2 text-white/70 text-lg rotate-180">
                  {card.symbol}
                </div>
                <div className="absolute bottom-2 right-2 text-white/50 text-[10px] font-serif rotate-180">
                  {String(card.id).padStart(2, '0')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
}
