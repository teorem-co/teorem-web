import { ReactNode } from 'react';
import styles from './OnboardingLayout.module.scss';
import logo from '../../../../../assets/images/teorem-logo-black.png';
import ProgressBar from '../ProgressBar';

interface IOnboardingLayoutProps {
    step?: number;
    substep?: number;
    maxSubstep?: number;
    children?: ReactNode;
    onBack?: () => void;
    actions?: ReactNode;
    header?: ReactNode;
}

export default function OnboardingLayout({
    step,
    substep,
    maxSubstep,
    children,
    onBack,
    actions,
    header,
}: Readonly<IOnboardingLayoutProps>) {
    return (
        <div className={styles.layout}>
            <div className={styles.headerContainer}>
                <img src={logo} alt="logo" className={styles.logo} />
                <div className={styles.header}>{header}</div>
            </div>
            <div className={styles.children}>{children}</div>
            <ProgressBar step={step} substep={substep} maxSubstep={maxSubstep} />
            <div className={styles.footer}>
                <button className={styles.back} onClick={onBack}>
                    <span>Back</span>
                </button>
                <div className={styles.actions}>{actions}</div>
            </div>
        </div>
    );
}
