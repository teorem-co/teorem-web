import { getAppState } from './getAppState';

export function isAuthenticated() {
    const { auth } = getAppState();
    return auth.token && auth.userId;
}
