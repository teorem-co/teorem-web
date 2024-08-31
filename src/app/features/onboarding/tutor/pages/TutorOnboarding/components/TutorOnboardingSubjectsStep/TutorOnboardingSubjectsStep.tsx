import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingSubjectsStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingSubjectsStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.SUBJECTS.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.SUBJECTS.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
