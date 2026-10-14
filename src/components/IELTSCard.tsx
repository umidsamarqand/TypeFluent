import React, { useState } from 'react';
import { Theme, Article } from '../types';
import { ChevronDown, ChevronUp, Award, Target, BookOpen } from 'lucide-react';

interface IELTSCardProps {
  currentTheme: Theme;
  article: Article;
}

export const IELTSCard: React.FC<IELTSCardProps> = ({ currentTheme, article }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!article.ieltsPrompt) return null;

  const targetWords = article.category === 'ielts-task1' ? 150 : 250;
  const examDuration = article.category === 'ielts-task1' ? '20 mins' : '40 mins';

  return (
    <div
      className="w-full max-w-4xl mx-auto mb-6 p-4 rounded-xl border transition-all text-xs"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: currentTheme.bg, color: currentTheme.primary }}
          >
            {article.category === 'ielts-task1' ? 'T1' : 'T2'}
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2" style={{ color: currentTheme.textMain }}>
              <span>{article.ieltsType || 'IELTS Academic Writing'}</span>
              <span className="font-mono-custom text-xs font-normal" style={{ color: currentTheme.textMuted }}>
                (Official Band 8–9 Model)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono-custom mt-0.5" style={{ color: currentTheme.textMuted }}>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-400" />
                Target: {targetWords}+ words
              </span>
              <span aria-hidden="true">·</span>
              <span>Standard Time: {examDuration}</span>
              <span aria-hidden="true">·</span>
              <span>Recommended Typing Velocity: 45+ WPM</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: currentTheme.textMuted }}
          title={collapsed ? 'Expand Prompt' : 'Collapse Prompt'}
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: currentTheme.border }}>
          {/* Official Prompt Box */}
          <div 
            className="p-3 rounded-lg font-serif italic text-[13px] leading-relaxed"
            style={{ 
              backgroundColor: currentTheme.bg, 
              color: currentTheme.textMain 
            }}
          >
            "{article.ieltsPrompt}"
          </div>

          {/* Academic Vocabulary Focus Words */}
          {article.academicVocabulary && article.academicVocabulary.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
              <span className="font-medium flex items-center gap-1 shrink-0" style={{ color: currentTheme.textMuted }}>
                <BookOpen className="w-3 h-3" />
                Key Academic Collocations:
              </span>
              {article.academicVocabulary.map((word) => (
                <span
                  key={word}
                  className="font-mono-custom px-1.5 py-0.5 rounded text-[11px]"
                  style={{
                    backgroundColor: currentTheme.bg,
                    color: currentTheme.primary,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          )}

          {/* Key Examiner Observations */}
          {article.keyPoints && article.keyPoints.length > 0 && (
            <div className="text-[11px] space-y-1 font-mono-custom" style={{ color: currentTheme.textMuted }}>
              <div className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1" style={{ color: currentTheme.primary }}>
                <Award className="w-3 h-3" />
                Band 9 Lexical & Structural Highlights:
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                {article.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
