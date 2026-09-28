import { ui, defaultLang } from './ui';

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLocalizedPath(currentPath: string, targetLang: 'zh' | 'en'): string {
  const isEn = currentPath.startsWith('/en');
  if (targetLang === 'en') {
    if (isEn) return currentPath;
    return `/en${currentPath === '/' ? '' : currentPath}`;
  } else {
    if (!isEn) return currentPath;
    const stripped = currentPath.replace(/^\/en/, '');
    return stripped === '' ? '/' : stripped;
  }
}

export { getLocalizedProjects } from '../data/projects';
