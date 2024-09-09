import { useFormik } from 'formik';
import ITutorOnboardingFormValues from '../../../types/ITutorOnboardingFormValues';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../../store/hooks';
import DayEnum from '../../../types/DayEnum';

export default function useTutorOnboardingFormik(onSubmit: (values: ITutorOnboardingFormValues) => void) {
    const { countries } = useAppSelector((state) => state.countryMarket);
    const { user } = useAppSelector((state) => state.auth);

    const { t } = useTranslation();
    const formik = useFormik<ITutorOnboardingFormValues>({
        initialValues: {
            profileTitle: '',
            profileDescription: '',
            subjects: [],
            availability: {
                [DayEnum.MONDAY]: {
                    selected: true,
                    entries: { day: DayEnum.MONDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
                [DayEnum.TUESDAY]: {
                    selected: true,
                    entries: { day: DayEnum.TUESDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
                [DayEnum.WEDNESDAY]: {
                    selected: true,
                    entries: { day: DayEnum.WEDNESDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
                [DayEnum.THURSDAY]: {
                    selected: true,
                    entries: { day: DayEnum.THURSDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
                [DayEnum.FRIDAY]: {
                    selected: true,
                    entries: { day: DayEnum.FRIDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
                [DayEnum.SATURDAY]: {
                    selected: true,
                    entries: { day: DayEnum.SATURDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
                [DayEnum.SUNDAY]: {
                    selected: true,
                    entries: { day: DayEnum.SUNDAY, beforeNoon: false, noonToFive: true, afterFive: false },
                },
            },
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
            availability: Yup.object()
                .shape({
                    [DayEnum.MONDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                    [DayEnum.TUESDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                    [DayEnum.WEDNESDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                    [DayEnum.THURSDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                    [DayEnum.FRIDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                    [DayEnum.SATURDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                    [DayEnum.SUNDAY]: Yup.object().shape({
                        selected: Yup.boolean(),
                        entries: Yup.object().shape({
                            day: Yup.number().required(),
                            beforeNoon: Yup.boolean(),
                            noonToFive: Yup.boolean(),
                            afterFive: Yup.boolean(),
                        }),
                    }),
                })
                .test('availability', t('FORM_VALIDATION.AVAILABILITY'), function (value) {
                    const selectedDays = Object.entries(value).filter(([key, item]) => item.selected);
                    const selectedTimes = selectedDays.filter(
                        ([key, item]) => item.entries.beforeNoon || item.entries.noonToFive || item.entries.afterFive
                    );

                    return selectedTimes.length > 0;
                }),

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
            phoneNumber: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .min(7, t('FORM_VALIDATION.PHONE_SHORT')) // 10 characters
                .matches(
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/gm,
                    t('FORM_VALIDATION.PHONE_NUMBER')
                ),
        }),
        onSubmit,
    });

    return formik;
}
