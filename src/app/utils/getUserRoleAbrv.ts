import { getAppState } from './getAppState';

export function getUserRoleAbrv() {
    const { user } = getAppState();
    return user.user?.role?.abrv;
}
