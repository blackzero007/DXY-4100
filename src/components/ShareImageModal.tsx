import { useEffect, useState } from 'react';
import { X, Download, Loader2, Smartphone } from 'lucide-react';

interface ShareImageModalProps {
  open: boolean;
  onClose: () => void;
  imageDataUrl: string | null;
  isGenerating: boolean;
  cardName: string;
}

export default function ShareImageModal({
  open,
  onClose,
  imageDataUrl,
  isGenerating,
  cardName,
}: ShareImageModalProps) {
  const [copiedTip, setCopiedTip] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleDownload = async () => {
    if (!imageDataUrl) return;
    try {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = `塔罗运势-${cardName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCopiedTip(true);
      setTimeout(() => setCopiedTip(false), 2000);
    } catch {
      alert('下载失败，请长按图片保存');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        className="relative w-full max-w-sm max-h-[92vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full bg-gradient-to-br from-purple-900/80 to-indigo-950/80 rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-500/20 flex items-center justify-between">
            <h3 className="text-amber-200 font-serif text-lg">
              ✦ 分享运势卡片 ✦
            </h3>
            {!isGenerating && imageDataUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                保存
              </button>
            )}
          </div>

          <div className="p-4 flex items-center justify-center bg-black/30 min-h-[400px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-white/70">
                <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                <p className="text-sm">正在生成精美分享卡片...</p>
              </div>
            ) : imageDataUrl ? (
              <div className="relative w-full">
                <img
                  src={imageDataUrl}
                  alt="分享卡片"
                  className="w-full h-auto rounded-xl shadow-lg border border-amber-500/30 select-none"
                  draggable={false}
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                  <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-amber-100 text-xs">
                    长按图片即可保存
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-white/50 text-sm">图片生成失败，请重试</p>
            )}
          </div>

          {copiedTip && (
            <div className="px-5 py-2 bg-emerald-500/15 border-t border-emerald-500/30 text-emerald-300 text-sm text-center">
              ✓ 图片已保存到本地
            </div>
          )}

          {!copiedTip && !isGenerating && imageDataUrl && (
            <div className="px-5 py-3 border-t border-amber-500/20">
              <p className="text-white/60 text-xs text-center leading-relaxed">
                💡 在手机上长按图片可保存到相册，<br />
                或点击右上角"保存"按钮下载到本地
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
