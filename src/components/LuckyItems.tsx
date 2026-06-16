import type { TarotCard } from '@/types';
import { Palette, Hash, Gift, Sparkles } from 'lucide-react';

interface LuckyItemsProps {
  card: TarotCard;
}

export default function LuckyItems({ card }: LuckyItemsProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-serif text-amber-300">每日幸运物推荐</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-black/20 rounded-xl p-4 border border-rose-500/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-500/30 to-pink-500/30 flex items-center justify-center mb-3">
              <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-rose-300" />
            </div>
            <h4 className="text-rose-300 font-medium text-sm mb-1">幸运颜色</h4>
            <p className="text-gray-200 font-semibold text-base sm:text-lg">
              {card.luckyColor}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-sky-500/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-sky-500/30 to-blue-500/30 flex items-center justify-center mb-3">
              <Hash className="w-6 h-6 sm:w-7 sm:h-7 text-sky-300" />
            </div>
            <h4 className="text-sky-300 font-medium text-sm mb-1">幸运数字</h4>
            <p className="text-gray-200 font-semibold text-base sm:text-lg">
              {card.luckyNumber}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center mb-3">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />
            </div>
            <h4 className="text-emerald-300 font-medium text-sm mb-1">幸运物品</h4>
            <p className="text-gray-200 font-semibold text-base sm:text-lg">
              {card.luckyItem}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
