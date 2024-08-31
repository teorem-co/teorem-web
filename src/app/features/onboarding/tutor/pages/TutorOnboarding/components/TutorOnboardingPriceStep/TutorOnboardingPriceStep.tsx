import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPriceStep.module.scss';

export default function TutorOnboardingPriceStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PRICE.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PRICE.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
