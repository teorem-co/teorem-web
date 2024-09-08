import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../../store/hooks';
import { useEffect, useRef } from 'react';
import MyPhoneInput from '../../../../../../../components/form/MyPhoneInput';

export default function TutorOnboardingPhoneStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik } = useTutorOnboarding();
    const set = useRef(false);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!set.current && !formik.values.phone) {
            formik.setFieldValue('phone', user?.phoneNumber ?? '');
            set.current = true;
        }
    }, [formik, user]);

    useEffect(() => {
        setNextDisabled?.(!formik.values.phone);
    }, [formik.values.phone, setNextDisabled]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PHONE.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PHONE.SUBTITLE')}
        >
            <MyPhoneInput
                form={formik}
                name="phone"
                field={formik.getFieldProps('phone')}
                meta={formik.getFieldMeta('phone')}
            />
        </OnboardingStepFormLayout>
    );
}
