import './locales/localizationService';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-phone-input-2/lib/style.css';
import './styles/App.scss';
import 'rc-time-picker/assets/index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { persistor, store } from './app/store/store';
import * as serviceWorker from './serviceWorker';
import AuthWrapper from './app/features/auth/providers/AuthWrapper';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import THEME from './app/constants/theme';
import React from 'react';
import * as Sentry from '@sentry/react';
import packageJson from '../package.json';

Sentry.init({
    dsn: 'https://d7c3c09b4739af90e6101c3974ec8ad9@o4507770093109248.ingest.de.sentry.io/4507770509852752',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    environment: process.env.REACT_APP_ENV,
    release: `${packageJson.name}@${packageJson.version}`,
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/api.teorem\.co/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={THEME}>
                    <AuthWrapper>
                        <Router
                            getUserConfirmation={() => {
                                /* Empty callback to block the default browser prompt */
                            }}
                        >
                            <App />
                            <ToastContainer />
                        </Router>
                    </AuthWrapper>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
