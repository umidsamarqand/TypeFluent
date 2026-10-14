import { Theme } from '../types';

export const MIDNIGHT_NAVY_THEME: Theme = {
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
  border: '#1e2f5c',
};

export const THEMES: Theme[] = [MIDNIGHT_NAVY_THEME];

export function getTheme(_id?: string): Theme {
  return MIDNIGHT_NAVY_THEME;
}
