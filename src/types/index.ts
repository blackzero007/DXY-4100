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
}

export interface DrawRecord {
  id: string;
  cardId: number;
  date: string;
  timestamp: number;
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
  currentCard: TarotCard | null;
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
}
