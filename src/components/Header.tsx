import React, { useState } from 'react';
import { Theme, SoundType, ArticleCategory } from '../types';
import { THEMES } from '../utils/themes';
import { Volume2, VolumeX, Palette, History, FileText, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  soundType: SoundType;
  onChangeSound: (sound: SoundType) => void;
  onOpenHistory: () => void;
  onOpenCustomText: () => void;
  activeCategory: ArticleCategory;
  onSelectCategory: (cat: ArticleCategory) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onSelectTheme,
  soundType,
  onChangeSound,
  onOpenHistory,
  onOpenCustomText,
  activeCategory,
  onSelectCategory,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  return (
    <header 
      className="flex items-center justify-between gap-8 px-6 py-4 border-b transition-colors relative z-30"
      style={{ 
        borderColor: currentTheme.border, 
        backgroundColor: currentTheme.surface 
      }}
    >
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="/" 
          className="text-lg font-bold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2"
          style={{ color: currentTheme.primary }}
        >
          <span className="text-xl">⌨</span>
          <span className="font-mono-custom tracking-wider">articletype</span>
        </a>
      </div>

      {/* Zone 2: 4–5 clean single-line navigation category links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeCategory === 'all' ? 'font-semibold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeCategory === 'all' ? currentTheme.primary : currentTheme.textMain,
            borderColor: activeCategory === 'all' ? currentTheme.primary : 'transparent',
          }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Real Articles</span>
        </button>

        <button
          onClick={() => onSelectCategory('ielts-task1')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeCategory === 'ielts-task1' ? 'font-semibold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeCategory === 'ielts-task1' ? currentTheme.primary : currentTheme.textMain,
            borderColor: activeCategory === 'ielts-task1' ? currentTheme.primary : 'transparent',
          }}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>IELTS Task 1 (Data)</span>
        </button>

        <button
          onClick={() => onSelectCategory('ielts-task2')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeCategory === 'ielts-task2' ? 'font-semibold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeCategory === 'ielts-task2' ? currentTheme.primary : currentTheme.textMain,
            borderColor: activeCategory === 'ielts-task2' ? currentTheme.primary : 'transparent',
          }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>IELTS Task 2 (Essays)</span>
        </button>

        <button
          onClick={onOpenCustomText}
          className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 opacity-70 hover:opacity-100 pb-0.5 border-b-2 border-transparent"
          style={{ color: currentTheme.textMain }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Custom / AI Topic</span>
        </button>
      </nav>

      {/* Zone 3: Clean action buttons */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Sound Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSoundPicker(!showSoundPicker);
              setShowThemePicker(false);
            }}
            title="Keyboard Switch Sound"
            className="p-1.5 rounded text-xs transition-opacity flex items-center gap-1.5 hover:opacity-100 opacity-80"
            style={{ color: currentTheme.textMuted }}
          >
            {soundType === 'off' ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" style={{ color: currentTheme.primary }} />
            )}
            <span className="hidden sm:inline font-mono-custom text-[11px] capitalize">
              {soundType.replace('_', ' ')}
            </span>
          </button>

          {showSoundPicker && (
            <div 
              className="absolute right-0 top-full mt-2 w-44 rounded-lg shadow-xl p-2 border z-50 text-xs"
              style={{ 
                backgroundColor: currentTheme.surface, 
                borderColor: currentTheme.border 
              }}
            >
              <div className="font-semibold mb-1.5 px-2 text-[11px] uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                Switch Sound
              </div>
              {(['off', 'clicky', 'thock', 'box_navy', 'bubble'] as SoundType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onChangeSound(type);
                    setShowSoundPicker(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded flex items-center justify-between capitalize transition-colors"
                  style={{
                    backgroundColor: soundType === type ? currentTheme.bg : 'transparent',
                    color: soundType === type ? currentTheme.primary : currentTheme.textMain,
                  }}
                >
                  <span>{type === 'box_navy' ? 'Box Navy (Heavy)' : type}</span>
                  {soundType === type && <span className="text-[10px]">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemePicker(!showThemePicker);
              setShowSoundPicker(false);
            }}
            title="Color Theme"
            className="p-1.5 rounded text-xs transition-opacity flex items-center gap-1.5 hover:opacity-100 opacity-80"
            style={{ color: currentTheme.textMuted }}
          >
            <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span className="hidden sm:inline font-mono-custom text-[11px]">
              {currentTheme.name}
            </span>
          </button>

          {showThemePicker && (
            <div 
              className="absolute right-0 top-full mt-2 w-52 rounded-lg shadow-xl p-2 border z-50 grid grid-cols-1 gap-1 text-xs"
              style={{ 
                backgroundColor: currentTheme.surface, 
                borderColor: currentTheme.border 
              }}
            >
              <div className="font-semibold mb-1 px-2 text-[11px] uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                Themes
              </div>
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme);
                    setShowThemePicker(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: currentTheme.id === theme.id ? currentTheme.bg : 'transparent',
                    color: currentTheme.id === theme.id ? currentTheme.primary : currentTheme.textMain,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: theme.primary }} 
                    />
                    <span>{theme.name}</span>
                  </div>
                  {currentTheme.id === theme.id && <span className="text-[10px]">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History Stats Button */}
        <button
          onClick={onOpenHistory}
          title="Past Results & Stats"
          className="p-1.5 rounded text-xs transition-opacity flex items-center gap-1 hover:opacity-100 opacity-80"
          style={{ color: currentTheme.textMuted }}
        >
          <History className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
