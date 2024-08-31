import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingTitleStep.module.scss';

export default function TutorOnboardingTitleStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.TITLE.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.TITLE.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
