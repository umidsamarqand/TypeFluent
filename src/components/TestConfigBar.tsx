import React from 'react';
import { Theme, TestConfig, ArticleCategory, Article } from '../types';
import { Clock, Hash, AlignLeft, EyeOff } from 'lucide-react';

interface TestConfigBarProps {
  currentTheme: Theme;
  config: TestConfig;
  onUpdateConfig: (partial: Partial<TestConfig>) => void;
  activeArticle: Article;
  onSelectCategory: (cat: ArticleCategory) => void;
}

export const TestConfigBar: React.FC<TestConfigBarProps> = ({
  currentTheme,
  config,
  onUpdateConfig,
  activeArticle,
  onSelectCategory,
}) => {
  const isIelts = config.category === 'ielts-task1' || config.category === 'ielts-task2';

  return (
    <div className="w-full flex flex-col items-center gap-3.5 mb-6">
      {/* Category & Mode Segmented Navigation */}
      <div 
        className="w-full flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl border shadow-xs"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
        }}
      >
        {/* Categories Group */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'All Articles' },
            { id: 'science', label: 'Science' },
            { id: 'tech', label: 'Tech & AI' },
            { id: 'nature', label: 'Nature' },
            { id: 'ielts-task1', label: 'IELTS Task 1 (Data)' },
            { id: 'ielts-task2', label: 'IELTS Task 2 (Essays)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ArticleCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                config.category === cat.id
                  ? 'shadow-xs font-semibold'
                  : 'hover:bg-slate-50'
              }`}
              style={{
                backgroundColor: config.category === cat.id ? currentTheme.primary : 'transparent',
                color: config.category === cat.id ? '#ffffff' : currentTheme.textMuted,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Test Mode & Duration Group */}
        <div className="flex items-center gap-2">
          {/* Mode Toggles */}
          <div 
            className="flex items-center gap-0.5 p-1 rounded-lg border text-xs"
            style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
          >
            <button
              onClick={() => onUpdateConfig({ mode: 'time' })}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors"
              style={{
                backgroundColor: config.mode === 'time' ? currentTheme.surface : 'transparent',
                color: config.mode === 'time' ? currentTheme.primary : currentTheme.textMuted,
                boxShadow: config.mode === 'time' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <Clock className="w-3 h-3" />
              <span>Time</span>
            </button>

            <button
              onClick={() => onUpdateConfig({ mode: 'words' })}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors"
              style={{
                backgroundColor: config.mode === 'words' ? currentTheme.surface : 'transparent',
                color: config.mode === 'words' ? currentTheme.primary : currentTheme.textMuted,
                boxShadow: config.mode === 'words' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <Hash className="w-3 h-3" />
              <span>Words</span>
            </button>

            <button
              onClick={() => onUpdateConfig({ mode: 'full' })}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors"
              style={{
                backgroundColor: config.mode === 'full' ? currentTheme.surface : 'transparent',
                color: config.mode === 'full' ? currentTheme.primary : currentTheme.textMuted,
                boxShadow: config.mode === 'full' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <AlignLeft className="w-3 h-3" />
              <span>Full Text</span>
            </button>
          </div>

          {/* Sub-value Options */}
          <div className="flex items-center gap-1">
            {config.mode === 'time' && (
              <div 
                className="flex items-center gap-0.5 p-1 rounded-lg border text-xs font-mono-custom"
                style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
              >
                {[15, 30, 60, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onUpdateConfig({ timeLimit: sec })}
                    className="px-2 py-1 rounded-md transition-colors"
                    style={{
                      backgroundColor: config.timeLimit === sec ? currentTheme.primary : 'transparent',
                      color: config.timeLimit === sec ? '#ffffff' : currentTheme.textMuted,
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            )}

            {config.mode === 'words' && (
              <div 
                className="flex items-center gap-0.5 p-1 rounded-lg border text-xs font-mono-custom"
                style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
              >
                {[25, 50, 100, 250].map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdateConfig({ wordLimit: w })}
                    className="px-2 py-1 rounded-md transition-colors"
                    style={{
                      backgroundColor: config.wordLimit === w ? currentTheme.primary : 'transparent',
                      color: config.wordLimit === w ? '#ffffff' : currentTheme.textMuted,
                    }}
                  >
                    {w} {w === 250 && isIelts && '★'}
                  </button>
                ))}
              </div>
            )}

            {/* Blind mode switch */}
            <button
              onClick={() => onUpdateConfig({ blindMode: !config.blindMode })}
              title="Blind Mode: Hides error indicators while typing"
              className={`p-2 rounded-lg border transition-colors ${
                config.blindMode ? 'bg-blue-50 border-blue-200' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                borderColor: currentTheme.border,
                backgroundColor: config.blindMode ? `${currentTheme.primary}15` : currentTheme.bg,
                color: config.blindMode ? currentTheme.primary : currentTheme.textMuted,
              }}
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Unboxed Metadata Strip (Zero-Pill Rule) */}
      <div 
        className="w-full flex items-center justify-between text-xs px-1"
        style={{ color: currentTheme.textMuted }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: currentTheme.textMain }}>
            {activeArticle.title}
          </span>
          <span aria-hidden="true">·</span>
          <span>{activeArticle.source}</span>
          {activeArticle.author && (
            <>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.author}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono-custom">
          <span>{activeArticle.wordCount} words in article</span>
          {isIelts && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold" style={{ color: currentTheme.primary }}>
                {config.category === 'ielts-task1' ? 'Task 1 Target: 150w' : 'Task 2 Target: 250w'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
