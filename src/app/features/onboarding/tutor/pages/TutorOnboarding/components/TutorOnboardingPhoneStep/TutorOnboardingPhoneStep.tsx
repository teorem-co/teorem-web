import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../../store/hooks';
import { useEffect, useRef, useState } from 'react';
import MyPhoneInput from '../../../../../../../components/form/MyPhoneInput';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';

export default function TutorOnboardingPhoneStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const set = useRef(false);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!set.current && !formik.values.phoneNumber) {
            formik.setFieldValue('phoneNumber', user?.phoneNumber ?? '');
            set.current = true;
        }
    }, [formik, user]);

    useEffect(() => {
        setNextDisabled?.(!formik.values.phoneNumber);
    }, [formik.values.phoneNumber, setNextDisabled]);

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
                title={t('ONBOARDING.TUTOR.PHONE.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.PHONE.SUBTITLE')}
                centerOnDesktop
            >
                <MyPhoneInput
                    form={formik}
                    name="phoneNumber"
                    field={formik.getFieldProps('phoneNumber')}
                    meta={formik.getFieldMeta('phoneNumber')}
                />
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
