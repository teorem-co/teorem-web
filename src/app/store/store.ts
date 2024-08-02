import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import myProfileProgressReducer from '../features/my-profile/slices/myProfileSlice';
import authReducer from './slices/authSlice';
import childrenReducer from './slices/childrenSlice';
import langReducer from './slices/langSlice';
import parentRegisterReducer from './slices/parentRegisterSlice';
import roleReducer from './slices/roleSlice';
import studentRegisterReducer from './slices/studentRegisterSlice';
import tutorRegisterReducer from './slices/tutorRegisterSlice';
import userReducer from './slices/userSlice';
import { baseService } from './baseService';
import chatReducer from '../features/chat/slices/chatSlice';
import myReviewsReducer from '../features/myReviews/slices/MyReviewsSlice';
import { rtkQueryErrorLogger } from './middleware/rtkQueryErrorLogger';
import uploadFileReducer from './slices/tutorImageUploadSlice';
import signUpReducer from './slices/signUpSlice';
import onboardingReducer from './slices/onboardingSlice';
import scrollReducer from './slices/scrollSlice';
import searchFiltersReducer from './slices/searchFiltesSlice';
import creditsReducer from './slices/creditsSlice';
import timeZoneReducer from './slices/timeZoneSlice';
import countryMarketReducer from './slices/countryMarketSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: [
        'auth',
        'user',
        'role',
        'user',
        'myReviews',
        'tutorRegister',
        'parentRegisterSlice',
        'myProfileProgress',
        'lang',
        'searchFilters',
        'credits',
        'timeZone',
        'countryMarket',
    ],
};

const appReducer = combineReducers({
    [baseService.reducerPath]: baseService.reducer,
    auth: authReducer,
    role: roleReducer,
    user: userReducer,
    myReviews: myReviewsReducer,
    uploadFile: uploadFileReducer,
    tutorRegister: tutorRegisterReducer,
    studentRegister: studentRegisterReducer,
    parentRegister: parentRegisterReducer,
    children: childrenReducer,
    myProfileProgress: myProfileProgressReducer,
    chat: chatReducer,
    lang: langReducer,
    signUp: signUpReducer,
    onboarding: onboardingReducer,
    scroll: scrollReducer,
    searchFilters: searchFiltersReducer,
    credits: creditsReducer,
    timeZone: timeZoneReducer,
    countryMarket: countryMarketReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === 'USER_LOGOUT') {
        storage.removeItem('persist:root');

        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(baseService.middleware, rtkQueryErrorLogger),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
