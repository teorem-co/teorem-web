import React from 'react';
import styles from './OnboardingStepFormLayout.module.scss';
import Typography from '@mui/material/Typography';

interface IOnboardingStepFormLayoutProps {
    children?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}

export default function OnboardingStepFormLayout({
    children,
    title,
    subtitle,
}: Readonly<IOnboardingStepFormLayoutProps>) {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <Typography variant="h2" className={styles.title}>
                    {title}
                </Typography>
                {subtitle ? (
                    <Typography variant="body2" className={styles.subtitle}>
                        {subtitle}
                    </Typography>
                ) : (
                    subtitle
                )}
                {children}
            </div>
        </div>
    );
}
