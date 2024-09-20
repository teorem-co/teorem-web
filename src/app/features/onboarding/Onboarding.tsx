import { RoleOptions } from '../../store/slices/roleSlice';
import { useAppSelector } from '../../store/hooks';
import useMount from '../../utils/useMount';
import { useHistory } from 'react-router';
import { ONBOARDING_PATHS, PATHS } from '../../routes';
import { ReactNode } from 'react';

interface IOnboardingProps {
    children?: ReactNode;
}

export default function Onboarding({ children }: Readonly<IOnboardingProps>) {
    const history = useHistory();
    const { user } = useAppSelector((state) => state.auth);

    const init = async () => {
        if (user?.Role.abrv !== RoleOptions.Tutor) {
            history.replace(PATHS.DASHBOARD);
            return;
        }

        history.replace(ONBOARDING_PATHS.TUTOR_ONBOARDING);
    };

    useMount(() => {
        init();
    });

    return <>{children}</>;
}
