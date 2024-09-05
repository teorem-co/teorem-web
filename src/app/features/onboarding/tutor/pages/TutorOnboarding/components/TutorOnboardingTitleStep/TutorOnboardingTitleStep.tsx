import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingTitleStep.module.scss';
import { Field } from 'formik';
import { TextField } from '@mui/material';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect } from 'react';

export default function TutorOnboardingTitleStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik } = useTutorOnboarding();

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.profileTitle);
    }, [formik.errors.profileTitle, setNextDisabled]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.TITLE.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.TITLE.SUBTITLE')}
        >
            <Field
                as={TextField}
                name="profileTitle"
                type="text"
                fullWidth
                error={formik.touched.profileTitle && !!formik.errors.profileDescription}
                helperText={formik.touched.profileTitle && formik.errors.profileTitle}
                id="profileTitle"
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                inputProps={{
                    maxLength: 50,
                }}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
            {formik.values.profileTitle?.length ?? 0} / 50
        </OnboardingStepFormLayout>
    );
}
