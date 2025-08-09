import i18n from 'i18next'; // Import i18next as default
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enRoles from './locales/en/roles.json';
import enUsers from './locales/en/users.json';
import esAuth from './locales/es/auth.json';
import esCommon from './locales/es/common.json';
import esDashboard from './locales/es/dashboard.json';
import esRoles from './locales/es/roles.json';
import esUsers from './locales/es/users.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        common: enCommon,
        dashboard: enDashboard,
        users: enUsers,
        roles: enRoles,
      },
      es: {
        auth: esAuth,
        common: esCommon,
        dashboard: esDashboard,
        users: esUsers,
        roles: esRoles,
      },
    },
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
