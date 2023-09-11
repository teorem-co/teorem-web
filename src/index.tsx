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
import { persistor, store } from './app/store';
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
moment.fn = moment.utc().constructor.prototype;

ReactDOM.render(
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
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
