import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect, useMemo } from 'react';
import { useAppSelector } from '../../../../../../../store/hooks';
import { Field } from 'formik';
import { TextField } from '@mui/material';

export default function TutorOnboardingPayoutInfoStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, setShowQuestions } = useTutorOnboarding();
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const isCroatian = useMemo(() => countries.find((c) => c.id === user?.countryId)?.abrv === 'HR', [user, countries]);
    const isCompany = formik.values.isCompany;

    useEffect(() => {
        setShowQuestions?.(true);
        if (isCroatian) {
            setNextDisabled?.(!!formik.errors.iban);
        } else {
            setNextDisabled?.(!!formik.errors.accountNumber || !!formik.errors.routingNumber);
        }
    }, [
        formik.errors.accountNumber,
        formik.errors.iban,
        formik.errors.routingNumber,
        isCroatian,
        setNextDisabled,
        setShowQuestions,
    ]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PAYOUT_INFO.TITLE')}
            subtitle={
                isCompany
                    ? t('ONBOARDING.TUTOR.PAYOUT_INFO.SUBTITLE_COMPANY')
                    : t('ONBOARDING.TUTOR.PAYOUT_INFO.SUBTITLE')
            }
        >
            {isCroatian ? (
                <Field
                    as={TextField}
                    name="iban"
                    type="text"
                    fullWidth
                    error={formik.touched.iban && !!formik.errors.iban}
                    helperText={formik.touched.iban && formik.errors.iban}
                    id="iban"
                    label={t('ONBOARDING.TUTOR.PAYOUT_INFO.IBAN_LABEL')}
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
            ) : (
                <>
                    <Field
                        as={TextField}
                        name="accountNumber"
                        type="text"
                        fullWidth
                        error={formik.touched.accountNumber && !!formik.errors.accountNumber}
                        helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                        label={t('ONBOARDING.TUTOR.PAYOUT_INFO.ACCOUNT_NUMBER')}
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
                        name="routingNumber"
                        type="text"
                        fullWidth
                        error={formik.touched.routingNumber && !!formik.errors.routingNumber}
                        helperText={formik.touched.routingNumber && formik.errors.routingNumber}
                        label={t('ONBOARDING.TUTOR.PAYOUT_INFO.ROUTING_NUMBER')}
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
                </>
            )}
        </OnboardingStepFormLayout>
    );
}
