import { RootState, store } from '../store/store';

export function getAppState(): RootState {
    return store.getState();
}
