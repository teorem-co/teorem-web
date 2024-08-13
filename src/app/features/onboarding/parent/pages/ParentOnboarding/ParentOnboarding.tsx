import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { useLazyGetProfileProgressQuery } from '../../../../../store/services/tutorService';
import { PATHS } from '../../../../../routes';
import useMount from '../../../../../utils/useMount';

export default function ParentOnboarding() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { percentage: profileProgressPercentage } = useAppSelector((state) => state.myProfileProgress);
    const [getProfileProgress] = useLazyGetProfileProgressQuery();

    const init = async () => {
        const percentage = profileProgressPercentage ?? (await getProfileProgress().unwrap());
        if (percentage === 100) {
            return history.replace(PATHS.DASHBOARD);
        }
    };

    useMount(() => {
        init();
    });

    return <div></div>;
}
