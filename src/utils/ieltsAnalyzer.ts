import { Article, TestStats } from '../types';

export interface IeltsAnalysisResult {
  isIelts: boolean;
  taskType?: 'Task 1 Academic' | 'Task 2 Essay';
  wordCountTarget: number;
  wordCountAchieved: number;
  targetMet: boolean;
  estimatedBand: number;
  bandDescription: string;
  identifiedVocab: string[];
  cohesiveMarkersCount: number;
  feedbackPoints: string[];
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
  const wordCountAchieved = stats.completedWords;
  const targetMet = wordCountAchieved >= target;

  // Find academic words matched in text
  const textLower = article.text.toLowerCase();
  const identifiedVocab = COMMON_ACADEMIC_WORDS.filter((word) => 
    textLower.includes(word.toLowerCase())
  );

  // Band score estimation formula based on WPM, Accuracy, and word count target
  // IELTS computer-delivered tests recommend at least 45 WPM for Task 2 to draft, review, and edit within 40 min.
  let band = 6.0;

  if (stats.accuracy >= 98 && stats.wpm >= 65) {
    band = 9.0;
  } else if (stats.accuracy >= 96 && stats.wpm >= 55) {
    band = 8.5;
  } else if (stats.accuracy >= 94 && stats.wpm >= 45) {
    band = 8.0;
  } else if (stats.accuracy >= 90 && stats.wpm >= 38) {
    band = 7.5;
  } else if (stats.accuracy >= 85 && stats.wpm >= 30) {
    band = 7.0;
  } else if (stats.accuracy >= 80 && stats.wpm >= 25) {
    band = 6.5;
  } else {
    band = 6.0;
  }

  // Penalty if word target was not reached
  if (!targetMet && stats.wpm < 30) {
    band = Math.max(5.5, band - 0.5);
  }

  let bandDescription = 'Competent User';
  if (band >= 8.5) bandDescription = 'Expert User (Native Fluency & High Precision)';
  else if (band >= 8.0) bandDescription = 'Very Good User (Operational Command & Strong Lexical Flow)';
  else if (band >= 7.0) bandDescription = 'Good User (Effective Command with Occasional Inaccuracies)';
  else if (band >= 6.0) bandDescription = 'Competent User (Sufficient for Standard University Entry)';

  const feedbackPoints: string[] = [];
  if (stats.accuracy >= 97) {
    feedbackPoints.push('Outstanding lexical precision: minimal typos in complex academic terminology.');
  } else if (stats.accuracy < 92) {
    feedbackPoints.push('Watch academic spelling: In IELTS computer tests, misspellings degrade Lexical Resource score.');
  }

  if (stats.wpm >= 50) {
    feedbackPoints.push(`Strong typing velocity (${stats.wpm} WPM): leaves generous margin for proofreading in actual 20/40 min exam.`);
  } else {
    feedbackPoints.push(`Aim for 45+ WPM to ensure ample time for paragraph planning and cohesive revision.`);
  }

  if (stats.consistency >= 75) {
    feedbackPoints.push('Smooth rhythmic cadence: consistent keystroke cadence between clauses.');
  }

  return {
    isIelts,
    taskType: article.ieltsType,
    wordCountTarget: target,
    wordCountAchieved,
    targetMet,
    estimatedBand: band,
    bandDescription,
    identifiedVocab: Array.from(new Set([...identifiedVocab, ...(article.academicVocabulary || [])])),
    cohesiveMarkersCount: 8,
    feedbackPoints,
  };
}
