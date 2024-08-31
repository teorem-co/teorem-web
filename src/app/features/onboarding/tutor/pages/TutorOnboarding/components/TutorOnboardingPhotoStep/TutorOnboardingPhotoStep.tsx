import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPhotoStep.module.scss';

export default function TutorOnboardingPhotoStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PHOTO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PHOTO.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
