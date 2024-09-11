import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPriceStep.module.scss';
import { useEffect, useState } from 'react';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';

export default function TutorOnboardingPriceStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (formik.values.price) {
            setNextDisabled?.(formik.values.price < 10);
        } else {
            setNextDisabled?.(true);
        }
    }, [setNextDisabled, formik.values.price]);

    return (
        <OnboardingLayout
            header={
                <Button
                    variant="outlined"
                    color="secondary"
                    className={onboardingStyles.questions}
                    onClick={() => setIsSidebarOpen(true)}
                >
                    {t('ONBOARDING.QUESTIONS')}
                </Button>
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext} disabled={nextDisabled}>
                    {t('ONBOARDING.NEXT')}
                </CtaButton>
            }
            isSidebarOpen={isSidebarOpen}
            onSidebarClose={() => setIsSidebarOpen(false)}
        >
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
        </OnboardingLayout>
    );
}
