import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingDescriptionStep.module.scss';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect } from 'react';
import { Field } from 'formik';
import TextArea from '../../../../../../../components/form/MyTextArea';

export default function TutorOnboardingDescriptionStep() {
    const { t } = useTranslation();

    const { setNextDisabled, setShowQuestions, formik } = useTutorOnboarding();

    useEffect(() => {
        setShowQuestions?.(true);
        setNextDisabled?.(!!formik.errors.profileDescription);
    }, [formik.errors.profileDescription, setNextDisabled, setShowQuestions]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.DESCRIPTION.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.DESCRIPTION.SUBTITLE')}
        >
            <Field
                as={TextArea}
                name="profileDescription"
                type="text"
                fullWidth
                error={formik.touched.profileDescription && !!formik.errors.profileDescription}
                helperText={formik.touched.profileDescription && formik.errors.profileDescription}
                id="profileDescription"
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                maxLength={300}
                className={styles.textArea}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
            {formik.values.profileDescription?.length ?? 0} / 300
        </OnboardingStepFormLayout>
    );
}
