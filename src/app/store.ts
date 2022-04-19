import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import myProfileProgressReducer from '../app/features/my-profile/slices/myProfileSlice';
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
import chatReducer from './features/chat/slices/chatSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'user', 'role', 'user', 'myReviews', 'tutorRegister', 'parentRegisterSlice', 'myProfileProgress'],
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
