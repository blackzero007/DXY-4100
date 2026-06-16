export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  symbol: string;
  color: string;
  meaning: string;
  loveFortune: string;
  careerFortune: string;
  wealthFortune: string;
  healthFortune: string;
  reversedMeaning: string;
  reversedLoveFortune: string;
  reversedCareerFortune: string;
  reversedWealthFortune: string;
  reversedHealthFortune: string;
  luckyColor: string;
  luckyNumber: string;
  luckyItem: string;
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean;
}

export interface DrawRecord {
  id: string;
  cardId: number;
  date: string;
  timestamp: number;
  isReversed: boolean;
}

export interface MoodEntry {
  id: string;
  recordId: string;
  content: string;
  date: string;
  timestamp: number;
}

export interface TarotState {
  todayDrawCount: number;
  lastDrawDate: string;
  drawHistory: DrawRecord[];
  currentCard: DrawnCard | null;
  isFlipping: boolean;
  moodEntries: MoodEntry[];
  drawCard: () => void;
  resetToday: () => void;
  getRemainingDraws: () => number;
  canDrawToday: () => boolean;
  addMoodEntry: (recordId: string, content: string) => void;
  updateMoodEntry: (moodId: string, content: string) => void;
  deleteMoodEntry: (moodId: string) => void;
  getMoodByRecordId: (recordId: string) => MoodEntry | undefined;
  exportBackup: () => void;
  importBackup: (file: File, mode?: 'merge' | 'replace') => Promise<ImportResult>;
  previewBackup: (file: File) => Promise<{ info: string; data: BackupData }>;
}

export interface BackupData {
  version: string;
  exportedAt: number;
  drawHistory: DrawRecord[];
  moodEntries: MoodEntry[];
  metadata: {
    totalDraws: number;
    totalMoods: number;
    dateRange: {
      start: string;
      end: string;
    } | null;
  };
}

export interface ImportResult {
  drawHistory: DrawRecord[];
  moodEntries: MoodEntry[];
  stats: {
    importedDraws: number;
    importedMoods: number;
    skippedDraws: number;
    skippedMoods: number;
  };
}
