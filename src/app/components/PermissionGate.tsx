import { Redirect } from 'react-router';

import { PATHS } from '../routes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { setLoginModalOpen } from '../store/slices/modalsSlice';

interface IPermissionsGateProps {
    children: ReactNode;
    roles: string[];
    checkStripeConnection?: boolean;
}

export default function PermissionsGate({ children, roles, checkStripeConnection }: Readonly<IPermissionsGateProps>) {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const permissionGranted = useMemo(() => roles.some((role: any) => role === user?.Role.abrv), [roles, user]);

    if (checkStripeConnection && !user?.stripeConnected) {
        return <Redirect to={PATHS.DASHBOARD} />;
    }

    if (!permissionGranted) {
        // dispatch(setLoginModalOpen(true));
    }

    return <>{children}</>;
}
