import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { useLazyGetProfileProgressQuery } from '../../../../../store/services/tutorService';
import useMount from '../../../../../utils/useMount';
import { PATHS } from '../../../../../routes';

export default function TutorOnboarding() {
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
