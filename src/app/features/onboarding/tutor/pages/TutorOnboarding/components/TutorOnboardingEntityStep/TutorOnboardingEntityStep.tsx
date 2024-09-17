import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect, useState } from 'react';
import OnboardingTabButton from '../../../../../components/OnboardingTabButton';
import privateEntityImage from './assets/person.png';
import companyImage from './assets/company.png';
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import styles from './TutorOnboardingEntityStep.module.scss';

export default function TutorOnboardingEntityStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setNextDisabled?.(formik.values.isCompany === null || !checked);
    }, [setNextDisabled, formik.values.isCompany, checked]);

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
            <OnboardingStepFormLayout title={t('ONBOARDING.TUTOR.ENTITY.TITLE')} centerOnDesktop>
                <OnboardingTabButton
                    active={formik.values.isCompany === false}
                    onClick={() => {
                        formik.setFieldValue('isCompany', false);
                    }}
                    title={t('ONBOARDING.TUTOR.ENTITY.PRIVATE_ENTITY_TITLE')}
                    subtitle={t('ONBOARDING.TUTOR.ENTITY.PRIVATE_ENTITY_SUBTITLE')}
                    image={privateEntityImage}
                />
                <OnboardingTabButton
                    active={formik.values.isCompany === true}
                    onClick={() => {
                        formik.setFieldValue('isCompany', true);
                    }}
                    title={t('ONBOARDING.TUTOR.ENTITY.COMPANY_ENTITY_TITLE')}
                    subtitle={t('ONBOARDING.TUTOR.ENTITY.COMPANY_ENTITY_SUBTITLE')}
                    image={companyImage}
                />
                <FormControlLabel
                    className={styles.consent}
                    control={
                        <Checkbox checked={checked} className={styles.check} onClick={() => setChecked((c) => !c)} />
                    }
                    label={
                        <div className={styles.consent}>
                            {t('ONBOARDING.TUTOR.ENTITY.CHECKBOX_AGREE')}{' '}
                            <a
                                target="_blank"
                                href="https://stripe.com/en-hr/legal/connect-account"
                                rel="noopener noreferrer"
                            >
                                {t('ONBOARDING.TUTOR.ENTITY.CHECKBOX_TERMS')}
                            </a>
                            .
                        </div>
                    }
                />
                {formik.touched?.isCompany && formik.errors?.isCompany ? (
                    <div className="field__validation">{formik.errors.isCompany}</div>
                ) : null}
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
