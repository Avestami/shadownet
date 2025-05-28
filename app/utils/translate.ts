import { translations } from '@/data/translations';

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations['en'];

export function translate(key: TranslationKey | string, language: Language = 'en'): string {
  const translationSet = translations[language] || translations['en'];
  return (translationSet as Record<string, string>)[key] || key;
}

export function getAvailableLanguages(): Language[] {
  return Object.keys(translations) as Language[];
} 