import { useFormik } from 'formik';
import ITutorOnboardingFormValues from '../../../types/ITutorOnboardingFormValues';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../../store/hooks';

export default function useTutorOnboardingFormik(onSubmit: (values: ITutorOnboardingFormValues) => void) {
    const { countries } = useAppSelector((state) => state.countryMarket);
    const { user } = useAppSelector((state) => state.auth);

    const { t } = useTranslation();
    const formik = useFormik<ITutorOnboardingFormValues>({
        initialValues: {
            profileTitle: '',
            profileDescription: '',
            subjects: [],
            availability: [],
            hasNoDegree: false,
            degrees: [],
            autoAcceptBooking: null,
            isCompany: null,
            ssn4Digits: '',
            oib: '',
            companyName: '',
            addressCountryId: user?.countryId,
            addressApartment: '',
            routingNumber: '',
            accountNumber: '',
            imageLink: '',
            iban: '',
        },
        validationSchema: Yup.object().shape({
            subjects: Yup.array()
                .of(
                    Yup.object().shape({
                        subjectId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                        levelId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                    })
                )
                .min(1, t('FORM_VALIDATION.MIN_ONE')),
            availability: Yup.array()
                .of(
                    Yup.object().shape({
                        day: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                        startTime: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                        endTime: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                    })
                )
                .min(1, t('FORM_VALIDATION.MIN_ONE')),
            imageLink: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            degrees: Yup.array().when('hasNoDegree', {
                is: false,
                then: Yup.array()
                    .of(
                        Yup.object().shape({
                            degreeId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                            universityId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                            majorName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                            startYear: Yup.number()
                                .required(t('FORM_VALIDATION.REQUIRED'))
                                .test('endYear', t('FORM_VALIDATION.START_YEAR'), function (value) {
                                    return (value || 9999) <= new Date().getFullYear();
                                }),
                            endYear: Yup.number()
                                .required(t('FORM_VALIDATION.REQUIRED'))
                                .test('endYear', t('FORM_VALIDATION.END_YEAR'), function (value) {
                                    return value === 0 || (value ?? 0) > this.parent.startYear;
                                }),
                        })
                    )
                    .min(1, t('FORM_VALIDATION.MIN_ONE')),
            }),
            profileTitle: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            profileDescription: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            videoId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),

            price: Yup.number().required(t('FORM_VALIDATION.REQUIRED')),
            ssn4Digits: Yup.string().when('addressCountryId', {
                is: () => countries.find((c) => c.id === user?.countryId)?.abrv === 'US',
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            oib: Yup.string().when('addressCountryId', {
                is: () => countries.find((c) => c.id === user?.countryId)?.abrv === 'HR',
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            companyName: Yup.string().when('isCompany', {
                is: true,
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            routingNumber: Yup.string().when('addressCountryId', {
                is: () => countries.find((c) => c.id === user?.countryId)?.abrv === 'US',
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            accountNumber: Yup.string().when('addressCountryId', {
                is: () => countries.find((c) => c.id === user?.countryId)?.abrv === 'US',
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            iban: Yup.string().when('addressCountryId', {
                is: () => countries.find((c) => c.id === user?.countryId)?.abrv === 'HR',
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            addressState: Yup.string().when('addressCountryId', {
                is: () => countries.find((c) => c.id === user?.countryId)?.abrv === 'US',
                then: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            }),
            addressStreet: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            addressApartment: Yup.string(),
            postalCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            city: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
        onSubmit,
    });

    return formik;
}
