import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { EN_US } from './en-US/en-US';
import { HR_HR } from './hr-HR/hr-HR';

export default i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: EN_US,
            },
            hr: {
                translation: HR_HR,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });
