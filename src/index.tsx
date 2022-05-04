import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-phone-input-2/lib/style.css';
import './styles/App.scss';
import 'rc-time-picker/assets/index.css';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { persistor, store } from './app/store';
import { EN_US } from './locales/en-US/en-US';
import { HR_HR } from './locales/hr-HR/hr-HR';
//import i18n from './locales/localizationService';
import * as serviceWorker from './serviceWorker';

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
        detection: {
            order: ['path'],
        },
    });

const loadingMarkup = (
    <div className="py-4 text-center">
      <h3>Loading..</h3>
    </div>
  );

ReactDOM.render(
    <Suspense fallback={loadingMarkup}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router
                    getUserConfirmation={() => {
                        /* Empty callback to block the default browser prompt */
                    }}
                >
                    <App />
                    <ToastContainer />
                </Router>
            </PersistGate>
        </Provider>
    </Suspense>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();