import { getAppState } from './getAppState';

export function getUserId() {
    const { auth } = getAppState();
    return auth.user?.id;
}
