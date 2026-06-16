import { zodiacSigns } from '@/data/horoscope';
import type { ZodiacSign } from '@/data/horoscope';
import { playSound } from '@/utils/soundManager';

interface ZodiacSelectorProps {
  selectedSign: ZodiacSign | null;
  onSelect: (sign: ZodiacSign) => void;
}

export default function ZodiacSelector({ selectedSign, onSelect }: ZodiacSelectorProps) {
  const handleSelect = (sign: ZodiacSign) => {
    playSound('buttonClick');
    onSelect(sign);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {zodiacSigns.map((sign, index) => {
        const isSelected = selectedSign?.id === sign.id;
        return (
          <button
            key={sign.id}
            onClick={() => handleSelect(sign)}
            className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 animate-fade-in ${
              isSelected
                ? 'bg-amber-500/20 border-amber-400/70 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/40'
            }`}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div
              className={`text-3xl transition-transform duration-300 ${
                isSelected ? 'scale-110' : 'group-hover:scale-110'
              }`}
            >
              {sign.symbol}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                isSelected ? 'text-amber-200' : 'text-gray-300 group-hover:text-amber-200'
              }`}
            >
              {sign.name}
            </span>
            <span className="text-[10px] text-gray-500">{sign.dateRange}</span>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-purple-950" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
