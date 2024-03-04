import { Redirect } from 'react-router';

import { PATHS } from './routes';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';
import { useAppSelector } from './hooks';

export default function PermissionsGate(props: any) {
    const { children, roles, checkStripeConnection } = props;
    const userRole = getUserRoleAbrv();
    const permissionGranted = roles.some((role: any) => role === userRole);
    const user = useAppSelector((state) => state.auth.user);
    if (checkStripeConnection && !user?.stripeConnected) {
        return <Redirect to={PATHS.DASHBOARD} />;
    }

    if (!permissionGranted) {
        return <Redirect to={PATHS.LOGIN} />;
    }

    return <>{children}</>;
}
