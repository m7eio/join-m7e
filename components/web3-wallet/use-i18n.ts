import enUS from './locales/en-US';

const LOCALE_LIST = {
  'en-US': enUS,
};

export default function useI18n(locale = 'en-US') {
  const localeJSON = LOCALE_LIST[locale];

  return (id: string) => {
    if (localeJSON) {
      return localeJSON[id] || id;
    }

    return id;
  }
}
