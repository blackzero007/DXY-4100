import { useMemo, useState } from 'react';
import { useTarotStore } from '@/store/useTarotStore';
import { tarotCards } from '@/data/tarotCards';
import { formatDate } from '@/utils/date';
import { History, BarChart3, Trophy, Calendar, Heart, Pencil, Database } from 'lucide-react';
import MoodModal from '@/components/MoodModal';
import DataBackupButtons from '@/components/DataBackupButtons';
import { playSound } from '@/utils/soundManager';
import type { TarotCard, DrawRecord, MoodEntry } from '@/types';

export default function HistoryPage() {
  const { drawHistory, addMoodEntry, updateMoodEntry, deleteMoodEntry, getMoodByRecordId, toggleFavorite } = useTarotStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DrawRecord | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(undefined);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const stats = useMemo(() => {
    const totalDraws = drawHistory.length;
    const cardCountMap = new Map<number, number>();

    drawHistory.forEach((record) => {
      cardCountMap.set(record.cardId, (cardCountMap.get(record.cardId) || 0) + 1);
    });

    let mostFrequentCard: TarotCard | null = null;
    let maxCount = 0;

    cardCountMap.forEach((count, cardId) => {
      if (count > maxCount) {
        maxCount = count;
        const card = tarotCards.find((c) => c.id === cardId);
        if (card) mostFrequentCard = card;
      }
    });

    const uniqueDays = new Set(drawHistory.map((r) => r.date)).size;

    return { totalDraws, mostFrequentCard, mostFrequentCount: maxCount, uniqueDays };
  }, [drawHistory]);

  const filteredHistory = useMemo(() => {
    let result = drawHistory;
    if (selectedCardId !== null) {
      result = result.filter((record) => record.cardId === selectedCardId);
    }
    if (showOnlyFavorites) {
      result = result.filter((record) => record.isFavorite);
    }
    return result;
  }, [drawHistory, selectedCardId, showOnlyFavorites]);

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof drawHistory>();
    filteredHistory.forEach((record) => {
      const dateRecords = groups.get(record.date) || [];
      dateRecords.push(record);
      groups.set(record.date, dateRecords);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredHistory]);

  const getCardById = (id: number) => tarotCards.find((c) => c.id === id);

  const handleOpenMoodModal = (record: DrawRecord) => {
    setCurrentRecord(record);
    setCurrentMood(getMoodByRecordId(record.id));
    playSound('buttonClick');
    playSound('modalOpen');
    setModalOpen(true);
  };

  const handleSaveMood = (content: string) => {
    if (!currentRecord) return;
    playSound('success');
    if (currentMood) {
      updateMoodEntry(currentMood.id, content);
    } else {
      addMoodEntry(currentRecord.id, content);
    }
  };

  const handleDeleteMood = () => {
    if (currentMood) {
      playSound('buttonClick');
      playSound('modalClose');
      deleteMoodEntry(currentMood.id);
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>
            历史记录
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            查看你的抽牌历史和运势回顾
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div
            className="backdrop-blur-sm rounded-xl p-4"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-accent)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>总抽牌数</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalDraws}</p>
          </div>

          <div
            className="backdrop-blur-sm rounded-xl p-4"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-accent)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>活跃天数</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.uniqueDays}</p>
          </div>

          <div
            className="backdrop-blur-sm rounded-xl p-4 col-span-2 sm:col-span-2"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-accent)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>最常出现的牌</span>
            </div>
            {stats.mostFrequentCard ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stats.mostFrequentCard.symbol}</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {stats.mostFrequentCard.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    出现 {stats.mostFrequentCount} 次
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>暂无数据</p>
            )}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
            <h2 className="text-xl font-serif" style={{ color: 'var(--text-primary)' }}>数据备份与恢复</h2>
          </div>
          <div
            className="backdrop-blur-sm rounded-xl p-5"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--backup-border)' }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              导出你的抽牌记录和心情数据到本地文件，或从备份文件中恢复数据。
            </p>
            <DataBackupButtons />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <h2 className="text-xl font-serif" style={{ color: 'var(--text-primary)' }}>抽牌记录</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setShowOnlyFavorites(!showOnlyFavorites);
                  playSound('buttonClick');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  showOnlyFavorites
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-white/5 text-pink-300/70 border border-pink-500/20 hover:bg-pink-500/10 hover:text-pink-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>仅看收藏</span>
              </button>
              <div className="flex items-center gap-2">
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  按牌名筛选：
                </label>
                <select
                  value={selectedCardId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCardId(value === '' ? null : Number(value));
                    playSound('buttonClick');
                  }}
                  className="px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  <option value="">全部</option>
                  {tarotCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.symbol} {card.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {groupedByDate.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ backgroundColor: 'var(--empty-bg)', border: '1px solid var(--empty-border)' }}
            >
              <History className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>暂无抽牌记录</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>去首页抽取你的第一张牌吧</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedByDate.map(([date, records]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    />
                    <h3 className="font-medium" style={{ color: 'var(--text-accent)' }}>
                      {formatDate(date)}
                    </h3>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      ({records.length} 张牌)
                    </span>
                  </div>

                  <div
                    className="ml-4 pl-4 space-y-3"
                    style={{ borderLeft: '2px solid var(--border-accent)' }}
                  >
                    {records.map((record) => {
                      const card = getCardById(record.cardId);
                      if (!card) return null;
                      const mood = getMoodByRecordId(record.id);
                      const isReversed = record.isReversed ?? false;
                      const meaning = isReversed ? card.reversedMeaning : card.meaning;
                      return (
                        <div
                          key={record.id}
                          className="backdrop-blur-sm rounded-xl p-4 transition-colors"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border-hover)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)';
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-14 h-20 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0 ${isReversed ? 'rotate-180' : ''}`}
                            >
                              {card.symbol}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {card.name}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                    isReversed
                                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                  }`}
                                >
                                  {isReversed ? '逆位' : '正位'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(record.id);
                                  }}
                                  className="transition-transform active:scale-90"
                                  title={record.isFavorite ? '取消收藏' : '收藏'}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      record.isFavorite
                                        ? 'fill-rose-400 text-rose-400'
                                        : 'text-gray-400/50'
                                    }`}
                                  />
                                </button>
                              </div>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                                {card.nameEn}
                              </p>
                              <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                {meaning}
                              </p>
                            </div>
                            <button
                              onClick={() => handleOpenMoodModal(record)}
                              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                                mood
                                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                              }`}
                            >
                              {mood ? (
                                <>
                                  <Heart className="w-4 h-4 fill-current" />
                                  已写
                                </>
                              ) : (
                                <>
                                  <Pencil className="w-4 h-4" />
                                  写心情
                                </>
                              )}
                            </button>
                          </div>
                          {mood && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-accent)' }}>
                              <div className="flex items-start gap-2">
                                <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
                                  {mood.content}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MoodModal
        isOpen={modalOpen}
        initialContent={currentMood?.content}
        moodId={currentMood?.id}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveMood}
        onDelete={handleDeleteMood}
      />
    </div>
  );
}
