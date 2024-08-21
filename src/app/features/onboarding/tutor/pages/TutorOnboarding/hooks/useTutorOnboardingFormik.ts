import { useFormik } from 'formik';
import ITutorOnboardingFormValues from '../../../types/ITutorOnboardingFormValues';

export default function useTutorOnboardingFormik(onSubmit: (values: ITutorOnboardingFormValues) => void) {
    const formik = useFormik<ITutorOnboardingFormValues>({
        initialValues: {
            profileTitle: '',
            profileDescription: '',
        },
        onSubmit,
    });

    return formik;
}
