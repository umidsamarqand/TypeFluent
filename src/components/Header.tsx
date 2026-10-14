import React, { useState } from 'react';
import { Theme, SoundType, ArticleCategory } from '../types';
import { Volume2, VolumeX, History, FileText, Sparkles, BookOpen, GraduationCap, PenTool } from 'lucide-react';

interface HeaderProps {
  currentTheme: Theme;
  soundType: SoundType;
  onChangeSound: (sound: SoundType) => void;
  onOpenHistory: () => void;
  onOpenCustomText: () => void;
  activeCategory: ArticleCategory;
  onSelectCategory: (cat: ArticleCategory) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  soundType,
  onChangeSound,
  onOpenHistory,
  onOpenCustomText,
  activeCategory,
  onSelectCategory,
}) => {
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  return (
    <header 
      className="flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5 border-b transition-colors relative z-30 shadow-xs"
      style={{ 
        borderColor: currentTheme.border, 
        backgroundColor: currentTheme.surface 
      }}
    >
      {/* Zone 1: Clean Distinctive Brand Lockup */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="/" 
          className="text-base font-bold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2.5"
          style={{ color: currentTheme.textMain }}
        >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
            style={{ backgroundColor: currentTheme.primary, color: '#ffffff' }}
          >
            <PenTool className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight tracking-tight">ArticleType</span>
            <span className="text-[10px] font-normal leading-none" style={{ color: currentTheme.primary }}>
              Academic & Article Practice
            </span>
          </div>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-medium">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeCategory === 'all' || activeCategory === 'science' || activeCategory === 'tech' || activeCategory === 'nature' || activeCategory === 'literature'
              ? 'font-semibold' 
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: (activeCategory === 'all' || activeCategory === 'science' || activeCategory === 'tech' || activeCategory === 'nature' || activeCategory === 'literature') 
              ? currentTheme.primary 
              : currentTheme.textMuted,
            borderColor: (activeCategory === 'all' || activeCategory === 'science' || activeCategory === 'tech' || activeCategory === 'nature' || activeCategory === 'literature') 
              ? currentTheme.primary 
              : 'transparent',
          }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Real Articles</span>
        </button>

        <button
          onClick={() => onSelectCategory('ielts-task1')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeCategory === 'ielts-task1' ? 'font-semibold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeCategory === 'ielts-task1' ? currentTheme.primary : currentTheme.textMuted,
            borderColor: activeCategory === 'ielts-task1' ? currentTheme.primary : 'transparent',
          }}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>IELTS Task 1 (Data)</span>
        </button>

        <button
          onClick={() => onSelectCategory('ielts-task2')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeCategory === 'ielts-task2' ? 'font-semibold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeCategory === 'ielts-task2' ? currentTheme.primary : currentTheme.textMuted,
            borderColor: activeCategory === 'ielts-task2' ? currentTheme.primary : 'transparent',
          }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>IELTS Task 2 (Essays)</span>
        </button>

        <button
          onClick={onOpenCustomText}
          className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 opacity-70 hover:opacity-100 pb-1 border-b-2 border-transparent"
          style={{ color: currentTheme.textMuted }}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Generate / Paste</span>
        </button>
      </nav>

      {/* Zone 3: Clean Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Switch Sound Selector */}
        <div className="relative">
          <button
            onClick={() => setShowSoundPicker(!showSoundPicker)}
            title="Keyboard Key Sound"
            className="px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 border"
            style={{ 
              borderColor: currentTheme.border,
              backgroundColor: currentTheme.bg,
              color: currentTheme.textMain 
            }}
          >
            {soundType === 'off' ? (
              <VolumeX className="w-3.5 h-3.5 opacity-60" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
            )}
            <span className="hidden sm:inline text-[11px] capitalize">
              {soundType === 'off' ? 'Mute' : soundType.replace('_', ' ')}
            </span>
          </button>

          {showSoundPicker && (
            <div 
              className="absolute right-0 top-full mt-2 w-44 rounded-lg shadow-lg p-1.5 border z-50 text-xs"
              style={{ 
                backgroundColor: currentTheme.surface, 
                borderColor: currentTheme.border 
              }}
            >
              <div className="font-semibold mb-1 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400">
                Switch Audio
              </div>
              {(['off', 'clicky', 'thock', 'box_navy', 'bubble'] as SoundType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onChangeSound(type);
                    setShowSoundPicker(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between capitalize transition-colors text-xs"
                  style={{
                    backgroundColor: soundType === type ? `${currentTheme.primary}15` : 'transparent',
                    color: soundType === type ? currentTheme.primary : currentTheme.textMain,
                  }}
                >
                  <span>{type === 'box_navy' ? 'Box Navy (Heavy)' : type}</span>
                  {soundType === type && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Past Records / History */}
        <button
          onClick={onOpenHistory}
          title="Past Tests & Band History"
          className="px-2.5 py-1.5 rounded-md transition-colors border text-xs flex items-center gap-1.5 hover:bg-white/10"
          style={{ 
            borderColor: currentTheme.border,
            backgroundColor: currentTheme.bg,
            color: '#ffffff' 
          }}
        >
          <History className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Records</span>
        </button>
      </div>
    </header>
  );
};
