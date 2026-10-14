import React, { useEffect, useMemo } from 'react';
import { Theme, TestConfig, Article, TestStats } from '../types';
import { analyzeIeltsTyping } from '../utils/ieltsAnalyzer';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Award, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface ResultScreenProps {
  currentTheme: Theme;
  config: TestConfig;
  article: Article;
  stats: TestStats;
  onRestart: () => void;
  onNextArticle: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  currentTheme,
  config,
  article,
  stats,
  onRestart,
  onNextArticle,
}) => {
  const [copied, setCopied] = React.useState(false);

  // IELTS analysis
  const ieltsAnalysis = useMemo(() => {
    return analyzeIeltsTyping(article, stats);
  }, [article, stats]);

  // Trigger celebration confetti for high achievement
  useEffect(() => {
    if (stats.accuracy >= 95 && stats.wpm >= 45) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: [currentTheme.primary, currentTheme.secondary, '#ffffff'],
        });
      } catch {
        // ignore
      }
    }
  }, [stats.accuracy, stats.wpm, currentTheme.primary, currentTheme.secondary]);

  // Handle copy summary
  const copyStats = () => {
    const summary = `ArticleType Speed Test:
WPM: ${stats.wpm} (Raw: ${stats.rawWpm})
Accuracy: ${stats.accuracy}%
Consistency: ${stats.consistency}%
Article: ${article.title}
${ieltsAnalysis.isIelts ? `IELTS Band Estimate: ${ieltsAnalysis.estimatedBand} (${ieltsAnalysis.taskType})` : ''}
Practice on ArticleType!`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build SVG path data for WPM graph
  const graphPoints = stats.wpmHistory;
  const maxWpm = Math.max(60, ...graphPoints.map((p) => Math.max(p.wpm, p.rawWpm)));
  const graphWidth = 600;
  const graphHeight = 160;

  const wpmSvgPath = useMemo(() => {
    if (graphPoints.length < 2) return '';
    return graphPoints
      .map((p, i) => {
        const x = (i / (graphPoints.length - 1)) * graphWidth;
        const y = graphHeight - (p.wpm / maxWpm) * (graphHeight - 20) - 10;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [graphPoints, maxWpm]);

  const rawWpmSvgPath = useMemo(() => {
    if (graphPoints.length < 2) return '';
    return graphPoints
      .map((p, i) => {
        const x = (i / (graphPoints.length - 1)) * graphWidth;
        const y = graphHeight - (p.rawWpm / maxWpm) * (graphHeight - 20) - 10;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [graphPoints, maxWpm]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 font-mono-custom select-none animate-in fade-in duration-300">
      {/* Top Banner Stats: Monkeytype Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Hero WPM */}
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: currentTheme.textMuted }}>
            wpm
          </div>
          <div 
            className="text-6xl sm:text-7xl font-extrabold tabular-nums tracking-tight"
            style={{ color: currentTheme.primary }}
          >
            {stats.wpm}
          </div>
        </div>

        {/* Hero Accuracy */}
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: currentTheme.textMuted }}>
            acc
          </div>
          <div 
            className="text-6xl sm:text-7xl font-extrabold tabular-nums tracking-tight"
            style={{ color: stats.accuracy >= 95 ? currentTheme.primary : currentTheme.textMain }}
          >
            {stats.accuracy}%
          </div>
        </div>

        {/* Secondary KPI Cluster */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs">
          <div>
            <div style={{ color: currentTheme.textMuted }}>test type</div>
            <div className="text-sm font-semibold truncate" style={{ color: currentTheme.textMain }}>
              {config.mode === 'time' ? `${config.timeLimit}s` : config.mode === 'words' ? `${config.wordLimit} words` : 'full'} · {article.category}
            </div>
          </div>

          <div>
            <div style={{ color: currentTheme.textMuted }}>raw wpm</div>
            <div className="text-sm font-semibold tabular-nums" style={{ color: currentTheme.textMain }}>
              {stats.rawWpm}
            </div>
          </div>

          <div>
            <div style={{ color: currentTheme.textMuted }}>characters</div>
            <div className="text-sm font-semibold tabular-nums" style={{ color: currentTheme.textMain }}>
              <span style={{ color: currentTheme.textMain }}>{stats.correctChars}</span> /{' '}
              <span style={{ color: currentTheme.error }}>{stats.incorrectChars}</span> /{' '}
              <span style={{ color: currentTheme.errorExtra }}>{stats.extraChars}</span> /{' '}
              <span style={{ color: currentTheme.textMuted }}>{stats.missedChars}</span>
            </div>
          </div>

          <div>
            <div style={{ color: currentTheme.textMuted }}>consistency</div>
            <div className="text-sm font-semibold tabular-nums" style={{ color: currentTheme.textMain }}>
              {stats.consistency}%
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Graph */}
      {graphPoints.length > 2 && (
        <div 
          className="w-full p-4 rounded-xl border relative"
          style={{ 
            backgroundColor: currentTheme.surface, 
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-center justify-between mb-2 text-xs" style={{ color: currentTheme.textMuted }}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: currentTheme.primary }} />
                wpm
              </span>
              <span className="flex items-center gap-1.5 opacity-60">
                <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: currentTheme.textMuted }} />
                raw
              </span>
            </div>
            <span className="tabular-nums">{stats.timeElapsed}s duration</span>
          </div>

          <div className="w-full h-40 relative">
            <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-full overflow-visible">
              {/* Background horizontal grid lines */}
              <line x1="0" y1="10" x2={graphWidth} y2="10" stroke={currentTheme.border} strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1={graphHeight / 2} x2={graphWidth} y2={graphHeight / 2} stroke={currentTheme.border} strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1={graphHeight - 10} x2={graphWidth} y2={graphHeight - 10} stroke={currentTheme.border} strokeDasharray="3 3" opacity="0.4" />

              {/* Raw WPM Line */}
              {rawWpmSvgPath && (
                <path
                  d={rawWpmSvgPath}
                  fill="none"
                  stroke={currentTheme.textMuted}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity="0.5"
                />
              )}

              {/* Net WPM Line */}
              {wpmSvgPath && (
                <path
                  d={wpmSvgPath}
                  fill="none"
                  stroke={currentTheme.primary}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Mistake indicators */}
              {graphPoints.map((p, i) => {
                if (p.errors > 0 && i > 0) {
                  const x = (i / (graphPoints.length - 1)) * graphWidth;
                  const y = graphHeight - (p.wpm / maxWpm) * (graphHeight - 20) - 10;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={currentTheme.error}
                    />
                  );
                }
                return null;
              })}
            </svg>
          </div>
        </div>
      )}

      {/* IELTS Specific Band Assessment Card */}
      {ieltsAnalysis.isIelts && (
        <div 
          className="w-full p-5 rounded-xl border flex flex-col gap-4 text-xs"
          style={{ 
            backgroundColor: currentTheme.surface, 
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: currentTheme.border }}>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-sm" style={{ color: currentTheme.textMain }}>
                  IELTS Writing Fluency & Typing Evaluation
                </span>
                <span className="opacity-70 ml-2">({ieltsAnalysis.taskType})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: currentTheme.textMuted }}>Estimated Typing Band:</span>
              <span 
                className="text-lg font-bold px-2 py-0.5 rounded font-mono-custom"
                style={{ backgroundColor: currentTheme.bg, color: currentTheme.primary }}
              >
                Band {ieltsAnalysis.estimatedBand.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Word Count Target Milestone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className="p-3 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: currentTheme.bg }}
            >
              <div>
                <div style={{ color: currentTheme.textMuted }}>Exam Word Target</div>
                <div className="font-semibold text-sm mt-0.5" style={{ color: currentTheme.textMain }}>
                  {stats.completedWords} / {ieltsAnalysis.wordCountTarget} words
                </div>
              </div>
              {ieltsAnalysis.targetMet ? (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Target Met</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{ieltsAnalysis.wordCountTarget - stats.completedWords} words remaining</span>
                </div>
              )}
            </div>

            <div 
              className="p-3 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: currentTheme.bg }}
            >
              <div>
                <div style={{ color: currentTheme.textMuted }}>Examiner Descriptor</div>
                <div className="font-semibold text-xs mt-0.5 truncate" style={{ color: currentTheme.textMain }}>
                  {ieltsAnalysis.bandDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Vocabulary Practiced */}
          {ieltsAnalysis.identifiedVocab.length > 0 && (
            <div>
              <div className="font-semibold mb-2" style={{ color: currentTheme.textMuted }}>
                Academic Collocations Practiced in this Essay:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ieltsAnalysis.identifiedVocab.map((vocab) => (
                  <span
                    key={vocab}
                    className="px-2 py-0.5 rounded text-[11px]"
                    style={{ backgroundColor: currentTheme.bg, color: currentTheme.primary }}
                  >
                    {vocab}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specific IELTS Feedback */}
          {ieltsAnalysis.feedbackPoints.length > 0 && (
            <div className="space-y-1 pt-1">
              {ieltsAnalysis.feedbackPoints.map((fb, idx) => (
                <div key={idx} className="flex items-start gap-1.5 opacity-80">
                  <span style={{ color: currentTheme.primary }}>•</span>
                  <span>{fb}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons: Next / Restart / Copy */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
          style={{ 
            backgroundColor: currentTheme.surface, 
            color: currentTheme.textMain,
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>restart test</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={copyStats}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all hover:opacity-100 opacity-80"
            style={{ 
              backgroundColor: currentTheme.surface, 
              color: currentTheme.textMuted,
              border: `1px solid ${currentTheme.border}`
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'copied!' : 'copy stats'}</span>
          </button>

          <button
            onClick={onNextArticle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm hover:opacity-95"
            style={{ 
              backgroundColor: currentTheme.primary, 
              color: currentTheme.bg 
            }}
          >
            <span>next article</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
