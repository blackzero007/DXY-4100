import { create } from 'zustand';
import type { TarotState, TarotCard, DrawRecord, MoodEntry, BackupData, ImportResult } from '@/types';
import { tarotCards, DAILY_DRAW_LIMIT } from '@/data/tarotCards';
import { storage } from '@/utils/storage';
import { getTodayString, generateId } from '@/utils/date';
import { playSound } from '@/utils/soundManager';
import {
  exportData,
  downloadBackup,
  readBackupFile,
  mergeBackupData,
  formatBackupInfo,
} from '@/utils/dataBackup';

const STORAGE_KEY_HISTORY = 'draw_history';
const STORAGE_KEY_LAST_DATE = 'last_draw_date';
const STORAGE_KEY_TODAY_COUNT = 'today_draw_count';
const STORAGE_KEY_MOODS = 'mood_entries';

const getInitialState = () => {
  const lastDrawDate = storage.get<string>(STORAGE_KEY_LAST_DATE, '');
  const today = getTodayString();
  const todayDrawCount = lastDrawDate === today
    ? storage.get<number>(STORAGE_KEY_TODAY_COUNT, 0)
    : 0;
  const drawHistory = storage.get<DrawRecord[]>(STORAGE_KEY_HISTORY, []);
  const moodEntries = storage.get<MoodEntry[]>(STORAGE_KEY_MOODS, []);

  return {
    todayDrawCount,
    lastDrawDate,
    drawHistory,
    currentCard: null,
    isFlipping: false,
    moodEntries,
  };
};

export const useTarotStore = create<TarotState>((set, get) => ({
  ...getInitialState(),

  drawCard: () => {
    const state = get();
    if (!state.canDrawToday() || state.isFlipping) return;

    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const card: TarotCard = tarotCards[randomIndex];

    set({ isFlipping: true, currentCard: null });

    setTimeout(() => {
      const today = getTodayString();
      const newRecord: DrawRecord = {
        id: generateId(),
        cardId: card.id,
        date: today,
        timestamp: Date.now(),
      };

      const newHistory = [newRecord, ...get().drawHistory];
      const newCount = get().todayDrawCount + 1;

      playSound('cardReveal');

      set({
        currentCard: card,
        isFlipping: false,
        todayDrawCount: newCount,
        lastDrawDate: today,
        drawHistory: newHistory,
      });

      storage.set(STORAGE_KEY_HISTORY, newHistory);
      storage.set(STORAGE_KEY_TODAY_COUNT, newCount);
      storage.set(STORAGE_KEY_LAST_DATE, today);
    }, 1500);
  },

  resetToday: () => {
    const today = getTodayString();
    set({ todayDrawCount: 0, lastDrawDate: today, currentCard: null });
    storage.set(STORAGE_KEY_TODAY_COUNT, 0);
    storage.set(STORAGE_KEY_LAST_DATE, today);
  },

  getRemainingDraws: () => {
    const state = get();
    const today = getTodayString();
    if (state.lastDrawDate !== today) return DAILY_DRAW_LIMIT;
    return Math.max(0, DAILY_DRAW_LIMIT - state.todayDrawCount);
  },

  canDrawToday: () => {
    return get().getRemainingDraws() > 0;
  },

  addMoodEntry: (recordId: string, content: string) => {
    const today = getTodayString();
    const newMood: MoodEntry = {
      id: generateId(),
      recordId,
      content,
      date: today,
      timestamp: Date.now(),
    };

    const newMoods = [newMood, ...get().moodEntries];
    set({ moodEntries: newMoods });
    storage.set(STORAGE_KEY_MOODS, newMoods);
  },

  updateMoodEntry: (moodId: string, content: string) => {
    const newMoods = get().moodEntries.map((mood) =>
      mood.id === moodId ? { ...mood, content, timestamp: Date.now() } : mood
    );
    set({ moodEntries: newMoods });
    storage.set(STORAGE_KEY_MOODS, newMoods);
  },

  deleteMoodEntry: (moodId: string) => {
    const newMoods = get().moodEntries.filter((mood) => mood.id !== moodId);
    set({ moodEntries: newMoods });
    storage.set(STORAGE_KEY_MOODS, newMoods);
  },

  getMoodByRecordId: (recordId: string) => {
    return get().moodEntries.find((mood) => mood.recordId === recordId);
  },

  exportBackup: (): void => {
    const state = get();
    const data = exportData(state.drawHistory, state.moodEntries);
    downloadBackup(data);
    playSound('success');
  },

  previewBackup: async (file: File): Promise<{ info: string; data: BackupData }> => {
    const data = await readBackupFile(file);
    const info = formatBackupInfo(data);
    return { info, data };
  },

  importBackup: async (file: File, mode: 'merge' | 'replace' = 'merge'): Promise<ImportResult> => {
    const state = get();
    const backupData = await readBackupFile(file);

    const result = mergeBackupData(
      state.drawHistory,
      state.moodEntries,
      backupData,
      mode
    );

    const today = getTodayString();
    const todayDraws = result.drawHistory.filter((r) => r.date === today).length;
    const latestDate = result.drawHistory.length > 0
      ? result.drawHistory.reduce((latest, record) =>
          record.date > latest ? record.date : latest
        , result.drawHistory[0].date)
      : '';

    set({
      drawHistory: result.drawHistory,
      moodEntries: result.moodEntries,
      todayDrawCount: todayDraws,
      lastDrawDate: latestDate,
    });

    storage.set(STORAGE_KEY_HISTORY, result.drawHistory);
    storage.set(STORAGE_KEY_MOODS, result.moodEntries);
    storage.set(STORAGE_KEY_TODAY_COUNT, todayDraws);
    storage.set(STORAGE_KEY_LAST_DATE, latestDate);

    playSound('success');

    return result;
  },
}));
