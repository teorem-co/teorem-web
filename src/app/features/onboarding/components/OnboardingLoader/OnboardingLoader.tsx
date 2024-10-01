import Skeleton from '@mui/material/Skeleton';
import styles from './OnboardingLoader.module.scss';

export default function OnboardingLoader() {
    return (
        <div className={styles.loader}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    <Skeleton variant="circular" width={'15vw'} height={'15vw'} />
                    <div>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                    </div>
                </div>
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
                <Skeleton variant="rounded" />
            </div>
        </div>
    );
}
