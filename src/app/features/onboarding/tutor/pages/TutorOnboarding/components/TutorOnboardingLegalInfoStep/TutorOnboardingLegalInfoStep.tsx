import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../../../../store/hooks';
import TextField from '@mui/material/TextField';
import { Field } from 'formik';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../../../constants/questionArticles';
import QuestionListItem from '../../../../../components/QuestionListItem';

export default function TutorOnboardingLegalInfoStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    const isCroatian = countryAbrv === 'HR';
    const isCompany = formik.values.isCompany;

    useEffect(() => {
        if (formik.values.isCompany) {
            if (isCroatian) {
                setNextDisabled?.(!!formik.errors.companyName || !formik.values.oib);
            } else {
                setNextDisabled?.(!!formik.errors.companyName);
            }
        } else if (isCroatian) {
            setNextDisabled?.(!!formik.errors.oib);
        } else {
            setNextDisabled?.(!!formik.errors.ssn4Digits);
        }
    }, [
        formik.errors.companyName,
        formik.errors.oib,
        formik.errors.ssn4Digits,
        formik.values.companyName,
        formik.values.isCompany,
        formik.values.oib,
        formik.values.ssn4Digits,
        isCroatian,
        setNextDisabled,
    ]);

    const personTitle = isCroatian ? t('ONBOARDING.TUTOR.LEGAL_INFO.TITLE_HR') : t('ONBOARDING.TUTOR.LEGAL_INFO.TITLE');
    const personSubtitle = isCroatian
        ? t('ONBOARDING.TUTOR.LEGAL_INFO.SUBTITLE_HR')
        : t('ONBOARDING.TUTOR.LEGAL_INFO.SUBTITLE');

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
            sidebar={QUESTION_ARTICLES.LEGAL_INFO[countryAbrv ?? '']?.map((article) => (
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
                title={isCompany ? t('ONBOARDING.TUTOR.LEGAL_INFO.TITLE_COMPANY') : personTitle}
                subtitle={isCompany ? t('ONBOARDING.TUTOR.LEGAL_INFO.SUBTITLE') : personSubtitle}
                centerOnDesktop
            >
                {isCroatian ? (
                    <>
                        <Field
                            as={TextField}
                            name="oib"
                            type="text"
                            fullWidth
                            error={formik.touched.oib && !!formik.errors.oib}
                            helperText={formik.touched.oib && formik.errors.oib}
                            id="oib"
                            label={
                                isCompany
                                    ? t('ONBOARDING.TUTOR.LEGAL_INFO.OIB_LABEL_COMPANY')
                                    : t('ONBOARDING.TUTOR.LEGAL_INFO.OIB_LABEL')
                            }
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
                        {isCompany ? (
                            <Field
                                as={TextField}
                                name="companyName"
                                type="text"
                                fullWidth
                                error={formik.touched.companyName && !!formik.errors.companyName}
                                helperText={formik.touched.companyName && formik.errors.companyName}
                                id="companyName"
                                label={t('ONBOARDING.TUTOR.LEGAL_INFO.NAME_LABEL_COMPANY')}
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
                        ) : null}
                    </>
                ) : (
                    <>
                        {isCompany ? (
                            <Field
                                as={TextField}
                                name="companyName"
                                type="text"
                                fullWidth
                                error={formik.touched.companyName && !!formik.errors.companyName}
                                helperText={formik.touched.companyName && formik.errors.companyName}
                                id="companyName"
                                label={t('ONBOARDING.TUTOR.LEGAL_INFO.NAME_LABEL_COMPANY')}
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
                            <Field
                                as={TextField}
                                name="ssn4Digits"
                                type="text"
                                fullWidth
                                error={formik.touched.ssn4Digits && !!formik.errors.ssn4Digits}
                                helperText={formik.touched.ssn4Digits && formik.errors.ssn4Digits}
                                id="ssn4Digits"
                                label={t('ONBOARDING.TUTOR.LEGAL_INFO.SSN_LABEL')}
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
                        )}
                    </>
                )}
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
