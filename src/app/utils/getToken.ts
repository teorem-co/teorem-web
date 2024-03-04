import { getAppState } from './getAppState';

export function getToken() {
    const { auth } = getAppState();
    return auth.token;
}
