import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import TutorOnboardingAddressStep from '../TutorOnboardingAddressStep';
import TutorOnboardingAvailabilityStep from '../TutorOnboardingAvailabilityStep';
import TutorOnboardingDescriptionStep from '../TutorOnboardingDescriptionStep';
import TutorOnboardingEducationStep from '../TutorOnboardingEducationStep';
import TutorOnboardingEntityStep from '../TutorOnboardingEntityStep';
import TutorOnboardingFinishingStep from '../TutorOnboardingFinishingStep';
import TutorOnboardingLegalInfoStep from '../TutorOnboardingLegalInfoStep';
import TutorOnboardingLessonsStep from '../TutorOnboardingLessonsStep';
import TutorOnboardingNotificationStep from '../TutorOnboardingNotificationStep';
import TutorOnboardingPayoutInfoStep from '../TutorOnboardingPayoutInfoStep';
import TutorOnboardingPhotoStep from '../TutorOnboardingPhotoStep';
import TutorOnboardingPriceStep from '../TutorOnboardingPriceStep';
import TutorOnboardingProfileStep from '../TutorOnboardingProfileStep';
import TutorOnboardingPublishStep from '../TutorOnboardingPublishStep';
import TutorOnboardingStartStep from '../TutorOnboardingStartStep';
import TutorOnboardingSubjectsStep from '../TutorOnboardingSubjectsStep';
import TutorOnboardingTitleStep from '../TutorOnboardingTitleStep';
import TutorOnboardingVideoStep from '../TutorOnboardingVideoStep';

export default function TutorOnboardingRouter() {
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
                return <TutorOnboardingPublishStep />;
            default:
                return null;
        }
    }

    return null;
}
