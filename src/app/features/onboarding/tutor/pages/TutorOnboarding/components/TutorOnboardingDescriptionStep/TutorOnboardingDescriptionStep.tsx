import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingDescriptionStep.module.scss';

export default function TutorOnboardingDescriptionStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.DESCRIPTION.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.DESCRIPTION.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
