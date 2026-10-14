import { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'cobalt-white',
    name: 'Cobalt & White',
    bg: '#f8fafc',
    surface: '#ffffff',
    textMuted: '#94a3b8',
    textMain: '#0f172a',
    primary: '#2563eb',
    secondary: '#3b82f6',
    error: '#ef4444',
    errorExtra: '#b91c1c',
    caret: '#2563eb',
    border: '#e2e8f0',
  },
  {
    id: 'oxford-blue',
    name: 'Oxford Academic',
    bg: '#f1f5f9',
    surface: '#ffffff',
    textMuted: '#64748b',
    textMain: '#1e293b',
    primary: '#1e40af',
    secondary: '#0284c7',
    error: '#e11d48',
    errorExtra: '#9f1239',
    caret: '#1e40af',
    border: '#cbd5e1',
  },
  {
    id: 'ocean-glacier',
    name: 'Glacier Sky',
    bg: '#f0f9ff',
    surface: '#ffffff',
    textMuted: '#94a3b8',
    textMain: '#0c4a6e',
    primary: '#0284c7',
    secondary: '#38bdf8',
    error: '#f43f5e',
    errorExtra: '#be123c',
    caret: '#0284c7',
    border: '#bae6fd',
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Navy & White',
    bg: '#0a1128',
    surface: '#111d40',
    textMuted: '#5b73a8',
    textMain: '#ffffff',
    primary: '#38bdf8',
    secondary: '#60a5fa',
    error: '#fb7185',
    errorExtra: '#f43f5e',
    caret: '#38bdf8',
    border: '#1f3160',
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
