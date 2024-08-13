import { ReactNode } from 'react';
import styles from './OnboardingLayout.module.scss';

interface IOnboardingLayoutProps {
    step?: number;
    children?: ReactNode;
    onBack?: () => void;
    actions?: ReactNode;
    header?: ReactNode;
}

export default function OnboardingLayout({ step, children, onBack, actions, header }: IOnboardingLayoutProps) {
    return (
        <div>
            <div className={styles.headerContainer}>
                <div className={styles.header}>{header}</div>
            </div>
            <div className={styles.children}>{children}</div>
            <div className={styles.footer}>
                <div className={styles.actions}>{actions}</div>
            </div>
        </div>
    );
}
