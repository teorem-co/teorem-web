import { getAppState } from './getAppState';

export function getUserRoleAbrv() {
    const { auth } = getAppState();
    return auth.user?.Role?.abrv;
}
