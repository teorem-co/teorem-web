import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../../store/hooks';
import { useEffect, useMemo } from 'react';
import { Field } from 'formik';
import { TextField } from '@mui/material';

export default function TutorOnboardingAddressStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik } = useTutorOnboarding();
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const userCountry = useMemo(() => countries.find((c) => c.id === user?.countryId), [user, countries]);
    const isCompany = formik.values.isCompany;

    useEffect(() => {
        setNextDisabled?.(
            !formik.values.addressState ||
                !formik.values.city ||
                !formik.values.postalCode ||
                !formik.values.addressStreet
        );
    }, [
        formik.values.addressApartment,
        formik.values.addressState,
        formik.values.addressStreet,
        formik.values.city,
        formik.values.postalCode,
        setNextDisabled,
    ]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.ADDRESS.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.ADDRESS.SUBTITLE')}
        >
            <div>{t('ONBOARDING.TUTOR.ADDRESS.COUNTRY_LABEL')}</div>
            <div>{t('COUNTRY.' + userCountry?.abrv)}</div>
            <Field
                as={TextField}
                name="addressStreet"
                type="text"
                fullWidth
                error={formik.touched.addressStreet && !!formik.errors.addressStreet}
                helperText={formik.touched.addressStreet && formik.errors.addressStreet}
                id="addressStreet"
                label={t('ONBOARDING.TUTOR.ADDRESS.STREET_LABEL')}
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                inputProps={{
                    maxLength: 100,
                }}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
            <Field
                as={TextField}
                name="addressApartment"
                type="text"
                fullWidth
                error={formik.touched.addressApartment && !!formik.errors.addressApartment}
                helperText={formik.touched.addressApartment && formik.errors.addressApartment}
                id="addressApartment"
                label={t('ONBOARDING.TUTOR.ADDRESS.APARTMENT_LABEL')}
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                inputProps={{
                    maxLength: 100,
                }}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
            <Field
                as={TextField}
                name="postalCode"
                type="text"
                fullWidth
                error={formik.touched.postalCode && !!formik.errors.postalCode}
                helperText={formik.touched.postalCode && formik.errors.postalCode}
                id="postalCode"
                label={t('ONBOARDING.TUTOR.ADDRESS.POSTAL_CODE_LABEL')}
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                inputProps={{
                    maxLength: 100,
                }}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
            <Field
                as={TextField}
                name="city"
                type="text"
                fullWidth
                error={formik.touched.city && !!formik.errors.city}
                helperText={formik.touched.city && formik.errors.city}
                id="city"
                label={t('ONBOARDING.TUTOR.ADDRESS.CITY_LABEL')}
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                inputProps={{
                    maxLength: 100,
                }}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
            <Field
                as={TextField}
                name="addressState"
                type="text"
                fullWidth
                error={formik.touched.addressState && !!formik.errors.addressState}
                helperText={formik.touched.addressState && formik.errors.addressState}
                id="addressState"
                label={t('ONBOARDING.TUTOR.ADDRESS.STATE_LABEL')}
                variant="outlined"
                FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                }}
                inputProps={{
                    maxLength: 100,
                }}
                onBlur={(e: any) => {
                    formik.handleBlur(e);
                }}
            />
        </OnboardingStepFormLayout>
    );
}
