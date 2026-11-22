import ar from './ar';
import en from './en';

export const DEFAULT_LANG = 'ar'; // اللغة الأساسية: العربية
export const LANG_STORAGE_KEY = 'mv-lang';
export const SUPPORTED_LANGS = ['ar', 'en'];

export const resources = { ar, en };

export const isRTL = (lang) => lang === 'ar';
