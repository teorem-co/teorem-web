import React from 'react';
import styles from './OnboardingStepFormLayout.module.scss';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';

interface IOnboardingStepFormLayoutProps {
    children?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    className?: string;
}

export default function OnboardingStepFormLayout({
    children,
    title,
    subtitle,
    className,
}: Readonly<IOnboardingStepFormLayoutProps>) {
    return (
        <div className={clsx(styles.container, className)}>
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
