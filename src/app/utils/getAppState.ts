import { store, RootState } from '../store';

export function getAppState(): RootState {
    return store.getState();
};