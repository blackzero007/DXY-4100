import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarotStore } from '@/store/useTarotStore';
import TarotCard from '@/components/TarotCard';
import CardReading from '@/components/CardReading';
import LuckyItems from '@/components/LuckyItems';
import ShareImageModal from '@/components/ShareImageModal';
import MeditationCountdown from '@/components/MeditationCountdown';
import TarotTriviaModal from '@/components/TarotTriviaModal';
import { generateShareImage } from '@/utils/shareImage';
import { playSound } from '@/utils/soundManager';
import { formatDate } from '@/utils/date';
import { tarotCards } from '@/data/tarotCards';
import { Sparkles, AlertCircle, Share2, Wind, CloudFog, Lightbulb, RotateCcw, History } from 'lucide-react';

export default function Home() {
  const { currentCard, isFlipping, drawCard, getRemainingDraws, canDrawToday, drawHistory, reviewLastDraw } =
    useTarotStore();

  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareImageData, setShareImageData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [meditationMode, setMeditationMode] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [triviaModalOpen, setTriviaModalOpen] = useState(false);
  const [showReadingHighlight, setShowReadingHighlight] = useState(false);
  const readingRef = useRef<HTMLDivElement>(null);

  const justDrew = currentCard && !isFlipping;

  useEffect(() => {
    if (justDrew) {
      setShowReadingHighlight(true);
      const timer = setTimeout(() => setShowReadingHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [justDrew]);

  const remaining = getRemainingDraws();
  const canDraw = canDrawToday();

  const lastDrawInfo = useMemo(() => {
    if (drawHistory.length === 0) return null;
    const lastRecord = drawHistory[0];
    const card = tarotCards.find((c) => c.id === lastRecord.cardId);
    if (!card) return null;
    return {
      date: formatDate(lastRecord.date),
      cardName: card.name,
      symbol: card.symbol,
    };
  }, [drawHistory]);

  const handleDraw = () => {
    if (canDraw && !isFlipping && !isMeditating) {
      playSound('drawCard');
      if (meditationMode) {
        setIsMeditating(true);
      } else {
        drawCard();
      }
    }
  };

  const handleMeditationComplete = useCallback(() => {
    setIsMeditating(false);
    playSound('drawCard');
    drawCard();
  }, [drawCard]);

  const handleReviewLastDraw = () => {
    playSound('buttonClick');
    reviewLastDraw();
    setTimeout(() => {
      readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleGenerateShare = async () => {
    if (!currentCard) return;
    playSound('buttonClick');
    playSound('modalOpen');
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
        <h1
          className="text-3xl sm:text-4xl font-serif mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          今日运势占卜
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          心中默念你的问题，点击塔罗牌开启今日运势
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <div
          className="flex items-center gap-1.5 px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'var(--accent-light)',
            border: '1px solid var(--border-accent-strong)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
            今日剩余 {remaining} 次
          </span>
        </div>

        {lastDrawInfo && (
          <button
            onClick={handleReviewLastDraw}
            disabled={isFlipping || isMeditating}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-300"
            style={{
              backgroundColor: 'var(--accent-light)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-accent)',
              opacity: (isFlipping || isMeditating) ? 0.5 : 1,
              cursor: (isFlipping || isMeditating) ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isFlipping && !isMeditating) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent-hover)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-accent)';
            }}
            title="快速回顾上次抽牌"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">上次抽牌</span>
            <span className="text-sm">{lastDrawInfo.symbol}</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {lastDrawInfo.date} · {lastDrawInfo.cardName}
            </span>
          </button>
        )}

        <button
          onClick={() => {
            playSound('buttonClick');
            setMeditationMode(!meditationMode);
          }}
          disabled={isFlipping || isMeditating || !!currentCard}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-300"
          style={{
            backgroundColor: meditationMode ? 'var(--meditation-active-bg)' : 'var(--meditation-inactive-bg)',
            borderColor: meditationMode ? 'var(--meditation-active-border)' : 'var(--meditation-inactive-border)',
            color: meditationMode ? 'var(--meditation-active-text)' : 'var(--meditation-inactive-text)',
            opacity: (isFlipping || isMeditating || !!currentCard) ? 0.5 : 1,
            cursor: (isFlipping || isMeditating || !!currentCard) ? 'not-allowed' : 'pointer',
          }}
        >
          {meditationMode ? (
            <>
              <Wind className="w-4 h-4 animate-pulse" style={{ color: 'var(--meditation-active-text)' }} />
              <span className="text-sm font-medium">冥想模式 开</span>
            </>
          ) : (
            <>
              <CloudFog className="w-4 h-4" />
              <span className="text-sm font-medium">冥想模式</span>
            </>
          )}
        </button>
      </div>

      <div className="mb-10 relative">
        <TarotCard
          card={currentCard}
          isFlipping={isFlipping}
          onClick={handleDraw}
          disabled={!canDraw || isFlipping || isMeditating}
          floating={!currentCard && !isFlipping && canDraw && !isMeditating}
        />
        {isFlipping && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div
              className="px-6 py-3 rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-accent-strong)',
              }}
            >
              <p className="text-lg font-serif animate-pulse" style={{ color: 'var(--text-accent)' }}>
                ✧ 命运之轮转动中... ✧
              </p>
            </div>
          </div>
        )}
      </div>

      {!canDraw && !isFlipping && (
        <div
          className="flex flex-col items-center gap-3 px-5 py-4 rounded-xl mb-8"
          style={{
            backgroundColor: 'var(--limit-bg)',
            border: '1px solid var(--limit-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--limit-text)' }} />
            <p className="text-sm" style={{ color: 'var(--limit-text)' }}>
              今日抽牌次数已用完，明天再来吧~
            </p>
          </div>
          <button
            onClick={() => {
              playSound('buttonClick');
              navigate('/history');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: 'var(--accent-light)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-accent)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent-hover)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-accent)';
            }}
          >
            <History className="w-4 h-4" />
            查看历史记录
          </button>
        </div>
      )}

      {currentCard && !isFlipping && (
        <div ref={readingRef} className="w-full animate-fade-in space-y-6">
          <div className="text-center">
            <h2
              className={`text-xl sm:text-2xl font-serif transition-all duration-500 ${
                showReadingHighlight ? 'scale-110' : 'scale-100'
              }`}
              style={{
                color: 'var(--text-accent)',
                textShadow: showReadingHighlight
                  ? '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)'
                  : 'none',
              }}
            >
              ✦ 今日运势已揭晓 ✦
            </h2>
          </div>
          <div
            className={`relative rounded-2xl p-1 transition-all duration-500 ${
              showReadingHighlight ? 'animate-glow' : ''
            }`}
            style={{
              background: showReadingHighlight
                ? 'linear-gradient(135deg, var(--accent-color), transparent, var(--accent-color))'
                : 'transparent',
            }}
          >
            <div className="rounded-xl">
              <CardReading card={currentCard} />
            </div>
          </div>
          <LuckyItems card={currentCard} />

          <div className="flex justify-center">
            <button
              onClick={handleGenerateShare}
              className="group relative flex items-center gap-2.5 px-7 py-3.5 border-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              style={{
                background: `linear-gradient(to right, var(--share-gradient-from), var(--share-gradient-to))`,
                borderColor: 'var(--border-accent-strong)',
                color: 'var(--text-accent)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = `linear-gradient(to right, var(--share-gradient-from-hover), var(--share-gradient-to-hover))`;
                el.style.borderColor = 'var(--border-accent-hover)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = `linear-gradient(to right, var(--share-gradient-from), var(--share-gradient-to))`;
                el.style.borderColor = 'var(--border-accent-strong)';
              }}
            >
              <Share2 className="w-5 h-5 relative z-10" />
              <span className="relative z-10">生成分享图</span>
              <span className="relative z-10" style={{ color: 'var(--accent-color)' }}>✨</span>
            </button>
          </div>
        </div>
      )}

      {!currentCard && !isFlipping && canDraw && !isMeditating && (
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{
              backgroundColor: 'var(--accent-light)',
              border: '1px solid var(--border-accent)',
            }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: 'var(--accent-color)' }} />
            <span
              className="text-sm font-medium animate-pulse"
              style={{ color: 'var(--text-accent)' }}
            >
              点击牌面
            </span>
            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: 'var(--accent-color)' }} />
          </div>
        </div>
      )}

      <button
        onClick={() => {
          playSound('buttonClick');
          playSound('modalOpen');
          setTriviaModalOpen(true);
        }}
        className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 active:scale-95"
        style={{
          backgroundColor: 'var(--accent-light)',
          border: `1px solid var(--border-accent)`,
          color: 'var(--text-accent)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-light)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent-hover)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-accent-hover)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-light)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-accent)';
        }}
      >
        <Lightbulb className="w-4 h-4" />
        <span>💡 今日塔罗小知识</span>
      </button>

      <ShareImageModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        imageDataUrl={shareImageData}
        isGenerating={isGenerating}
        cardName={currentCard?.name || ''}
      />

      <MeditationCountdown
        isActive={isMeditating}
        onComplete={handleMeditationComplete}
        duration={5}
      />

      <TarotTriviaModal
        isOpen={triviaModalOpen}
        onClose={() => setTriviaModalOpen(false)}
      />
    </div>
  );
}
