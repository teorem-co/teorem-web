import { TFunction } from 'react-i18next';
import { useTutorOnboarding } from './providers/TutorOnboardingProvider';
import TutorOnboardingAddressStep from './components/TutorOnboardingAddressStep';
import TutorOnboardingAvailabilityStep from './components/TutorOnboardingAvailabilityStep';
import TutorOnboardingDescriptionStep from './components/TutorOnboardingDescriptionStep';
import TutorOnboardingEducationStep from './components/TutorOnboardingEducationStep';
import TutorOnboardingEntityStep from './components/TutorOnboardingEntityStep';
import TutorOnboardingFinishingStep from './components/TutorOnboardingFinishingStep';
import TutorOnboardingLegalInfoStep from './components/TutorOnboardingLegalInfoStep';
import TutorOnboardingLessonsStep from './components/TutorOnboardingLessonsStep';
import TutorOnboardingNotificationStep from './components/TutorOnboardingNotificationStep';
import TutorOnboardingPayoutInfoStep from './components/TutorOnboardingPayoutInfoStep';
import TutorOnboardingPhoneStep from './components/TutorOnboardingPhoneStep';
import TutorOnboardingPhotoStep from './components/TutorOnboardingPhotoStep';
import TutorOnboardingPriceStep from './components/TutorOnboardingPriceStep';
import TutorOnboardingProfileStep from './components/TutorOnboardingProfileStep';
import TutorOnboardingPublishStep from './components/TutorOnboardingPublishStep';
import TutorOnboardingStartStep from './components/TutorOnboardingStartStep';
import TutorOnboardingSubjectsStep from './components/TutorOnboardingSubjectsStep';
import TutorOnboardingTitleStep from './components/TutorOnboardingTitleStep';
import TutorOnboardingVideoStep from './components/TutorOnboardingVideoStep';

function getCtaText(t: TFunction<'translation', undefined>, step: number, substep: number) {
    if (step === 1 && substep === 0) {
        return t('ONBOARDING.GET_STARTED');
    }

    if (step === 3 && substep === 7) {
        return t('ONBOARDING.PUBLISH');
    }
    return t('ONBOARDING.NEXT');
}

export default function TutorOnboarding() {
    const { step, substep } = useTutorOnboarding();
    if (step === 1) {
        switch (substep) {
            case 0:
                return <TutorOnboardingStartStep />;
            case 1:
                return <TutorOnboardingLessonsStep />;
            case 2:
                return <TutorOnboardingSubjectsStep />;
            case 3:
                return <TutorOnboardingAvailabilityStep />;

            default:
                return null;
        }
    }

    if (step === 2) {
        switch (substep) {
            case 0:
                return <TutorOnboardingProfileStep />;
            case 1:
                return <TutorOnboardingPhotoStep />;
            case 2:
                return <TutorOnboardingEducationStep />;
            case 3:
                return <TutorOnboardingTitleStep />;
            case 4:
                return <TutorOnboardingDescriptionStep />;
            case 5:
                return <TutorOnboardingVideoStep />;
            default:
                return null;
        }
    }

    if (step === 3) {
        switch (substep) {
            case 0:
                return <TutorOnboardingFinishingStep />;
            case 1:
                return <TutorOnboardingNotificationStep />;
            case 2:
                return <TutorOnboardingPriceStep />;
            case 3:
                return <TutorOnboardingEntityStep />;
            case 4:
                return <TutorOnboardingLegalInfoStep />;
            case 5:
                return <TutorOnboardingPayoutInfoStep />;
            case 6:
                return <TutorOnboardingAddressStep />;
            case 7:
                return <TutorOnboardingPhoneStep />;
            case 8:
                return <TutorOnboardingPublishStep />;
            default:
                return null;
        }
    }

    return null;
}
