import { zodiacSigns } from '@/data/horoscope';
import type { ZodiacSign } from '@/data/horoscope';
import { playSound } from '@/utils/soundManager';
import { Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface ZodiacSelectorProps {
  selectedSign: ZodiacSign | null;
  onSelect: (sign: ZodiacSign) => void;
  autoSelectOnMatch?: boolean;
}

export default function ZodiacSelector({ selectedSign, onSelect, autoSelectOnMatch = false }: ZodiacSelectorProps) {
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  const filteredSigns = useMemo(() => {
    if (!searchText.trim()) return zodiacSigns;
    const query = searchText.trim().toLowerCase();
    return zodiacSigns.filter((sign) =>
      sign.name.toLowerCase().includes(query) ||
      sign.id.toLowerCase().includes(query) ||
      sign.symbol.includes(query)
    );
  }, [searchText]);

  useEffect(() => {
    if (autoSelectOnMatch && searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      const exactMatch = zodiacSigns.find(
        (sign) => sign.name.toLowerCase() === query || sign.id.toLowerCase() === query
      );
      if (exactMatch) {
        setError('');
        if (selectedSign?.id !== exactMatch.id) {
          playSound('buttonClick');
          onSelect(exactMatch);
        }
      } else if (filteredSigns.length === 1) {
        setError('');
        if (selectedSign?.id !== filteredSigns[0].id) {
          playSound('buttonClick');
          onSelect(filteredSigns[0]);
        }
      } else if (filteredSigns.length === 0) {
        setError(`未找到名为"${searchText}"的星座，请检查输入`);
      } else {
        setError('');
      }
    }
  }, [searchText, autoSelectOnMatch, filteredSigns, onSelect, selectedSign]);

  const handleSelect = (sign: ZodiacSign) => {
    playSound('buttonClick');
    setSearchText(sign.name);
    setError('');
    onSelect(sign);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="输入星座名称，如：白羊座、狮子..."
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
        />
        {searchText && (
          <button
            onClick={() => {
              setSearchText('');
              setError('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <span className="text-rose-300 text-sm">{error}</span>
        </div>
      )}

      {!error && searchText && filteredSigns.length > 1 && (
        <p className="text-sm text-amber-300 px-1">
          找到 {filteredSigns.length} 个匹配的星座，请点击选择
        </p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {filteredSigns.map((sign, index) => {
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
    </div>
  );
}
