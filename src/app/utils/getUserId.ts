import { getAppState } from './getAppState';

export function getUserId() {
    const { user } = getAppState();
    return user.user?.id;
}
