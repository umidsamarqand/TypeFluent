import React, { useState, useEffect, useCallback } from 'react';
import { 
  Theme, 
  TestConfig, 
  Article, 
  ArticleCategory, 
  TestStats, 
  StoredResult 
} from './types';
import { THEMES, getTheme } from './utils/themes';
import { ARTICLES_DATABASE, getRandomArticle, getArticlesByCategory } from './data/articles';
import { Header } from './components/Header';
import { TestConfigBar } from './components/TestConfigBar';
import { IELTSCard } from './components/IELTSCard';
import { TypingArea } from './components/TypingArea';
import { ResultScreen } from './components/ResultScreen';
import { CustomTextModal } from './components/CustomTextModal';
import { HistoryModal } from './components/HistoryModal';

const STORAGE_THEME_KEY = 'articletype_theme_id';
const STORAGE_CONFIG_KEY = 'articletype_config';
const STORAGE_HISTORY_KEY = 'articletype_history';

export default function App() {
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return saved ? getTheme(saved) : THEMES[0];
  });

  // Test configuration
  const [config, setConfig] = useState<TestConfig>(() => {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      mode: 'time',
      timeLimit: 60,
      wordLimit: 50,
      category: 'all',
      soundType: 'clicky',
      soundVolume: 0.5,
      blindMode: false,
      quickRestart: true,
      showLiveWpm: true,
      showLiveTimer: true,
      smoothCaret: true,
    };
  });

  // Active article state
  const [activeArticle, setActiveArticle] = useState<Article>(() => {
    return getRandomArticle('all');
  });

  // Test lifecycle state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastStats, setLastStats] = useState<TestStats | null>(null);

  // Modals state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // History state
  const [history, setHistory] = useState<StoredResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save theme
  const handleSelectTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme.id);
  };

  // Update config
  const handleUpdateConfig = (partial: Partial<TestConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(next));
      return next;
    });
    setIsCompleted(false);
  };

  // Select category
  const handleSelectCategory = (cat: ArticleCategory) => {
    handleUpdateConfig({ category: cat });
    const newArt = getRandomArticle(cat, activeArticle.id);
    setActiveArticle(newArt);
    setIsCompleted(false);
  };

  // Pick Next Article
  const handleNextArticle = useCallback(() => {
    const pool = getArticlesByCategory(config.category);
    if (pool.length <= 1) {
      setActiveArticle(getRandomArticle('all', activeArticle.id));
    } else {
      setActiveArticle(getRandomArticle(config.category, activeArticle.id));
    }
    setIsCompleted(false);
  }, [config.category, activeArticle.id]);

  // Handle finished test
  const handleFinishTest = (stats: TestStats) => {
    setLastStats(stats);
    setIsCompleted(true);

    const isIelts = activeArticle.category === 'ielts-task1' || activeArticle.category === 'ielts-task2';
    let bandEstimate: number | undefined;
    if (isIelts) {
      if (stats.accuracy >= 98 && stats.wpm >= 65) bandEstimate = 9.0;
      else if (stats.accuracy >= 96 && stats.wpm >= 55) bandEstimate = 8.5;
      else if (stats.accuracy >= 94 && stats.wpm >= 45) bandEstimate = 8.0;
      else if (stats.accuracy >= 90 && stats.wpm >= 38) bandEstimate = 7.5;
      else if (stats.accuracy >= 85 && stats.wpm >= 30) bandEstimate = 7.0;
      else bandEstimate = 6.5;
    }

    const newResult: StoredResult = {
      id: `test-${Date.now()}`,
      timestamp: Date.now(),
      wpm: stats.wpm,
      rawWpm: stats.rawWpm,
      accuracy: stats.accuracy,
      consistency: stats.consistency,
      timeElapsed: stats.timeElapsed,
      mode: config.mode,
      modeValue: config.mode === 'time' ? config.timeLimit : config.wordLimit,
      category: activeArticle.category,
      articleTitle: activeArticle.title,
      isIelts,
      ieltsBandEstimate: bandEstimate,
    };

    setHistory((prev) => {
      const next = [newResult, ...prev.slice(0, 49)];
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Restart current article test
  const handleRestart = () => {
    setIsCompleted(false);
  };

  // Clear past history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_HISTORY_KEY);
  };

  // Apply custom article
  const handleApplyCustomArticle = (article: Article) => {
    setActiveArticle(article);
    handleUpdateConfig({ category: article.category });
    setIsCompleted(false);
  };

  // Set document body background to current theme
  useEffect(() => {
    document.body.style.backgroundColor = currentTheme.bg;
    document.body.style.color = currentTheme.textMain;
  }, [currentTheme]);

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors selection:bg-amber-400/20"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.textMain }}
    >
      {/* 3-Zone Clean Header */}
      <Header
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        soundType={config.soundType}
        onChangeSound={(soundType) => handleUpdateConfig({ soundType })}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenCustomText={() => setIsCustomModalOpen(true)}
        activeCategory={config.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
        {!isCompleted ? (
          <div className="w-full flex flex-col">
            {/* Test Config Toolbar */}
            <TestConfigBar
              currentTheme={currentTheme}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              activeArticle={activeArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* IELTS Prompt Card if in IELTS Mode */}
            <IELTSCard
              currentTheme={currentTheme}
              article={activeArticle}
            />

            {/* Typing Canvas */}
            <TypingArea
              key={`${activeArticle.id}-${config.mode}-${config.timeLimit}-${config.wordLimit}`}
              currentTheme={currentTheme}
              config={config}
              article={activeArticle}
              onFinishTest={handleFinishTest}
              onNextArticle={handleNextArticle}
            />
          </div>
        ) : (
          <ResultScreen
            currentTheme={currentTheme}
            config={config}
            article={activeArticle}
            stats={lastStats!}
            onRestart={handleRestart}
            onNextArticle={handleNextArticle}
          />
        )}
      </main>

      {/* Footer: Quiet copyright and shortcuts */}
      <footer 
        className="py-4 px-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono-custom transition-colors"
        style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}
      >
        <div className="flex items-center gap-4">
          <span>tab to restart</span>
          <span aria-hidden="true">·</span>
          <span>esc to reset</span>
          <span aria-hidden="true">·</span>
          <span>space to advance word</span>
        </div>

        <div className="flex items-center gap-4">
          <span>ArticleType · Real Articles & IELTS Simulation</span>
        </div>
      </footer>

      {/* Modals */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        currentTheme={currentTheme}
        onApplyArticle={handleApplyCustomArticle}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentTheme={currentTheme}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
