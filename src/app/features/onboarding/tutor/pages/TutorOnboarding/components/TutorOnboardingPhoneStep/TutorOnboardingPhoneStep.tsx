import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../../store/hooks';
import { useEffect, useRef } from 'react';
import MyPhoneInput from '../../../../../../../components/form/MyPhoneInput';

export default function TutorOnboardingPhoneStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, setShowQuestions } = useTutorOnboarding();
    const set = useRef(false);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!set.current && !formik.values.phoneNumber) {
            formik.setFieldValue('phoneNumber', user?.phoneNumber ?? '');
            set.current = true;
        }
    }, [formik, user]);

    useEffect(() => {
        setShowQuestions?.(true);
        setNextDisabled?.(!formik.values.phoneNumber);
    }, [formik.values.phoneNumber, setNextDisabled, setShowQuestions]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PHONE.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PHONE.SUBTITLE')}
        >
            <MyPhoneInput
                form={formik}
                name="phoneNumber"
                field={formik.getFieldProps('phoneNumber')}
                meta={formik.getFieldMeta('phoneNumber')}
            />
        </OnboardingStepFormLayout>
    );
}
