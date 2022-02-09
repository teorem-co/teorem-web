import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { combineReducers } from 'redux';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../slices/authSlice';
import childrenReducer from '../slices/childrenSlice';
import parentRegisterReducer from '../slices/parentRegisterSlice';
import roleReducer from '../slices/roleSlice';
import studentRegisterReducer from '../slices/studentRegisterSlice';
import tutorRegisterReducer from '../slices/tutorRegisterSlice';
import userReducer from '../slices/userSlice';
import { baseService } from './baseService';
import myReviewsReducer from './features/myReviews/slices/MyReviewsSlice';
import { rtkQueryErrorLogger } from './middleware/rtkQueryErrorLogger';
import uploadFileReducer from './slices/tutorImageUploadSlice';

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
    ],
};

const rootReducer = combineReducers({
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(baseService.middleware, rtkQueryErrorLogger),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
