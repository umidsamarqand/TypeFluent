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
    <div className="w-full flex flex-col items-center gap-3 pt-6 pb-4">
      {/* Monkeytype style floating segmented config pill */}
      <div 
        className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-custom shadow-sm transition-colors border"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
          color: currentTheme.textMuted,
        }}
      >
        {/* Categories / Topic Group */}
        <div className="flex items-center gap-1 pr-2 border-r" style={{ borderColor: currentTheme.border }}>
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-2 py-1 rounded transition-colors ${
              config.category === 'all' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.category === 'all' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.category === 'all' ? currentTheme.bg : 'transparent',
            }}
          >
            all articles
          </button>
          <button
            onClick={() => onSelectCategory('science')}
            className={`px-2 py-1 rounded transition-colors ${
              config.category === 'science' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.category === 'science' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.category === 'science' ? currentTheme.bg : 'transparent',
            }}
          >
            science
          </button>
          <button
            onClick={() => onSelectCategory('tech')}
            className={`px-2 py-1 rounded transition-colors ${
              config.category === 'tech' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.category === 'tech' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.category === 'tech' ? currentTheme.bg : 'transparent',
            }}
          >
            tech
          </button>
          <button
            onClick={() => onSelectCategory('nature')}
            className={`px-2 py-1 rounded transition-colors ${
              config.category === 'nature' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.category === 'nature' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.category === 'nature' ? currentTheme.bg : 'transparent',
            }}
          >
            nature
          </button>
          <button
            onClick={() => onSelectCategory('ielts-task1')}
            className={`px-2 py-1 rounded transition-colors ${
              config.category === 'ielts-task1' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.category === 'ielts-task1' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.category === 'ielts-task1' ? currentTheme.bg : 'transparent',
            }}
          >
            ielts task 1
          </button>
          <button
            onClick={() => onSelectCategory('ielts-task2')}
            className={`px-2 py-1 rounded transition-colors ${
              config.category === 'ielts-task2' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.category === 'ielts-task2' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.category === 'ielts-task2' ? currentTheme.bg : 'transparent',
            }}
          >
            ielts task 2
          </button>
        </div>

        {/* Mode Selector: Time / Words / Full */}
        <div className="flex items-center gap-1 pr-2 border-r" style={{ borderColor: currentTheme.border }}>
          <button
            onClick={() => onUpdateConfig({ mode: 'time' })}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              config.mode === 'time' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.mode === 'time' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.mode === 'time' ? currentTheme.bg : 'transparent',
            }}
          >
            <Clock className="w-3 h-3" />
            <span>time</span>
          </button>

          <button
            onClick={() => onUpdateConfig({ mode: 'words' })}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              config.mode === 'words' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.mode === 'words' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.mode === 'words' ? currentTheme.bg : 'transparent',
            }}
          >
            <Hash className="w-3 h-3" />
            <span>words</span>
          </button>

          <button
            onClick={() => onUpdateConfig({ mode: 'full' })}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              config.mode === 'full' ? 'font-semibold' : 'hover:opacity-100 opacity-75'
            }`}
            style={{
              color: config.mode === 'full' ? currentTheme.primary : currentTheme.textMuted,
              backgroundColor: config.mode === 'full' ? currentTheme.bg : 'transparent',
            }}
          >
            <AlignLeft className="w-3 h-3" />
            <span>full article</span>
          </button>
        </div>

        {/* Value Sub-picker depending on Mode */}
        <div className="flex items-center gap-1">
          {config.mode === 'time' && (
            <>
              {[15, 30, 60, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onUpdateConfig({ timeLimit: sec })}
                  className={`px-2 py-1 rounded transition-colors ${
                    config.timeLimit === sec ? 'font-bold' : 'hover:opacity-100 opacity-75'
                  }`}
                  style={{
                    color: config.timeLimit === sec ? currentTheme.primary : currentTheme.textMuted,
                    backgroundColor: config.timeLimit === sec ? currentTheme.bg : 'transparent',
                  }}
                >
                  {sec}
                </button>
              ))}
            </>
          )}

          {config.mode === 'words' && (
            <>
              {[25, 50, 100, 250].map((w) => (
                <button
                  key={w}
                  onClick={() => onUpdateConfig({ wordLimit: w })}
                  className={`px-2 py-1 rounded transition-colors ${
                    config.wordLimit === w ? 'font-bold' : 'hover:opacity-100 opacity-75'
                  }`}
                  style={{
                    color: config.wordLimit === w ? currentTheme.primary : currentTheme.textMuted,
                    backgroundColor: config.wordLimit === w ? currentTheme.bg : 'transparent',
                  }}
                >
                  {w} {w === 250 && isIelts && '★'}
                </button>
              ))}
            </>
          )}

          {config.mode === 'full' && (
            <span className="px-2 py-1 opacity-70 text-[11px]">
              {activeArticle.wordCount} words
            </span>
          )}

          {/* Blind mode toggle */}
          <button
            onClick={() => onUpdateConfig({ blindMode: !config.blindMode })}
            title="Blind Mode: Hides mistakes while typing"
            className={`p-1 rounded ml-1 transition-opacity ${config.blindMode ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
            style={{ color: config.blindMode ? currentTheme.primary : currentTheme.textMuted }}
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Clean Unboxed Metadata: Source / Title / IELTS Indicator (Zero-Pill Rule) */}
      <div 
        className="flex items-center justify-center flex-wrap gap-2 text-xs font-mono-custom tracking-wide transition-opacity opacity-75 hover:opacity-100"
        style={{ color: currentTheme.textMuted }}
      >
        <span className="font-semibold" style={{ color: currentTheme.textMain }}>
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
        <span aria-hidden="true">·</span>
        <span>{activeArticle.wordCount} words total</span>
        {isIelts && (
          <>
            <span aria-hidden="true">·</span>
            <span style={{ color: currentTheme.primary }}>
              {config.category === 'ielts-task1' ? 'Task 1 (Target: 150w)' : 'Task 2 (Target: 250w)'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
