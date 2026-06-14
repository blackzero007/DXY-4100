import { useTarotStore } from '@/store/useTarotStore';
import TarotCard from '@/components/TarotCard';
import CardReading from '@/components/CardReading';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function Home() {
  const { currentCard, isFlipping, drawCard, getRemainingDraws, canDrawToday } =
    useTarotStore();

  const remaining = getRemainingDraws();
  const canDraw = canDrawToday();

  const handleDraw = () => {
    if (canDraw && !isFlipping) {
      drawCard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-amber-100 mb-2">
          今日运势占卜
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          心中默念你的问题，点击塔罗牌开启今日运势
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 text-sm font-medium">
            今日剩余 {remaining} 次
          </span>
        </div>
      </div>

      <div className="mb-10">
        <TarotCard
          card={currentCard}
          isFlipping={isFlipping}
          onClick={handleDraw}
          disabled={!canDraw || isFlipping}
        />
      </div>

      {!canDraw && !isFlipping && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-8">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <p className="text-rose-300 text-sm">
            今日抽牌次数已用完，明天再来吧~
          </p>
        </div>
      )}

      {currentCard && !isFlipping && (
        <div className="w-full animate-fade-in">
          <CardReading card={currentCard} />
        </div>
      )}

      {!currentCard && !isFlipping && canDraw && (
        <p className="text-gray-500 text-sm animate-pulse">
          点击上方牌面开始抽牌
        </p>
      )}
    </div>
  );
}
