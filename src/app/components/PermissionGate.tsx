import { Redirect } from 'react-router';

import { PATHS } from '../routes';
import { useAppSelector } from '../store/hooks';
import { ReactNode, useMemo } from 'react';

interface IPermissionsGateProps {
    children: ReactNode;
    roles: string[];
    checkStripeConnection?: boolean;
}

export default function PermissionsGate({ children, roles, checkStripeConnection }: Readonly<IPermissionsGateProps>) {
    const { user } = useAppSelector((state) => state.auth);
    const permissionGranted = useMemo(() => roles.some((role: any) => role === user?.Role.abrv), [roles, user]);

    if (checkStripeConnection && !user?.stripeConnected) {
        return <Redirect to={PATHS.DASHBOARD} />;
    }

    if (!permissionGranted) {
        // dispatch(setLoginModalOpen(true));
    }

    return <>{children}</>;
}
