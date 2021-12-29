import { Redirect } from 'react-router';

export default function PermissionsGate(props: any) {
    const { children, role } = props;

    const permissionGranted = true;

    if (!permissionGranted) {
        return <Redirect to="/" />;
    }

    return <>{children}</>;
}
