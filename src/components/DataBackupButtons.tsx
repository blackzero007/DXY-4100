import { useState, useRef } from 'react';
import { Download, Upload, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTarotStore } from '@/store/useTarotStore';
import { playSound } from '@/utils/soundManager';
import type { BackupData, ImportResult } from '@/types';

export default function DataBackupButtons() {
  const { exportBackup, previewBackup, importBackup, drawHistory, moodEntries } = useTarotStore();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [previewInfo, setPreviewInfo] = useState<string>('');
  const [previewData, setPreviewData] = useState<BackupData | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    playSound('buttonClick');
    if (drawHistory.length === 0 && moodEntries.length === 0) {
      setResultMessage({ type: 'error', text: '暂无数据可导出' });
      setTimeout(() => setResultMessage(null), 3000);
      return;
    }
    exportBackup();
    setResultMessage({ type: 'success', text: '数据导出成功！' });
    setTimeout(() => setResultMessage(null), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('buttonClick');
    setIsProcessing(true);
    setResultMessage(null);

    try {
      const { info, data } = await previewBackup(file);
      setPreviewInfo(info);
      setPreviewData(data);
      setImportModalOpen(true);
      playSound('modalOpen');
    } catch (error) {
      setResultMessage({ type: 'error', text: error instanceof Error ? error.message : '文件读取失败' });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    playSound('buttonClick');
    setIsProcessing(true);
    setResultMessage(null);

    try {
      const result: ImportResult = await importBackup(
        new File([JSON.stringify(previewData)], 'backup.json', { type: 'application/json' }),
        importMode
      );

      const successText = importMode === 'merge'
        ? `导入成功！新增 ${result.stats.importedDraws} 条抽牌记录，${result.stats.importedMoods} 条心情记录`
        : `导入成功！已替换为 ${result.stats.importedDraws} 条抽牌记录，${result.stats.importedMoods} 条心情记录`;

      setResultMessage({ type: 'success', text: successText });
      setImportModalOpen(false);
      playSound('success');
    } catch (error) {
      setResultMessage({ type: 'error', text: error instanceof Error ? error.message : '导入失败' });
    } finally {
      setIsProcessing(false);
      setPreviewData(null);
      setPreviewInfo('');
    }
  };

  const handleCloseModal = () => {
    playSound('modalClose');
    setImportModalOpen(false);
    setPreviewData(null);
    setPreviewInfo('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          disabled={isProcessing}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          导出数据
        </button>

        <label className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div
            className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-400 hover:to-indigo-400 transition-all flex items-center justify-center gap-2 cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <Upload className="w-4 h-4" />
            导入数据
          </div>
        </label>
      </div>

      {resultMessage && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            resultMessage.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          {resultMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{resultMessage.text}</span>
        </div>
      )}

      {importModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-lg bg-gradient-to-br from-purple-900/95 to-indigo-950/95 rounded-2xl border border-amber-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 border-b border-amber-500/30">
              <div className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-serif text-amber-100">数据导入</h3>
              </div>
              <p className="text-gray-400 text-sm mt-2">请确认备份文件信息并选择导入方式</p>
            </div>

            <div className="p-6">
              <div className="bg-black/30 border border-amber-500/20 rounded-xl p-4 mb-6">
                <h4 className="text-amber-200 font-medium mb-2">备份文件信息</h4>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                  {previewInfo}
                </pre>
              </div>

              <div className="space-y-3">
                <h4 className="text-amber-200 font-medium">导入方式</h4>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-black/20 cursor-pointer hover:border-amber-500/40 transition-colors">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="mt-1 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <p className="text-amber-100 font-medium">合并导入</p>
                    <p className="text-gray-400 text-sm mt-1">
                      将备份数据与现有数据合并，已存在的记录将被跳过
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-black/20 cursor-pointer hover:border-red-500/40 transition-colors">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <div>
                    <p className="text-red-300 font-medium">替换现有数据</p>
                    <p className="text-gray-400 text-sm mt-1">
                      <span className="text-red-400">警告：</span>
                      这将删除所有现有数据并用备份数据替换，此操作不可撤销
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-gray-500/10 transition-colors flex-1"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                disabled={isProcessing}
                className={`px-5 py-2.5 rounded-xl text-white font-medium transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                  importMode === 'replace'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400'
                }`}
              >
                {isProcessing ? '处理中...' : '确认导入'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
