import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Theme, TestConfig, Article, TestStats, WpmPoint } from '../types';
import { playKeySound } from '../utils/audio';
import { RotateCcw, AlertTriangle, ArrowRight, Gauge, CheckCircle2 } from 'lucide-react';

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

  const [errorKeysMap, setErrorKeysMap] = useState<Record<string, number>>({});

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
    setErrorKeysMap({});
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

    // Account for spaces between completed words
    const completedWordsCount = finalTypedHistory.length;
    correctChars += Math.max(0, completedWordsCount);

    const totalTypedChars = correctChars + incorrectChars + extraChars;
    const rawWpm = Math.round((totalTypedChars / 5) / durationInMinutes);
    const netWpm = Math.max(0, Math.round((correctChars / 5) / durationInMinutes));
    const totalKeystrokes = finalKeystrokes.correct + finalKeystrokes.incorrect + finalKeystrokes.extra;
    const accuracy = totalKeystrokes > 0 ? Math.round((finalKeystrokes.correct / totalKeystrokes) * 100) : 100;

    // Consistency formula
    let consistency = 88;
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

    const peakWpm = Math.max(netWpm, ...finalSnapshots.map((s) => s.wpm), 0);

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
      peakWpm,
      errorKeys: errorKeysMap,
    };

    onFinishTest(finalStats);
  }, [isFinished, targetWords, currentWordIndex, currentInput, onFinishTest, errorKeysMap]);

  // Master Timer loop when test is active
  useEffect(() => {
    if (!isStarted || isFinished) return;

    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;

        // Snapshot current WPM for graph
        const currentMins = next / 60;
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
    setCapsLockOn(e.getModifierState('CapsLock'));

    // Instant restart shortcut: Tab
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
      if (currentInput.length === 0) return;

      const isExactMatch = currentInput === currentTargetWord;
      playKeySound(config.soundType, config.soundVolume, !isExactMatch);

      const nextTypedHistory = [...typedHistory, currentInput];
      setTypedHistory(nextTypedHistory);

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
        e.preventDefault();
        setCurrentInput('');
        return;
      }

      if (currentInput.length > 0) {
        playKeySound(config.soundType, config.soundVolume);
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (currentWordIndex > 0) {
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

      if (!isCorrect) {
        const errKey = expectedChar || e.key;
        setErrorKeysMap((prev) => ({
          ...prev,
          [errKey]: (prev[errKey] || 0) + 1,
        }));
      }

      setKeystrokeLog((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
        extra: prev.extra + (charIndex >= currentTargetWord.length ? 1 : 0),
      }));

      const nextInput = currentInput + e.key;
      setCurrentInput(nextInput);

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

  // Progress percentage calculation
  const progressPercent = useMemo(() => {
    if (config.mode === 'time') {
      return Math.min(100, Math.round((elapsedSeconds / config.timeLimit) * 100));
    }
    return Math.min(100, Math.round((currentWordIndex / targetWords.length) * 100));
  }, [config.mode, config.timeLimit, elapsedSeconds, currentWordIndex, targetWords.length]);

  return (
    <div 
      className="w-full flex flex-col items-center select-none outline-none relative"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden native input */}
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
        onChange={() => {}}
      />

      {/* Floating Caps Lock Warning Banner */}
      {capsLockOn && (
        <div 
          className="mb-3 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm"
          style={{ backgroundColor: currentTheme.error, color: '#ffffff' }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>CAPS LOCK IS ACTIVE</span>
        </div>
      )}

      {/* Modern White Typing Card */}
      <div 
        className="w-full rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
        }}
      >
        {/* Top Header Strip inside Card */}
        <div 
          className="px-6 py-3.5 border-b flex items-center justify-between text-xs transition-colors"
          style={{ 
            borderColor: currentTheme.border,
            backgroundColor: `${currentTheme.primary}08`
          }}
        >
          {/* Left: Progress / Time status */}
          <div className="flex items-center gap-3">
            <div 
              className="px-3 py-1 rounded-md font-mono-custom text-xs font-bold flex items-center gap-1.5 shadow-xs"
              style={{ backgroundColor: currentTheme.primary, color: '#0a1128' }}
            >
              {config.mode === 'time' ? (
                <span>{Math.max(0, config.timeLimit - elapsedSeconds)}s remaining</span>
              ) : (
                <span>Word {currentWordIndex + 1} of {targetWords.length}</span>
              )}
            </div>

            <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: currentTheme.primary 
                }}
              />
            </div>
          </div>

          {/* Right: Live Telemetry */}
          <div className="flex items-center gap-4 font-mono-custom text-xs">
            {isStarted ? (
              <>
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-500" />
                  <span style={{ color: currentTheme.textMuted }}>Speed:</span>
                  <span className="font-bold tabular-nums" style={{ color: currentTheme.textMain }}>
                    {elapsedSeconds > 0
                      ? Math.round(((keystrokeLog.correct + keystrokeLog.incorrect) / 5) / (elapsedSeconds / 60))
                      : 0} WPM
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span style={{ color: currentTheme.textMuted }}>Acc:</span>
                  <span className="font-bold tabular-nums" style={{ color: currentTheme.textMain }}>
                    {keystrokeLog.correct + keystrokeLog.incorrect > 0
                      ? Math.round((keystrokeLog.correct / (keystrokeLog.correct + keystrokeLog.incorrect)) * 100)
                      : 100}%
                  </span>
                </div>
              </>
            ) : (
              <span className="text-slate-400 font-sans text-[11px]">
                Click here and begin typing to start test
              </span>
            )}
          </div>
        </div>

        {/* Text Area Body */}
        <div
          ref={containerRef}
          className="w-full max-h-[290px] overflow-hidden no-scrollbar text-xl sm:text-2xl leading-relaxed tracking-normal font-mono-custom p-6 sm:p-8 cursor-text relative"
        >
          <div className="flex flex-wrap gap-x-2.5 gap-y-3">
            {targetWords.map((word, wIdx) => {
              const isCurrent = wIdx === currentWordIndex;
              const isCompleted = wIdx < currentWordIndex;
              const typedWord = typedHistory[wIdx];

              // Previous Completed Words
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
                        if (typedChar === undefined || typedChar !== char) {
                          charColor = currentTheme.error;
                        }
                      }

                      return (
                        <span key={cIdx} style={{ color: charColor }}>
                          {char}
                        </span>
                      );
                    })}
                    {!config.blindMode && typedWord.length > word.length && (
                      <span style={{ color: currentTheme.errorExtra }}>
                        {typedWord.slice(word.length)}
                      </span>
                    )}
                  </span>
                );
              }

              // Active Word
              if (isCurrent) {
                return (
                  <span
                    key={wIdx}
                    ref={activeWordRef}
                    className="inline-block relative rounded px-1 py-0.5"
                    style={{
                      backgroundColor: `${currentTheme.primary}12`,
                    }}
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
                          {isCurrentCaretChar && (
                            <span
                              className="absolute -left-[1.5px] top-0 bottom-0 w-[3px] rounded-full animate-caret shadow-xs"
                              style={{ backgroundColor: currentTheme.caret }}
                            />
                          )}
                          <span style={{ color: charColor }}>{char}</span>
                        </span>
                      );
                    })}

                    {currentInput.length > word.length && (
                      <span style={{ color: currentTheme.errorExtra }}>
                        {currentInput.slice(word.length)}
                      </span>
                    )}

                    {currentInput.length >= word.length && (
                      <span
                        className="inline-block w-[3px] h-6 -mb-1 rounded-full animate-caret ml-[1px]"
                        style={{ backgroundColor: currentTheme.caret }}
                      />
                    )}
                  </span>
                );
              }

              // Future Words
              return (
                <span 
                  key={wIdx} 
                  className="inline-block opacity-60" 
                  style={{ color: currentTheme.textMuted }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Card Footer Bar */}
        <div 
          className="px-6 py-3 border-t flex items-center justify-between text-xs"
          style={{ borderColor: currentTheme.border }}
        >
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-white/10"
            style={{ 
              borderColor: currentTheme.border,
              backgroundColor: currentTheme.bg, 
              color: '#ffffff' 
            }}
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Restart (Tab)</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[11px]" style={{ color: currentTheme.textMuted }}>
              Press <kbd className="px-1.5 py-0.5 rounded border text-[10px] bg-white/10 border-white/20 text-sky-300">Space</kbd> after each word
            </span>

            <button
              onClick={onNextArticle}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 transition-opacity hover:opacity-90 shadow-xs"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <span>Next Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
