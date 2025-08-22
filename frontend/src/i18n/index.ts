import i18n from 'i18next'; // Import i18next as default
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enMap from './locales/en/map.json';
import enMunicipalities from './locales/en/municipalities.json';
import enOrganisms from './locales/en/organisms.json';
import enParishes from './locales/en/parishes.json';
import enRoles from './locales/en/roles.json';
import enStates from './locales/en/states.json';
import enUsers from './locales/en/users.json';
import esAuth from './locales/es/auth.json';
import esCommon from './locales/es/common.json';
import esDashboard from './locales/es/dashboard.json';
import esMap from './locales/es/map.json';
import esMunicipalities from './locales/es/municipalities.json';
import esOrganisms from './locales/es/organisms.json';
import esParishes from './locales/es/parishes.json';
import esRoles from './locales/es/roles.json';
import esStates from './locales/es/states.json';
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
        map: enMap,
        municipalities: enMunicipalities,
        organisms: enOrganisms,
        parishes: enParishes,
        roles: enRoles,
        states: enStates,
        users: enUsers,
      },
      es: {
        auth: esAuth,
        common: esCommon,
        dashboard: esDashboard,
        map: esMap,
        municipalities: esMunicipalities,
        organisms: esOrganisms,
        parishes: esParishes,
        roles: esRoles,
        states: esStates,
        users: esUsers,
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
