import { useEffect, useState } from 'react';
import { X, Heart, Trash2 } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  initialContent?: string;
  moodId?: string;
  onClose: () => void;
  onSave: (content: string) => void;
  onDelete?: () => void;
}

export default function MoodModal({
  isOpen,
  initialContent = '',
  moodId,
  onClose,
  onSave,
  onDelete,
}: MoodModalProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

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

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-purple-900/95 to-indigo-950/95 rounded-2xl border border-amber-500/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-serif text-amber-100">
              {moodId ? '编辑心情' : '写心情'}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            记录你抽牌后的心情和感受吧
          </p>
        </div>

        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你此刻的心情..."
            className="w-full h-40 bg-black/30 border border-amber-500/20 rounded-xl p-4 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-gray-500 text-sm">
              {content.length}/500
            </span>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          {moodId && onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-gray-500/10 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
