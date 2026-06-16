import type { DrawRecord, MoodEntry, BackupData, ImportResult } from '@/types';

const BACKUP_VERSION = '1.0.0';

export const exportData = (drawHistory: DrawRecord[], moodEntries: MoodEntry[]): BackupData => {
  const dates = drawHistory.map(r => r.date).sort();
  const dateRange = dates.length > 0
    ? { start: dates[0], end: dates[dates.length - 1] }
    : null;

  return {
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    drawHistory: [...drawHistory],
    moodEntries: [...moodEntries],
    metadata: {
      totalDraws: drawHistory.length,
      totalMoods: moodEntries.length,
      dateRange,
    },
  };
};

export const downloadBackup = (data: BackupData): void => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const fileName = `tarot_backup_${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateBackupData = (data: unknown): data is BackupData => {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'string') return false;
  if (typeof obj.exportedAt !== 'number') return false;
  if (!Array.isArray(obj.drawHistory)) return false;
  if (!Array.isArray(obj.moodEntries)) return false;

  const isValidDrawRecord = (record: unknown): boolean => {
    if (typeof record !== 'object' || record === null) return false;
    const r = record as Record<string, unknown>;
    return (
      typeof r.id === 'string' &&
      typeof r.cardId === 'number' &&
      typeof r.date === 'string' &&
      typeof r.timestamp === 'number'
    );
  };

  const isValidMoodEntry = (entry: unknown): boolean => {
    if (typeof entry !== 'object' || entry === null) return false;
    const e = entry as Record<string, unknown>;
    return (
      typeof e.id === 'string' &&
      typeof e.recordId === 'string' &&
      typeof e.content === 'string' &&
      typeof e.date === 'string' &&
      typeof e.timestamp === 'number'
    );
  };

  if (!obj.drawHistory.every(isValidDrawRecord)) return false;
  if (!obj.moodEntries.every(isValidMoodEntry)) return false;

  return true;
};

export const readBackupFile = (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!validateBackupData(data)) {
          reject(new Error('备份文件格式无效'));
          return;
        }

        resolve(data);
      } catch {
      reject(new Error('备份文件解析失败'));
    }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

export const mergeBackupData = (
  existingHistory: DrawRecord[],
  existingMoods: MoodEntry[],
  backupData: BackupData,
  mode: 'merge' | 'replace' = 'merge'
): ImportResult => {
  if (mode === 'replace') {
    return {
      drawHistory: [...backupData.drawHistory],
      moodEntries: [...backupData.moodEntries],
      stats: {
        importedDraws: backupData.drawHistory.length,
        importedMoods: backupData.moodEntries.length,
        skippedDraws: existingHistory.length,
        skippedMoods: existingMoods.length,
      },
    };
  }

  const existingDrawIds = new Set(existingHistory.map(r => r.id));
  const existingMoodIds = new Set(existingMoods.map(m => m.id));

  const newDraws = backupData.drawHistory.filter(r => !existingDrawIds.has(r.id));
  const newMoods = backupData.moodEntries.filter(m => !existingMoodIds.has(m.id));

  const mergedHistory = [...existingHistory, ...newDraws].sort((a, b) => b.timestamp - a.timestamp);
  const mergedMoods = [...existingMoods, ...newMoods].sort((a, b) => b.timestamp - a.timestamp);

  return {
    drawHistory: mergedHistory,
    moodEntries: mergedMoods,
    stats: {
      importedDraws: newDraws.length,
      importedMoods: newMoods.length,
      skippedDraws: backupData.drawHistory.length - newDraws.length,
      skippedMoods: backupData.moodEntries.length - newMoods.length,
    },
  };
};

export const formatBackupInfo = (data: BackupData): string => {
  const exportDate = new Date(data.exportedAt).toLocaleString('zh-CN');
  const { totalDraws, totalMoods, dateRange } = data.metadata;

  let info = `导出时间: ${exportDate}\n`;
  info += `抽牌记录: ${totalDraws} 条\n`;
  info += `心情记录: ${totalMoods} 条`;

  if (dateRange) {
    info += `\n日期范围: ${dateRange.start} 至 ${dateRange.end}`;
  }

  return info;
};
