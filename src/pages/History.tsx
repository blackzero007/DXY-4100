import { useMemo, useState } from 'react';
import { useTarotStore } from '@/store/useTarotStore';
import { tarotCards } from '@/data/tarotCards';
import { formatDate } from '@/utils/date';
import { History, BarChart3, Trophy, Calendar, Heart, Pencil } from 'lucide-react';
import MoodModal from '@/components/MoodModal';
import { playSound } from '@/utils/soundManager';
import type { TarotCard, DrawRecord, MoodEntry } from '@/types';

export default function HistoryPage() {
  const { drawHistory, addMoodEntry, updateMoodEntry, deleteMoodEntry, getMoodByRecordId } = useTarotStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DrawRecord | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(undefined);

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

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof drawHistory>();
    drawHistory.forEach((record) => {
      const dateRecords = groups.get(record.date) || [];
      dateRecords.push(record);
      groups.set(record.date, dateRecords);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [drawHistory]);

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
          <h1 className="text-3xl font-serif text-amber-100 mb-2">历史记录</h1>
          <p className="text-gray-400 text-sm">查看你的抽牌历史和运势回顾</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">总抽牌数</span>
            </div>
            <p className="text-2xl font-bold text-amber-100">{stats.totalDraws}</p>
          </div>

          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">活跃天数</span>
            </div>
            <p className="text-2xl font-bold text-amber-100">{stats.uniqueDays}</p>
          </div>

          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20 col-span-2 sm:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">最常出现的牌</span>
            </div>
            {stats.mostFrequentCard ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stats.mostFrequentCard.symbol}</span>
                <div>
                  <p className="text-amber-100 font-medium">
                    {stats.mostFrequentCard.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    出现 {stats.mostFrequentCount} 次
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">暂无数据</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-serif text-amber-100">抽牌记录</h2>
          </div>

          {groupedByDate.length === 0 ? (
            <div className="text-center py-16 bg-purple-900/20 rounded-2xl border border-amber-500/10">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">暂无抽牌记录</p>
              <p className="text-gray-600 text-sm mt-1">去首页抽取你的第一张牌吧</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedByDate.map(([date, records]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <h3 className="text-amber-200 font-medium">
                      {formatDate(date)}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      ({records.length} 张牌)
                    </span>
                  </div>

                  <div className="ml-4 pl-4 border-l-2 border-amber-500/20 space-y-3">
                    {records.map((record) => {
                      const card = getCardById(record.cardId);
                      if (!card) return null;
                      const mood = getMoodByRecordId(record.id);
                      return (
                        <div
                          key={record.id}
                          className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-amber-500/10 hover:border-amber-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-14 h-20 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                            >
                              {card.symbol}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-amber-100 font-medium">
                                {card.name}
                              </h4>
                              <p className="text-gray-500 text-xs">
                                {card.nameEn}
                              </p>
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                {card.meaning}
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
                            <div className="mt-3 pt-3 border-t border-amber-500/10">
                              <div className="flex items-start gap-2">
                                <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
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
