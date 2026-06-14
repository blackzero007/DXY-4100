import type { TarotCard } from '@/types';
import { Heart, Briefcase, Coins, Activity, Sparkles } from 'lucide-react';

interface CardReadingProps {
  card: TarotCard;
}

export default function CardReading({ card }: CardReadingProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-serif text-amber-300">今日运势解读</h3>
        </div>

        <p className="text-gray-200 leading-relaxed mb-8 text-lg">
          {card.meaning}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-xl p-4 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <h4 className="text-pink-300 font-medium">感情运势</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {card.loveFortune}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h4 className="text-blue-300 font-medium">事业运势</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {card.careerFortune}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h4 className="text-yellow-300 font-medium">财运运势</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {card.wealthFortune}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <h4 className="text-green-300 font-medium">健康运势</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {card.healthFortune}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
