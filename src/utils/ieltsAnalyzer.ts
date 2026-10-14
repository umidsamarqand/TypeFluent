import { Article, TestStats } from '../types';

export interface IeltsCriterionScore {
  name: string;
  score: number;
  weight: string;
  comment: string;
}

export interface IeltsAnalysisResult {
  isIelts: boolean;
  taskType?: 'Task 1 Academic' | 'Task 2 Essay';
  wordCountTarget: number;
  wordCountAchieved: number;
  targetMet: boolean;
  estimatedBand: number;
  bandDescription: string;
  criteria: IeltsCriterionScore[];
  identifiedVocab: string[];
  examPacing: {
    typingTimeMinutes: number;
    recommendedPlanningTimeMinutes: number;
    bufferForRevisionMinutes: number;
    verdict: string;
  };
  strengths: string[];
  improvementAreas: string[];
}

export interface GeneralArticleAnalysis {
  readabilityLevel: string;
  avgWordLength: number;
  speedTier: string;
  typingEfficiency: string;
  frequentMistakeKeys: string[];
  keyCollocations: string[];
  insight: string;
}

const COMMON_ACADEMIC_WORDS = [
  'exponential', 'predominant', 'fluctuation', 'subsequent', 'outstripped', 'trajectory',
  'marked', 'consistently', 'consumption', 'agricultural', 'disproportionate', 'constituted',
  'marginal', 'predominate', 'semi-permeable', 'pressurization', 'filtration', 'potable',
  'algorithmic', 'disruption', 'mitigate', 'collaboration', 'indispensable', 'symbiosis',
  'meritocracy', 'socioeconomic', 'fiscal', 'subsidize', 'proportionate', 'alleviate',
  'equitable', 'systemic', 'statutory', 'sustainable', 'imperative', 'mitigation',
  'carbon-intensive', 'catalyst', 'consequently', 'furthermore', 'notwithstanding',
  'juxtaposition', 'manifest', 'delineates', 'synthesize', 'unprecedented', 'primordial'
];

export function analyzeIeltsTyping(article: Article, stats: TestStats): IeltsAnalysisResult {
  const isIelts = article.category === 'ielts-task1' || article.category === 'ielts-task2';
  const target = article.category === 'ielts-task1' ? 150 : 250;
  const examDuration = article.category === 'ielts-task1' ? 20 : 40;
  const wordCountAchieved = stats.completedWords;
  const targetMet = wordCountAchieved >= target;

  // Identify academic vocabulary
  const textLower = article.text.toLowerCase();
  const matchedVocab = COMMON_ACADEMIC_WORDS.filter((w) => textLower.includes(w.toLowerCase()));
  const allVocab = Array.from(new Set([...matchedVocab, ...(article.academicVocabulary || [])]));

  // Calculate Criterion 1: Task Achievement / Response
  let taskScore = 7.0;
  if (targetMet && stats.wpm >= 50) taskScore = 9.0;
  else if (targetMet && stats.wpm >= 40) taskScore = 8.5;
  else if (targetMet && stats.wpm >= 32) taskScore = 8.0;
  else if (wordCountAchieved >= target * 0.8) taskScore = 7.0;
  else taskScore = 6.0;

  // Calculate Criterion 2: Coherence & Cohesion (Cadence & Consistency)
  let coherenceScore = 7.0;
  if (stats.consistency >= 88 && stats.wpm >= 45) coherenceScore = 9.0;
  else if (stats.consistency >= 80 && stats.wpm >= 38) coherenceScore = 8.5;
  else if (stats.consistency >= 72) coherenceScore = 8.0;
  else if (stats.consistency >= 60) coherenceScore = 7.0;
  else coherenceScore = 6.5;

  // Calculate Criterion 3: Lexical Resource (Precision & AWL Collocations)
  let lexicalScore = 7.0;
  if (stats.accuracy >= 98 && allVocab.length >= 4) lexicalScore = 9.0;
  else if (stats.accuracy >= 95 && allVocab.length >= 3) lexicalScore = 8.5;
  else if (stats.accuracy >= 91) lexicalScore = 8.0;
  else if (stats.accuracy >= 85) lexicalScore = 7.0;
  else lexicalScore = 6.0;

  // Calculate Criterion 4: Grammatical Accuracy & Keystroke Precision
  let grammarScore = 7.0;
  if (stats.accuracy >= 97) grammarScore = 9.0;
  else if (stats.accuracy >= 94) grammarScore = 8.5;
  else if (stats.accuracy >= 89) grammarScore = 8.0;
  else if (stats.accuracy >= 82) grammarScore = 7.0;
  else grammarScore = 6.0;

  // Raw average and rounded to nearest 0.5
  const rawAvg = (taskScore + coherenceScore + lexicalScore + grammarScore) / 4;
  const estimatedBand = Math.round(rawAvg * 2) / 2;

  let bandDescription = 'Competent Operational Fluency';
  if (estimatedBand >= 8.5) bandDescription = 'Expert User (Fully Operational & Native Precision)';
  else if (estimatedBand >= 8.0) bandDescription = 'Very Good User (Sophisticated Fluency & Strong Lexical Range)';
  else if (estimatedBand >= 7.0) bandDescription = 'Good User (Effective Command with Occasional Hesitation)';
  else if (estimatedBand >= 6.0) bandDescription = 'Competent User (Meets General University Entry Threshold)';

  // Exam Pacing Analysis: In actual exam, how long to type this word target?
  const effectiveWpm = Math.max(stats.wpm, 15);
  const typingTimeMinutes = Math.round((target / effectiveWpm) * 10) / 10;
  const recommendedPlanningTime = article.category === 'ielts-task1' ? 4 : 8;
  const bufferRemaining = Math.max(0, Math.round((examDuration - typingTimeMinutes - recommendedPlanningTime) * 10) / 10);

  let pacingVerdict = '';
  if (bufferRemaining >= 10) {
    pacingVerdict = `Excellent speed: At ${stats.wpm} WPM, drafting requires only ~${typingTimeMinutes} min, leaving ${bufferRemaining} min for outlining and revising.`;
  } else if (bufferRemaining >= 4) {
    pacingVerdict = `Adequate pacing: Leaves ${bufferRemaining} min for proofreading. Aim for 50+ WPM to create a wider margin.`;
  } else {
    pacingVerdict = `Tight timeline: Typing velocity of ${stats.wpm} WPM consumes most of the exam window, risking uncorrected errors.`;
  }

  const criteria: IeltsCriterionScore[] = [
    {
      name: article.category === 'ielts-task1' ? 'Task Achievement' : 'Task Response',
      score: taskScore,
      weight: '25%',
      comment: targetMet 
        ? `Surpassed required ${target} words with sufficient production rate.`
        : `Generated ${wordCountAchieved} words; must hit ${target} words to avoid scoring penalty.`,
    },
    {
      name: 'Coherence & Cohesion',
      score: coherenceScore,
      weight: '25%',
      comment: stats.consistency >= 78 
        ? 'High structural fluidity with consistent rhythmic phrasing between clauses.' 
        : 'Intermittent keystroke pauses indicate hesitations on transitional markers.',
    },
    {
      name: 'Lexical Resource',
      score: lexicalScore,
      weight: '25%',
      comment: stats.accuracy >= 94 
        ? `Accurate spelling of ${allVocab.length} academic collocations with zero fatal slips.` 
        : 'Spelling mistakes in academic vocabulary will detract from Band 8/9 potential.',
    },
    {
      name: 'Grammatical Accuracy',
      score: grammarScore,
      weight: '25%',
      comment: `Overall keystroke accuracy of ${stats.accuracy}% ensures clear syntactic transmission.`,
    },
  ];

  const strengths: string[] = [];
  const improvementAreas: string[] = [];

  if (stats.wpm >= 50) strengths.push(`Fast keystroke velocity (${stats.wpm} WPM) enables comprehensive expansion of arguments.`);
  if (stats.accuracy >= 96) strengths.push(`Exceptional precision (${stats.accuracy}% accuracy) minimizes cognitive friction during computer-based exam.`);
  if (stats.consistency >= 80) strengths.push(`Solid rhythmic consistency (${stats.consistency}%) reflects confident typing cadence.`);

  if (stats.accuracy < 94) improvementAreas.push(`Refine academic word spelling accuracy: typos in specialized words diminish Lexical Resource scores.`);
  if (stats.wpm < 45) improvementAreas.push(`Accelerate typing to 45+ WPM to ensure at least 5 minutes for re-reading and editing.`);
  if (stats.consistency < 75) improvementAreas.push(`Work on steady rhythm across punctuation to avoid abrupt stop-start typing.`);

  return {
    isIelts,
    taskType: article.ieltsType,
    wordCountTarget: target,
    wordCountAchieved,
    targetMet,
    estimatedBand,
    bandDescription,
    criteria,
    identifiedVocab: allVocab,
    examPacing: {
      typingTimeMinutes,
      recommendedPlanningTimeMinutes: recommendedPlanningTime,
      bufferForRevisionMinutes: bufferRemaining,
      verdict: pacingVerdict,
    },
    strengths,
    improvementAreas,
  };
}

export function analyzeGeneralArticle(article: Article, stats: TestStats): GeneralArticleAnalysis {
  const avgLen = Math.round((article.text.length / Math.max(1, article.wordCount)) * 10) / 10;
  
  let speedTier = 'Proficient';
  if (stats.wpm >= 80) speedTier = 'Elite Master (Top 3%)';
  else if (stats.wpm >= 60) speedTier = 'Advanced Professional (Top 15%)';
  else if (stats.wpm >= 45) speedTier = 'Fluent Touch Typist (Top 35%)';
  else if (stats.wpm >= 30) speedTier = 'Competent Typist';
  else speedTier = 'Developing Velocity';

  let efficiency = 'High Keystroke Economy';
  if (stats.accuracy >= 97) efficiency = 'Superior Motor Precision';
  else if (stats.accuracy < 90) efficiency = 'High Error Friction (Needs Slowed Pacing)';

  // Frequent mistake keys
  const errorKeyEntries = Object.entries(stats.errorKeys || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, count]) => `'${k}' (${count}x)`);

  return {
    readabilityLevel: 'Advanced Academic / Publication Standard',
    avgWordLength: avgLen,
    speedTier,
    typingEfficiency: efficiency,
    frequentMistakeKeys: errorKeyEntries,
    keyCollocations: article.academicVocabulary || [],
    insight: stats.wpm >= 50
      ? `You navigated authentic high-density journalism at ${stats.wpm} WPM with ${stats.accuracy}% accuracy, well above average reader speeds.`
      : `Practicing with authentic intellectual prose trains finger muscle memory on complex polysyllabic English words.`,
  };
}
