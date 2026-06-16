import { useMemo, useState, useEffect } from 'react';
import { useTarotStore } from '@/store/useTarotStore';
import { tarotCards } from '@/data/tarotCards';
import { formatDate, getTodayString } from '@/utils/date';
import { History, BarChart3, Trophy, Calendar, Heart, Pencil, Database, Sparkles, X } from 'lucide-react';
import MoodModal from '@/components/MoodModal';
import DataBackupButtons from '@/components/DataBackupButtons';
import { playSound } from '@/utils/soundManager';
import type { TarotCard, DrawRecord, MoodEntry } from '@/types';

export default function HistoryPage() {
  const { drawHistory, addMoodEntry, updateMoodEntry, deleteMoodEntry, getMoodByRecordId, toggleFavorite, deleteDrawRecord } = useTarotStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DrawRecord | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(undefined);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

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

    const today = getTodayString();
    const todayRecords = drawHistory.filter((r) => r.date === today);

    let todayFortune: 'good' | 'stable' | 'caution' | null = null;
    if (todayRecords.length > 0) {
      const goodKeywords = ['顺利', '成功', '希望', '收获', '好运', '美好', '积极', '进步', '成长', '胜利'];
      const cautionKeywords = ['困难', '挑战', '恐惧', '阻碍', '失败', '风险', '谨慎', '危险', '损失', '欺骗'];
      const stableKeywords = ['平衡', '等待', '思考', '稳定', '平静', '内省', '规划', '沉稳', '保持', '积累'];

      let goodScore = 0;
      let cautionScore = 0;
      let stableScore = 0;

      todayRecords.forEach((record) => {
        const card = tarotCards.find((c) => c.id === record.cardId);
        if (!card) return;
        const meaning = record.isReversed ? card.reversedMeaning : card.meaning;
        const allFortune = [
          meaning,
          record.isReversed ? card.reversedLoveFortune : card.loveFortune,
          record.isReversed ? card.reversedCareerFortune : card.careerFortune,
          record.isReversed ? card.reversedWealthFortune : card.wealthFortune,
          record.isReversed ? card.reversedHealthFortune : card.healthFortune,
        ].join('');

        goodKeywords.forEach((kw) => {
          if (allFortune.includes(kw)) goodScore++;
        });
        cautionKeywords.forEach((kw) => {
          if (allFortune.includes(kw)) cautionScore++;
        });
        stableKeywords.forEach((kw) => {
          if (allFortune.includes(kw)) stableScore++;
        });
      });

      if (goodScore >= cautionScore && goodScore >= stableScore) {
        todayFortune = 'good';
      } else if (cautionScore > goodScore && cautionScore >= stableScore) {
        todayFortune = 'caution';
      } else {
        todayFortune = 'stable';
      }
    }

    return { totalDraws, mostFrequentCard, mostFrequentCount: maxCount, uniqueDays, todayFortune, todayDrawCount: todayRecords.length };
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

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCardId, showOnlyFavorites]);

  const paginatedHistory = useMemo(() => {
    return filteredHistory.slice(0, visibleCount);
  }, [filteredHistory, visibleCount]);

  const hasMore = filteredHistory.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
    playSound('buttonClick');
  };

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof drawHistory>();
    paginatedHistory.forEach((record) => {
      const dateRecords = groups.get(record.date) || [];
      dateRecords.push(record);
      groups.set(record.date, dateRecords);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [paginatedHistory]);

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

  const handleDeleteRecord = (record: DrawRecord) => {
    const confirmed = window.confirm('确定要删除这条抽牌记录吗？关联的心情记录也会被删除。');
    if (confirmed) {
      playSound('buttonClick');
      deleteDrawRecord(record.id);
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
            className="backdrop-blur-sm rounded-xl p-4"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-accent)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>今日运势</span>
            </div>
            {stats.todayFortune ? (
              <div className="flex flex-col gap-1">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium w-fit ${
                    stats.todayFortune === 'good'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : stats.todayFortune === 'caution'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {stats.todayFortune === 'good' ? '运势好' : stats.todayFortune === 'caution' ? '需注意' : '运势平稳'}
                </span>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  今日 {stats.todayDrawCount} 张牌
                </p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>暂无抽牌</p>
            )}
          </div>

          <div
            className="backdrop-blur-sm rounded-xl p-4"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-accent)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>最常出现</span>
            </div>
            {stats.mostFrequentCard ? (
              <div className="flex items-center gap-2">
                <span className="text-xl">{stats.mostFrequentCard.symbol}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {stats.mostFrequentCard.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {stats.mostFrequentCount} 次
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
                          className="backdrop-blur-sm rounded-xl p-4 transition-colors relative"
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRecord(record);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full transition-colors hover:bg-red-500/20 text-gray-400/70 hover:text-red-400"
                            title="删除记录"
                          >
                            <X className="w-4 h-4" />
                          </button>
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

              {filteredHistory.length > 0 && (
                <div className="text-center pt-4">
                  {hasMore ? (
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-accent)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-color)';
                        (e.currentTarget as HTMLElement).style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--card-bg)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                      }}
                    >
                      加载更多
                    </button>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      已加载全部记录
                    </p>
                  )}
                </div>
              )}
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
