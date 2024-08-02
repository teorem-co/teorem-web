import { Redirect } from 'react-router';

import { PATHS } from '../routes';
import { useAppSelector } from '../store/hooks';
import { ReactNode } from 'react';

interface IPermissionsGateProps {
    children: ReactNode;
    roles: string[];
    checkStripeConnection?: boolean;
}

export default function PermissionsGate({ children, roles, checkStripeConnection }: Readonly<IPermissionsGateProps>) {
    const { user } = useAppSelector((state) => state.auth);
    const permissionGranted = roles.some((role: any) => role === user?.Role.abrv);

    if (checkStripeConnection && !user?.stripeConnected) {
        return <Redirect to={PATHS.DASHBOARD} />;
    }

    if (!permissionGranted) {
        return <Redirect to={PATHS.LOGIN} />;
    }

    return <>{children}</>;
}
