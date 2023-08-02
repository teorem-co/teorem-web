import { RootState, store } from '../store';

export function getAppState(): RootState {
    return store.getState();
}
