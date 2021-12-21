import { store, RootState } from '../store';

export function getAppState(): RootState {
    return store.getState();
};

export function getToken() {
    const { auth } = getAppState();
    return auth.token;
};