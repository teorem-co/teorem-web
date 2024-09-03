import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPriceStep.module.scss';
import { useEffect } from 'react';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';

export default function TutorOnboardingPriceStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik } = useTutorOnboarding();

    useEffect(() => {
        if (formik.values.price) {
            setNextDisabled?.(formik.values.price < 10);
        } else {
            setNextDisabled?.(true);
        }
    }, [setNextDisabled, formik.values.price]);
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PRICE.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PRICE.SUBTITLE')}
        >
            <div className={styles.container}>
                <div>
                    <div className={styles.currency}>{t('ONBOARDING.TUTOR.PRICE.CURRENCY')}</div>
                    <input
                        className={styles.input}
                        type="number"
                        placeholder="10.00"
                        maxLength={6}
                        value={formik.values.price}
                        onChange={(e) => formik.setFieldValue('price', e.target.value)}
                    />
                </div>
                <div className={styles.description}>{t('ONBOARDING.TUTOR.PRICE.PRICE_BREAKDOWN_SHORT')}</div>
            </div>
        </OnboardingStepFormLayout>
    );
}
