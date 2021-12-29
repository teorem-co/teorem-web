import { getAppState } from './getAppState';

export function getUser() {
    const { auth } = getAppState();
    return auth.user;
}
