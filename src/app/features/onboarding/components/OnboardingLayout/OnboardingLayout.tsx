import { ReactNode } from 'react';
import styles from './OnboardingLayout.module.scss';
import logo from '../../../../../assets/images/teorem-logo-black.png';
import ProgressBar from '../ProgressBar';

interface IOnboardingLayoutProps {
    step?: number;
    children?: ReactNode;
    onBack?: () => void;
    actions?: ReactNode;
    header?: ReactNode;
}

export default function OnboardingLayout({ step, children, onBack, actions, header }: IOnboardingLayoutProps) {
    return (
        <div className={styles.layout}>
            <div className={styles.headerContainer}>
                <img src={logo} alt="logo" className="mt-5 ml-5 signup-logo" />
                <div className={styles.header}>{header}</div>
            </div>
            <div className={styles.children}>{children}</div>
            <ProgressBar step={step} maxStep={6} />
            <div className={styles.footer}>
                <button className={styles.back} onClick={onBack}>
                    <span>Back</span>
                </button>
                <div className={styles.actions}>{actions}</div>
            </div>
        </div>
    );
}
