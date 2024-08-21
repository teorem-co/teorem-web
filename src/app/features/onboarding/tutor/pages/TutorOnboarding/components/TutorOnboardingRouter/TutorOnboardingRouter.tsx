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

interface ITutorOnboardingRouterProps {
    step: number;
    substep: number;
    formik: any;
}

export default function TutorOnboardingRouter({ step, substep, formik }: Readonly<ITutorOnboardingRouterProps>) {
    if (step === 1) {
        switch (substep) {
            case 0:
                return <TutorOnboardingStartStep formik={formik} />;
            case 1:
                return <TutorOnboardingLessonsStep formik={formik} />;
            case 2:
                return <TutorOnboardingSubjectsStep formik={formik} />;
            case 3:
                return <TutorOnboardingAvailabilityStep formik={formik} />;

            default:
                return null;
        }
    }

    if (step === 2) {
        switch (substep) {
            case 0:
                return <TutorOnboardingProfileStep formik={formik} />;
            case 1:
                return <TutorOnboardingPhotoStep formik={formik} />;
            case 2:
                return <TutorOnboardingEducationStep formik={formik} />;
            case 3:
                return <TutorOnboardingTitleStep formik={formik} />;
            case 4:
                return <TutorOnboardingDescriptionStep formik={formik} />;
            case 5:
                return <TutorOnboardingVideoStep formik={formik} />;
            default:
                return null;
        }
    }

    if (step === 3) {
        switch (substep) {
            case 0:
                return <TutorOnboardingFinishingStep formik={formik} />;
            case 1:
                return <TutorOnboardingNotificationStep formik={formik} />;
            case 2:
                return <TutorOnboardingPriceStep formik={formik} />;
            case 3:
                return <TutorOnboardingEntityStep formik={formik} />;
            case 4:
                return <TutorOnboardingLegalInfoStep formik={formik} />;
            case 5:
                return <TutorOnboardingPayoutInfoStep formik={formik} />;
            case 6:
                return <TutorOnboardingAddressStep formik={formik} />;
            case 7:
                return <TutorOnboardingPublishStep formik={formik} />;
            default:
                return null;
        }
    }

    return null;
}
