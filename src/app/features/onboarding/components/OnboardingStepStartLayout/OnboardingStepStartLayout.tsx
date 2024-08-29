import { ReactNode } from 'react';
import styles from './OnboardingStepStartLayout.module.scss';

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
                <div className={styles.title}>{title}</div>
                <div className={styles.description}>{description}</div>
            </div>
            <div className={styles.imageContainer}>
                <img className={styles.image} src={imageSrc} alt={imageSrc} />
            </div>
        </div>
    );
}
