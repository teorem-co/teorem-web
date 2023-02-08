import { Redirect } from 'react-router';

import { PATHS } from './routes';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';

export default function PermissionsGate(props: any) {
    const { children, roles } = props;
    const userRole = getUserRoleAbrv();
    const permissionGranted = roles.some((role: any) => role === userRole);

    if (!permissionGranted) {
        return <Redirect to={PATHS.LOGIN} />;
    }

    return <>{children}</>;
}
