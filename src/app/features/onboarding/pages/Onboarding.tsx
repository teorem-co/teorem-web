import { RoleOptions } from '../../../store/slices/roleSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import useMount from '../../../utils/useMount';
import { useHistory } from 'react-router';
import { ONBOARDING_PATHS } from '../../../routes';
import { ReactNode } from 'react';

interface IOnboardingProps {
    children?: ReactNode;
}

export default function Onboarding({ children }: IOnboardingProps) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { user } = useAppSelector((state) => state.auth);

    const init = async () => {
        switch (user?.Role.abrv) {
            case RoleOptions.Tutor:
                history.replace(ONBOARDING_PATHS.TUTOR_ONBOARDING);
                return;
            case RoleOptions.Parent:
                history.replace(ONBOARDING_PATHS.PARENT_ONBOARDING);
                return;
            case RoleOptions.Student:
                history.replace(ONBOARDING_PATHS.STUDENT_ONBOARDING);
                return;
            default:
                return;
        }
    };

    useMount(() => {
        init();
    });

    return <>{children}</>;
}
