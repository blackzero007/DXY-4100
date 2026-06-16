import { useEffect, useState } from 'react';
import { X, Lightbulb, RefreshCw, BookOpen } from 'lucide-react';
import { playSound } from '@/utils/soundManager';
import { tarotKnowledgeList } from '@/data/tarotKnowledge';

interface TarotTriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TarotTriviaModal({ isOpen, onClose }: TarotTriviaModalProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * tarotKnowledgeList.length)
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const knowledge = tarotKnowledgeList[currentIndex];

  const handleRefresh = () => {
    playSound('buttonClick');
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * tarotKnowledgeList.length);
    } while (newIndex === currentIndex && tarotKnowledgeList.length > 1);
    setCurrentIndex(newIndex);
  };

  const handleClose = () => {
    playSound('modalClose');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-gradient-to-br from-purple-900/95 to-indigo-950/95 rounded-2xl border border-amber-500/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-serif text-amber-100">
              今日塔罗小知识
            </h3>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            每天了解一点塔罗牌的奥秘
          </p>
        </div>

        <div className="p-6">
          <div className="bg-black/30 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400/70" />
              <span className="text-amber-400/70 text-xs font-medium uppercase tracking-wider">
                {knowledge.category}
              </span>
            </div>
            <p className="text-gray-200 text-base leading-relaxed">
              {knowledge.content}
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-gray-500 text-xs">
              {currentIndex + 1} / {tarotKnowledgeList.length}
            </span>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-center">
          <button
            onClick={handleRefresh}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 hover:border-amber-400/60 text-amber-200 hover:text-amber-100 font-medium transition-all duration-300 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            换一条
          </button>
        </div>
      </div>
    </div>
  );
}
