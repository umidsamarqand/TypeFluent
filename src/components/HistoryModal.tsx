import React from 'react';
import { Theme, StoredResult } from '../types';
import { X, Trash2, Award, Zap, CheckCircle2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  history: StoredResult[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const bestWpm = history.length > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-xl border p-6 shadow-2xl relative flex flex-col gap-5 font-mono-custom text-xs max-h-[85vh] overflow-hidden"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
          color: currentTheme.textMain,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Typing History & Achievements</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: currentTheme.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-level KPI Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.bg }}>
            <div className="text-[11px] flex items-center gap-1" style={{ color: currentTheme.textMuted }}>
              <Zap className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span>Personal Best</span>
            </div>
            <div className="text-2xl font-bold mt-1 tabular-nums" style={{ color: currentTheme.primary }}>
              {bestWpm} <span className="text-xs font-normal opacity-70">WPM</span>
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.bg }}>
            <div className="text-[11px] flex items-center gap-1" style={{ color: currentTheme.textMuted }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Avg Accuracy</span>
            </div>
            <div className="text-2xl font-bold mt-1 tabular-nums" style={{ color: currentTheme.textMain }}>
              {avgAccuracy}%
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.bg }}>
            <div className="text-[11px]" style={{ color: currentTheme.textMuted }}>
              Tests Completed
            </div>
            <div className="text-2xl font-bold mt-1 tabular-nums" style={{ color: currentTheme.textMain }}>
              {history.length}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="flex-1 overflow-y-auto no-scrollbar border rounded-lg" style={{ borderColor: currentTheme.border }}>
          {history.length === 0 ? (
            <div className="p-8 text-center" style={{ color: currentTheme.textMuted }}>
              No tests completed yet. Start typing to record your performance history!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead 
                className="sticky top-0 border-b uppercase text-[10px] tracking-wider font-semibold"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textMuted }}
              >
                <tr>
                  <th className="py-2.5 px-3">Article</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">WPM</th>
                  <th className="py-2.5 px-3 text-right">Acc</th>
                  <th className="py-2.5 px-3 text-right">IELTS Band</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-medium truncate max-w-[200px]" style={{ color: currentTheme.textMain }}>
                      {item.articleTitle}
                    </td>
                    <td className="py-2 px-3 opacity-70">
                      {item.mode} · {item.category}
                    </td>
                    <td className="py-2 px-3 text-right font-bold tabular-nums" style={{ color: currentTheme.primary }}>
                      {item.wpm}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {item.accuracy}%
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {item.ieltsBandEstimate ? (
                        <span className="font-semibold" style={{ color: currentTheme.primary }}>
                          Band {item.ieltsBandEstimate.toFixed(1)}
                        </span>
                      ) : (
                        <span className="opacity-40">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: currentTheme.border }}>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 opacity-60 hover:opacity-100 hover:text-red-400 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded font-medium"
              style={{ backgroundColor: currentTheme.bg, color: currentTheme.textMain }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
