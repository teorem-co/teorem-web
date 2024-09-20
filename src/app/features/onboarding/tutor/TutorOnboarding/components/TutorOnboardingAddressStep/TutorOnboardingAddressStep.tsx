import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../store/hooks';
import { useEffect, useMemo, useState } from 'react';
import { Field } from 'formik';
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import OnboardingLayout from '../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import styles from './TutorOnboardingAddressStep.module.scss';
import QUESTION_ARTICLES from '../../../constants/questionArticles';
import QuestionListItem from '../../../../components/QuestionListItem';

export default function TutorOnboardingAddressStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onNext, onBack, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    useEffect(() => {
        setNextDisabled?.(
            !!formik.errors.addressState ||
                !!formik.errors.city ||
                !!formik.errors.postalCode ||
                !!formik.errors.addressStreet
        );
    }, [
        formik.errors.addressState,
        formik.errors.addressStreet,
        formik.errors.city,
        formik.errors.postalCode,
        setNextDisabled,
    ]);

    return (
        <OnboardingLayout
            header={
                <Button
                    variant="outlined"
                    color="secondary"
                    className={onboardingStyles.questions}
                    onClick={() => setIsSidebarOpen(true)}
                >
                    {t('ONBOARDING.QUESTIONS')}
                </Button>
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext} disabled={nextDisabled}>
                    {t('ONBOARDING.NEXT')}
                </CtaButton>
            }
            isSidebarOpen={isSidebarOpen}
            onSidebarClose={() => setIsSidebarOpen(false)}
            sidebar={QUESTION_ARTICLES.ADDRESS[countryAbrv ?? '']?.map((article) => (
                <QuestionListItem
                    key={article.title}
                    description={article.description}
                    title={article.title}
                    link={article.link}
                    image={article.image}
                />
            ))}
        >
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.ADDRESS.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.ADDRESS.SUBTITLE')}
                centerOnDesktop
            >
                <FormControl disabled variant="outlined" fullWidth>
                    <InputLabel id="country-label">{t('ONBOARDING.TUTOR.ADDRESS.COUNTRY_LABEL')}</InputLabel>
                    <Select
                        labelId="country-label"
                        placeholder="Country"
                        disabled
                        value={countryAbrv}
                        input={
                            <OutlinedInput
                                className={styles.input}
                                label={t('ONBOARDING.TUTOR.ADDRESS.COUNTRY_LABEL')}
                            />
                        }
                    >
                        <MenuItem key={countryAbrv} value={countryAbrv}>
                            {t('COUNTRY.' + countryAbrv)}
                        </MenuItem>
                    </Select>
                </FormControl>
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
        </OnboardingLayout>
    );
}
