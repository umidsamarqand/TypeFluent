import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Theme, TestConfig, Article, TestStats, WpmPoint } from '../types';
import { playKeySound } from '../utils/audio';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface TypingAreaProps {
  currentTheme: Theme;
  config: TestConfig;
  article: Article;
  onFinishTest: (stats: TestStats) => void;
  onNextArticle: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  currentTheme,
  config,
  article,
  onFinishTest,
  onNextArticle,
}) => {
  // Parse target words based on config mode
  const targetWords = useMemo(() => {
    const rawWords = article.text.trim().split(/\s+/);
    if (config.mode === 'words') {
      return rawWords.slice(0, config.wordLimit);
    }
    return rawWords;
  }, [article.text, config.mode, config.wordLimit]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedHistory, setTypedHistory] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Time & stats tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [keystrokeLog, setKeystrokeLog] = useState<{ correct: number; incorrect: number; extra: number }>({
    correct: 0,
    incorrect: 0,
    extra: 0,
  });
  const [wpmSnapshots, setWpmSnapshots] = useState<WpmPoint[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Reset test state
  const resetTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedHistory([]);
    setIsStarted(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    setKeystrokeLog({ correct: 0, incorrect: 0, extra: 0 });
    setWpmSnapshots([]);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  // Reset when article or mode changes
  useEffect(() => {
    resetTest();
  }, [article.id, config.mode, config.timeLimit, config.wordLimit, resetTest]);

  // Handle Finish Test calculation
  const finalizeTest = useCallback((finalElapsed: number, finalTypedHistory: string[], finalKeystrokes: { correct: number; incorrect: number; extra: number }, finalSnapshots: WpmPoint[]) => {
    if (isFinished) return;
    setIsFinished(true);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const durationInMinutes = Math.max(finalElapsed, 1) / 60;
    
    // Count exact correct characters across all completed words
    let correctChars = 0;
    let incorrectChars = finalKeystrokes.incorrect;
    let extraChars = finalKeystrokes.extra;
    let missedChars = 0;

    targetWords.forEach((word, wIdx) => {
      const typed = finalTypedHistory[wIdx];
      if (typed !== undefined) {
        for (let i = 0; i < word.length; i++) {
          if (typed[i] === word[i]) {
            correctChars++;
          } else if (typed[i] !== undefined) {
            // mistyped
          } else {
            missedChars++;
          }
        }
      } else if (wIdx < currentWordIndex) {
        missedChars += word.length;
      }
    });

    // Also add current input chars if any
    const currTarget = targetWords[currentWordIndex] || '';
    for (let i = 0; i < currentInput.length; i++) {
      if (i < currTarget.length && currentInput[i] === currTarget[i]) {
        correctChars++;
      }
    }

    // Account for spaces between correct words
    const completedWordsCount = finalTypedHistory.length;
    correctChars += Math.max(0, completedWordsCount);

    const totalTypedChars = correctChars + incorrectChars + extraChars;
    const rawWpm = Math.round((totalTypedChars / 5) / durationInMinutes);
    const netWpm = Math.max(0, Math.round((correctChars / 5) / durationInMinutes));
    const totalKeystrokes = finalKeystrokes.correct + finalKeystrokes.incorrect + finalKeystrokes.extra;
    const accuracy = totalKeystrokes > 0 ? Math.round((finalKeystrokes.correct / totalKeystrokes) * 100) : 100;

    // Consistency formula: calculate standard deviation of WPM samples
    let consistency = 85;
    if (finalSnapshots.length > 2) {
      const speeds = finalSnapshots.map((s) => s.wpm);
      const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      if (mean > 0) {
        const variance = speeds.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / speeds.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
      }
    }

    const finalStats: TestStats = {
      wpm: netWpm,
      rawWpm: Math.max(netWpm, rawWpm),
      accuracy,
      consistency,
      timeElapsed: finalElapsed,
      correctChars,
      incorrectChars,
      extraChars,
      missedChars,
      totalKeystrokes: Math.max(totalKeystrokes, totalTypedChars),
      wpmHistory: finalSnapshots,
      completedWords: completedWordsCount,
      totalWords: targetWords.length,
    };

    onFinishTest(finalStats);
  }, [isFinished, targetWords, currentWordIndex, currentInput, onFinishTest]);

  // Master Timer loop when test is active
  useEffect(() => {
    if (!isStarted || isFinished) return;

    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;

        // Snapshot current WPM for graph
        const currentMins = next / 60;
        // Estimate correct chars so far
        let cChars = keystrokeLog.correct;
        const currentNetWpm = Math.round((cChars / 5) / currentMins);
        const currentRawWpm = Math.round(((keystrokeLog.correct + keystrokeLog.incorrect + keystrokeLog.extra) / 5) / currentMins);

        const point: WpmPoint = {
          second: next,
          wpm: currentNetWpm,
          rawWpm: currentRawWpm,
          errors: keystrokeLog.incorrect,
        };
        setWpmSnapshots((old) => [...old, point]);

        // Check time limit condition
        if (config.mode === 'time' && next >= config.timeLimit) {
          finalizeTest(next, typedHistory, keystrokeLog, [...wpmSnapshots, point]);
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isStarted, isFinished, config.mode, config.timeLimit, finalizeTest, keystrokeLog, typedHistory, wpmSnapshots]);

  // Keep active word in smooth view
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeEl = activeWordRef.current;
      const containerEl = containerRef.current;
      const elTop = activeEl.offsetTop - containerEl.offsetTop;
      const targetScroll = Math.max(0, elTop - 70);
      containerEl.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [currentWordIndex]);

  // Input keystroke handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check Caps Lock state
    setCapsLockOn(e.getModifierState('CapsLock'));

    // Instant restart shortcut: Tab + Enter or Escape
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    if (isFinished) return;

    // Start timer on first genuine keystroke
    if (!isStarted && e.key.length === 1) {
      setIsStarted(true);
    }

    const currentTargetWord = targetWords[currentWordIndex] || '';

    // Handle Space: submit current word
    if (e.key === ' ') {
      e.preventDefault();
      if (currentInput.length === 0) return; // ignore leading duplicate spaces

      const isExactMatch = currentInput === currentTargetWord;
      playKeySound(config.soundType, config.soundVolume, !isExactMatch);

      const nextTypedHistory = [...typedHistory, currentInput];
      setTypedHistory(nextTypedHistory);

      // Check if finished by words or full mode
      const nextWordIndex = currentWordIndex + 1;
      if (nextWordIndex >= targetWords.length) {
        finalizeTest(Math.max(1, elapsedSeconds), nextTypedHistory, keystrokeLog, wpmSnapshots);
        return;
      }

      setCurrentWordIndex(nextWordIndex);
      setCurrentInput('');
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (e.ctrlKey || e.altKey) {
        // Clear entire current word
        e.preventDefault();
        setCurrentInput('');
        return;
      }

      if (currentInput.length > 0) {
        // Backspace inside current word
        playKeySound(config.soundType, config.soundVolume);
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (currentWordIndex > 0) {
        // Backspace into previous word!
        e.preventDefault();
        const prevWordIdx = currentWordIndex - 1;
        const prevTyped = typedHistory[prevWordIdx] || '';
        const updatedHistory = typedHistory.slice(0, prevWordIdx);
        setTypedHistory(updatedHistory);
        setCurrentWordIndex(prevWordIdx);
        setCurrentInput(prevTyped);
        playKeySound(config.soundType, config.soundVolume);
      }
      return;
    }

    // Single character typing
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const charIndex = currentInput.length;
      const expectedChar = currentTargetWord[charIndex];
      const isCorrect = expectedChar === e.key;

      playKeySound(config.soundType, config.soundVolume, !isCorrect);

      setKeystrokeLog((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
        extra: prev.extra + (charIndex >= currentTargetWord.length ? 1 : 0),
      }));

      const nextInput = currentInput + e.key;
      setCurrentInput(nextInput);

      // Check if last character of the last word was typed correctly
      if (
        currentWordIndex === targetWords.length - 1 &&
        nextInput === currentTargetWord
      ) {
        const nextTypedHistory = [...typedHistory, nextInput];
        setTypedHistory(nextTypedHistory);
        finalizeTest(Math.max(1, elapsedSeconds), nextTypedHistory, keystrokeLog, wpmSnapshots);
      }
    }
  };

  // Live timer or words remaining counter
  const counterDisplay = useMemo(() => {
    if (config.mode === 'time') {
      const remaining = Math.max(0, config.timeLimit - elapsedSeconds);
      return `${remaining}s`;
    }
    if (config.mode === 'words') {
      const wordsRemaining = Math.max(0, config.wordLimit - currentWordIndex);
      return `${currentWordIndex}/${config.wordLimit}`;
    }
    return `${currentWordIndex}/${targetWords.length}`;
  }, [config.mode, config.timeLimit, config.wordLimit, elapsedSeconds, currentWordIndex, targetWords.length]);

  return (
    <div 
      className="w-full max-w-5xl mx-auto flex flex-col items-center select-none outline-none relative py-4"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden native input to capture keyboard events effortlessly on desktop & mobile */}
      <input
        ref={inputRef}
        type="text"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="opacity-0 absolute -z-50 pointer-events-none"
        onKeyDown={handleKeyDown}
        onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
        onChange={() => {}} // Controlled via onKeyDown
      />

      {/* Floating Caps Lock Warning Banner */}
      {capsLockOn && (
        <div 
          className="mb-3 px-3 py-1 rounded-md text-xs font-mono-custom flex items-center gap-1.5 shadow-sm animate-pulse"
          style={{ backgroundColor: currentTheme.error, color: '#ffffff' }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>CAPS LOCK IS ON</span>
        </div>
      )}

      {/* Live Counter & Subtle Telemetry */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-sm font-mono-custom">
        <div 
          className="text-2xl font-bold tabular-nums transition-colors"
          style={{ color: isStarted ? currentTheme.primary : currentTheme.textMuted }}
        >
          {counterDisplay}
        </div>

        <div className="flex items-center gap-4 text-xs" style={{ color: currentTheme.textMuted }}>
          {isStarted && (
            <div className="flex items-center gap-3">
              <span>
                raw:{' '}
                <strong className="tabular-nums" style={{ color: currentTheme.textMain }}>
                  {elapsedSeconds > 0
                    ? Math.round(((keystrokeLog.correct + keystrokeLog.incorrect) / 5) / (elapsedSeconds / 60))
                    : 0}
                </strong>
              </span>
              <span>
                acc:{' '}
                <strong className="tabular-nums" style={{ color: currentTheme.textMain }}>
                  {keystrokeLog.correct + keystrokeLog.incorrect > 0
                    ? Math.round((keystrokeLog.correct / (keystrokeLog.correct + keystrokeLog.incorrect)) * 100)
                    : 100}%
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* The Text Display Viewport */}
      <div
        ref={containerRef}
        className="w-full max-h-[260px] overflow-hidden no-scrollbar text-xl sm:text-2xl leading-relaxed tracking-normal font-mono-custom transition-all p-4 rounded-xl cursor-text relative"
        style={{
          backgroundColor: currentTheme.surface,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <div className="flex flex-wrap gap-x-2.5 gap-y-2">
          {targetWords.map((word, wIdx) => {
            const isCurrent = wIdx === currentWordIndex;
            const isCompleted = wIdx < currentWordIndex;
            const typedWord = typedHistory[wIdx];

            // Render Previous Completed Words
            if (isCompleted && typedWord !== undefined) {
              const hasMistake = typedWord !== word;
              return (
                <span
                  key={wIdx}
                  className={`inline-block transition-colors ${
                    hasMistake ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderColor: hasMistake ? currentTheme.error : 'transparent',
                  }}
                >
                  {word.split('').map((char, cIdx) => {
                    const typedChar = typedWord[cIdx];
                    let charColor = currentTheme.textMain;

                    if (!config.blindMode) {
                      if (typedChar === undefined) {
                        charColor = currentTheme.error; // missed char
                      } else if (typedChar !== char) {
                        charColor = currentTheme.error;
                      }
                    }

                    return (
                      <span key={cIdx} style={{ color: charColor }}>
                        {char}
                      </span>
                    );
                  })}
                  {/* Extra letters if typed past word length */}
                  {!config.blindMode && typedWord.length > word.length && (
                    <span style={{ color: currentTheme.errorExtra }}>
                      {typedWord.slice(word.length)}
                    </span>
                  )}
                </span>
              );
            }

            // Render Active Word
            if (isCurrent) {
              return (
                <span
                  key={wIdx}
                  ref={activeWordRef}
                  className="inline-block relative rounded px-0.5"
                >
                  {word.split('').map((char, cIdx) => {
                    const typedChar = currentInput[cIdx];
                    const isTyped = cIdx < currentInput.length;
                    const isCorrect = isTyped && typedChar === char;
                    const isCurrentCaretChar = cIdx === currentInput.length;

                    let charColor = currentTheme.textMuted;
                    if (isTyped) {
                      if (config.blindMode) {
                        charColor = currentTheme.textMain;
                      } else {
                        charColor = isCorrect ? currentTheme.textMain : currentTheme.error;
                      }
                    }

                    return (
                      <span key={cIdx} className="relative">
                        {/* Caret before character */}
                        {isCurrentCaretChar && (
                          <span
                            className="absolute -left-[1px] top-0 bottom-0 w-[2.5px] rounded-full animate-caret"
                            style={{ backgroundColor: currentTheme.caret }}
                          />
                        )}
                        <span style={{ color: charColor }}>{char}</span>
                      </span>
                    );
                  })}

                  {/* Extra letters typed on active word */}
                  {currentInput.length > word.length && (
                    <span style={{ color: currentTheme.errorExtra }}>
                      {currentInput.slice(word.length)}
                    </span>
                  )}

                  {/* Caret at the end of word if typing extra letters */}
                  {currentInput.length >= word.length && (
                    <span
                      className="inline-block w-[2.5px] h-6 -mb-1 rounded-full animate-caret ml-[1px]"
                      style={{ backgroundColor: currentTheme.caret }}
                    />
                  )}
                </span>
              );
            }

            // Render Future Untyped Words
            return (
              <span key={wIdx} className="inline-block" style={{ color: currentTheme.textMuted }}>
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Control bar below text: Restart button and Tab + Enter hint */}
      <div className="flex items-center justify-between w-full mt-5 px-2 text-xs font-mono-custom" style={{ color: currentTheme.textMuted }}>
        <button
          onClick={resetTest}
          title="Restart Test (Tab)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all hover:opacity-100 opacity-70"
          style={{ 
            backgroundColor: currentTheme.surface, 
            color: currentTheme.textMain,
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>restart</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline opacity-70">
            <kbd className="px-1.5 py-0.5 rounded text-[11px] bg-black/20 border border-white/10">tab</kbd> to restart
          </span>
          <button
            onClick={onNextArticle}
            className="hover:underline transition-opacity opacity-75 hover:opacity-100"
            style={{ color: currentTheme.primary }}
          >
            next article →
          </button>
        </div>
      </div>
    </div>
  );
};
