import { ReactNode } from 'react';
import styles from './OnboardingStepStartLayout.module.scss';
import Typography from '@mui/material/Typography';

interface IOnboardingStepStartLayoutProps {
    stepLabel: ReactNode;
    title: ReactNode;
    description: ReactNode;
    imageSrc: string;
}

export default function OnboardingStepStartLayout({
    stepLabel,
    title,
    description,
    imageSrc,
}: Readonly<IOnboardingStepStartLayoutProps>) {
    return (
        <div className={styles.layout}>
            <div className={styles.textContainer}>
                <div className={styles.stepLabel}>{stepLabel}</div>
                <Typography variant="h1" className={styles.title}>
                    {title}
                </Typography>
                <Typography variant="body2" className={styles.description}>
                    {description}
                </Typography>
            </div>
            <div className={styles.imageContainer}>
                <img className={styles.image} src={imageSrc} alt={imageSrc} />
            </div>
        </div>
    );
}
