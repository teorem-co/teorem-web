import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import { TRANSLATIONS_EN } from './en/TRANSLATIONS_EN';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources: {
        en: {
            translation: TRANSLATIONS_EN
        }
    },
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});




