import React, { useEffect, useMemo } from 'react';
import { Theme, TestConfig, Article, TestStats } from '../types';
import { analyzeIeltsTyping } from '../utils/ieltsAnalyzer';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Award, CheckCircle2, AlertCircle, Copy, Check, BarChart2 } from 'lucide-react';

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
    if (stats.accuracy >= 95 && stats.wpm >= 40) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#38bdf8', '#0284c7', '#ffffff'],
        });
      } catch {
        // ignore
      }
    }
  }, [stats.accuracy, stats.wpm]);

  // Handle copy summary
  const copyStats = () => {
    const summary = `ArticleType Performance Dossier:
WPM: ${stats.wpm} (Raw: ${stats.rawWpm})
Accuracy: ${stats.accuracy}%
Consistency: ${stats.consistency}%
Article: ${article.title}
${ieltsAnalysis.isIelts ? `IELTS Band Score: ${ieltsAnalysis.estimatedBand.toFixed(1)} (${ieltsAnalysis.taskType})` : ''}
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4 select-none animate-in fade-in duration-300">
      {/* Top Banner Result Card */}
      <div 
        className="w-full p-6 sm:p-8 rounded-2xl border shadow-sm flex flex-col gap-6"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: currentTheme.border }}>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: currentTheme.primary }}>
              Typing Test Completed
            </div>
            <h2 className="text-xl font-bold mt-0.5" style={{ color: currentTheme.textMain }}>
              {article.title}
            </h2>
            <div className="text-xs opacity-70 mt-0.5" style={{ color: currentTheme.textMuted }}>
              {article.source} · {config.mode === 'time' ? `${config.timeLimit}s test` : `${config.wordLimit} words`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyStats}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-slate-50"
              style={{ borderColor: currentTheme.border, color: currentTheme.textMain }}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share Result'}</span>
            </button>
          </div>
        </div>

        {/* Primary KPI Hero Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: currentTheme.border }}>
            <div className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>Net Velocity</div>
            <div className="text-4xl sm:text-5xl font-extrabold tabular-nums font-mono-custom mt-1" style={{ color: currentTheme.primary }}>
              {stats.wpm}
            </div>
            <div className="text-[11px] opacity-70 mt-1">Words per minute</div>
          </div>

          <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: currentTheme.border }}>
            <div className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>Accuracy</div>
            <div className="text-4xl sm:text-5xl font-extrabold tabular-nums font-mono-custom mt-1" style={{ color: currentTheme.textMain }}>
              {stats.accuracy}%
            </div>
            <div className="text-[11px] opacity-70 mt-1">Keystroke precision</div>
          </div>

          <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: currentTheme.border }}>
            <div className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>Raw Speed</div>
            <div className="text-4xl sm:text-5xl font-extrabold tabular-nums font-mono-custom mt-1" style={{ color: currentTheme.textMain }}>
              {stats.rawWpm}
            </div>
            <div className="text-[11px] opacity-70 mt-1">Gross velocity</div>
          </div>

          <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: currentTheme.border }}>
            <div className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>Consistency</div>
            <div className="text-4xl sm:text-5xl font-extrabold tabular-nums font-mono-custom mt-1" style={{ color: currentTheme.textMain }}>
              {stats.consistency}%
            </div>
            <div className="text-[11px] opacity-70 mt-1">Rhythm stability</div>
          </div>
        </div>

        {/* Characters Breakdown */}
        <div className="flex flex-wrap items-center justify-between text-xs py-2 px-4 rounded-lg bg-slate-50 border font-mono-custom" style={{ borderColor: currentTheme.border }}>
          <span style={{ color: currentTheme.textMuted }}>Characters:</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 font-semibold">{stats.correctChars} correct</span>
            <span aria-hidden="true" className="opacity-30">|</span>
            <span className="text-red-600 font-semibold">{stats.incorrectChars} incorrect</span>
            <span aria-hidden="true" className="opacity-30">|</span>
            <span className="text-amber-600 font-semibold">{stats.extraChars} extra</span>
            <span aria-hidden="true" className="opacity-30">|</span>
            <span className="opacity-60">{stats.missedChars} missed</span>
          </div>
        </div>

        {/* SVG Performance Trajectory */}
        {graphPoints.length > 2 && (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between text-xs" style={{ color: currentTheme.textMuted }}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-1 rounded-full bg-blue-600" />
                  Net WPM
                </span>
                <span className="flex items-center gap-1.5 font-medium opacity-60">
                  <span className="w-2.5 h-1 rounded-full bg-slate-400" />
                  Raw WPM
                </span>
              </div>
              <span className="font-mono-custom">{stats.timeElapsed}s duration</span>
            </div>

            <div className="w-full h-36 border rounded-xl p-3 bg-white" style={{ borderColor: currentTheme.border }}>
              <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-full overflow-visible">
                <line x1="0" y1="10" x2={graphWidth} y2="10" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="0" y1={graphHeight / 2} x2={graphWidth} y2={graphHeight / 2} stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="0" y1={graphHeight - 10} x2={graphWidth} y2={graphHeight - 10} stroke="#f1f5f9" strokeWidth="1.5" />

                {rawWpmSvgPath && (
                  <path
                    d={rawWpmSvgPath}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.6"
                  />
                )}

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

                {graphPoints.map((p, i) => {
                  if (p.errors > 0 && i > 0) {
                    const x = (i / (graphPoints.length - 1)) * graphWidth;
                    const y = graphHeight - (p.wpm / maxWpm) * (graphHeight - 20) - 10;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#ef4444"
                      />
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          </div>
        )}

        {/* IELTS Evaluation Dossier if IELTS Mode */}
        {ieltsAnalysis.isIelts && (
          <div 
            className="p-5 rounded-xl border flex flex-col gap-4 text-xs"
            style={{ 
              backgroundColor: `${currentTheme.primary}06`, 
              borderColor: `${currentTheme.primary}30` 
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: `${currentTheme.primary}20` }}>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="font-bold text-sm text-slate-900">
                    IELTS Writing Fluency & Typing Evaluation
                  </span>
                  <span className="text-slate-500 ml-2">({ieltsAnalysis.taskType})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Estimated Typing Band:</span>
                <span className="text-lg font-bold px-3 py-0.5 rounded-lg bg-blue-600 text-white font-mono-custom shadow-xs">
                  Band {ieltsAnalysis.estimatedBand.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-white border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-slate-500">Exam Target Words</div>
                  <div className="font-bold text-sm text-slate-900 mt-0.5 font-mono-custom">
                    {stats.completedWords} / {ieltsAnalysis.wordCountTarget} words
                  </div>
                </div>
                {ieltsAnalysis.targetMet ? (
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Target Met</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>{ieltsAnalysis.wordCountTarget - stats.completedWords} words remaining</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-slate-500">Examiner Descriptor</div>
                  <div className="font-semibold text-xs text-slate-800 mt-0.5">
                    {ieltsAnalysis.bandDescription}
                  </div>
                </div>
              </div>
            </div>

            {ieltsAnalysis.identifiedVocab.length > 0 && (
              <div>
                <div className="font-semibold mb-2 text-slate-700">
                  Academic Collocations Practiced in this Essay:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ieltsAnalysis.identifiedVocab.map((vocab) => (
                    <span
                      key={vocab}
                      className="px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-700 font-mono-custom text-[11px]"
                    >
                      {vocab}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {ieltsAnalysis.feedbackPoints.length > 0 && (
              <div className="space-y-1 pt-1 text-slate-600">
                {ieltsAnalysis.feedbackPoints.map((fb, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600">•</span>
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: currentTheme.border }}>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-colors hover:bg-slate-50"
            style={{ 
              borderColor: currentTheme.border,
              backgroundColor: currentTheme.surface, 
              color: currentTheme.textMain 
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onNextArticle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-xs"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <span>Next Article</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
