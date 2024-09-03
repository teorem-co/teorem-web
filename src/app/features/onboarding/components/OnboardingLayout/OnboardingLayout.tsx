import { ReactNode } from 'react';
import styles from './OnboardingLayout.module.scss';
import logo from '../../../../../assets/images/teorem-logo-black.png';
import ProgressBar from '../ProgressBar';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

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
    const { t } = useTranslation();
    console.log('step, substep, maxSubstep', step, substep, maxSubstep);
    return (
        <div className={styles.layout}>
            <div className={styles.headerContainer}>
                <img src={logo} alt="logo" className={styles.logo} />
                <div className={styles.header}>{header}</div>
            </div>
            <div className={styles.children}>{children}</div>
            <ProgressBar step={step} substep={substep} maxSubstep={maxSubstep} />
            <div className={styles.footer}>
                {step === 1 && substep === 0 ? null : (
                    <button className={styles.back} onClick={onBack}>
                        <span>{t('ONBOARDING.BACK')}</span>
                    </button>
                )}
                <div />
                <div className={clsx(styles.actions, { [styles.fullwidth]: step === 1 && substep === 0 })}>
                    {actions}
                </div>
            </div>
        </div>
    );
}
