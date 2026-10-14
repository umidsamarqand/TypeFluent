export type ArticleCategory = 
  | 'all'
  | 'science'
  | 'tech'
  | 'culture'
  | 'nature'
  | 'literature'
  | 'ielts-task1'
  | 'ielts-task2'
  | 'custom';

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  source: string;
  author?: string;
  text: string;
  ieltsPrompt?: string;
  ieltsType?: 'Task 1 Academic' | 'Task 2 Essay';
  wordCount: number;
  academicVocabulary?: string[];
  keyPoints?: string[];
}

export type SoundType = 'off' | 'clicky' | 'thock' | 'box_navy' | 'bubble';

export type TestMode = 'time' | 'words' | 'full';

export interface TestConfig {
  mode: TestMode;
  timeLimit: number; // 15, 30, 60, 120
  wordLimit: number; // 25, 50, 100, 250
  category: ArticleCategory;
  soundType: SoundType;
  soundVolume: number; // 0 to 1
  blindMode: boolean;
  quickRestart: boolean;
  showLiveWpm: boolean;
  showLiveTimer: boolean;
  smoothCaret: boolean;
}

export interface WpmPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeElapsed: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalKeystrokes: number;
  wpmHistory: WpmPoint[];
  completedWords: number;
  totalWords: number;
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  surface: string;
  textMuted: string;
  textMain: string;
  primary: string;
  secondary: string;
  error: string;
  errorExtra: string;
  caret: string;
  border: string;
}

export interface StoredResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeElapsed: number;
  mode: TestMode;
  modeValue: number;
  category: ArticleCategory;
  articleTitle: string;
  isIelts: boolean;
  ieltsBandEstimate?: number;
}
