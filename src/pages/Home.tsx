import { useState } from 'react';
import { useTarotStore } from '@/store/useTarotStore';
import TarotCard from '@/components/TarotCard';
import CardReading from '@/components/CardReading';
import ShareImageModal from '@/components/ShareImageModal';
import { generateShareImage } from '@/utils/shareImage';
import { Sparkles, AlertCircle, Share2 } from 'lucide-react';

export default function Home() {
  const { currentCard, isFlipping, drawCard, getRemainingDraws, canDrawToday } =
    useTarotStore();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareImageData, setShareImageData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const remaining = getRemainingDraws();
  const canDraw = canDrawToday();

  const handleDraw = () => {
    if (canDraw && !isFlipping) {
      drawCard();
    }
  };

  const handleGenerateShare = async () => {
    if (!currentCard) return;
    setShareModalOpen(true);
    setShareImageData(null);
    setIsGenerating(true);
    try {
      const dataUrl = await generateShareImage(currentCard);
      setShareImageData(dataUrl);
    } catch (err) {
      console.error('生成分享图失败:', err);
    } finally {
      setIsGenerating(false);
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
        <div className="w-full animate-fade-in space-y-6">
          <CardReading card={currentCard} />

          <div className="flex justify-center">
            <button
              onClick={handleGenerateShare}
              className="group relative flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border-2 border-amber-500/50 hover:border-amber-400/70 rounded-xl text-amber-200 hover:text-amber-100 font-medium shadow-lg hover:shadow-amber-500/20 hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Share2 className="w-5 h-5 relative z-10" />
              <span className="relative z-10">生成分享图</span>
              <span className="relative z-10 text-amber-400">✨</span>
            </button>
          </div>
        </div>
      )}

      {!currentCard && !isFlipping && canDraw && (
        <p className="text-gray-500 text-sm animate-pulse">
          点击上方牌面开始抽牌
        </p>
      )}

      <ShareImageModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        imageDataUrl={shareImageData}
        isGenerating={isGenerating}
        cardName={currentCard?.name || ''}
      />
    </div>
  );
}
