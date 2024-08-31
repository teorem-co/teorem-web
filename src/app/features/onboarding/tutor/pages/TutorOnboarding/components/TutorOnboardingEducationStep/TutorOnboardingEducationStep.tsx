import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingEducationStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingEducationStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.EDUCATION.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.EDUCATION.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
