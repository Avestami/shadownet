import { translations } from '@/data/translations';

export function translate(key: string, language: string = 'en'): string {
  const translationSet = translations[language] || translations['en'];
  return translationSet[key] || key;
}

export function getAvailableLanguages(): string[] {
  return Object.keys(translations);
} 