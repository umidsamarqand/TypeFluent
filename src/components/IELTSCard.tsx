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
      className="w-full mb-6 p-4 rounded-xl border transition-all text-xs shadow-xs"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs"
            style={{ backgroundColor: currentTheme.primary, color: '#ffffff' }}
          >
            {article.category === 'ielts-task1' ? 'T1' : 'T2'}
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2" style={{ color: currentTheme.textMain }}>
              <span>{article.ieltsType || 'IELTS Academic Writing'}</span>
              <span className="text-xs font-normal opacity-70">
                (Cambridge Band 8–9 Model)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: currentTheme.textMuted }}>
              <span className="flex items-center gap-1 font-medium" style={{ color: currentTheme.primary }}>
                <Target className="w-3 h-3" />
                Target: {targetWords}+ words
              </span>
              <span aria-hidden="true">·</span>
              <span>Standard Exam Duration: {examDuration}</span>
              <span aria-hidden="true">·</span>
              <span>Recommended Velocity: 45+ WPM</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="px-2.5 py-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors"
          style={{ 
            borderColor: currentTheme.border,
            backgroundColor: currentTheme.bg,
            color: currentTheme.textMuted 
          }}
          title={collapsed ? 'Expand Prompt' : 'Collapse Prompt'}
        >
          <span>{collapsed ? 'View Prompt' : 'Hide Prompt'}</span>
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-3.5 pt-3.5 border-t space-y-3" style={{ borderColor: currentTheme.border }}>
          {/* Official Prompt Box */}
          <div 
            className="p-3.5 rounded-lg border text-[13px] leading-relaxed"
            style={{ 
              backgroundColor: currentTheme.bg, 
              borderColor: currentTheme.border,
              color: currentTheme.textMain 
            }}
          >
            <span className="font-semibold text-xs block mb-1 uppercase tracking-wider" style={{ color: currentTheme.primary }}>
              Official Examination Prompt:
            </span>
            <p className="italic">{article.ieltsPrompt}</p>
          </div>

          {/* Academic Vocabulary Focus Words */}
          {article.academicVocabulary && article.academicVocabulary.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
              <span className="font-medium flex items-center gap-1 shrink-0" style={{ color: currentTheme.textMuted }}>
                <BookOpen className="w-3 h-3 text-blue-500" />
                Key Academic Collocations:
              </span>
              {article.academicVocabulary.map((word) => (
                <span
                  key={word}
                  className="font-mono-custom px-2 py-0.5 rounded-md border text-[11px]"
                  style={{
                    backgroundColor: currentTheme.bg,
                    borderColor: currentTheme.border,
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
                Examiner Band 9 Highlights:
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
