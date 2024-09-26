import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { Field } from 'formik';
import { Button, TextField } from '@mui/material';
import OnboardingLayout from '../../../components/OnboardingLayout';
import CtaButton from '../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../constants/questionArticles';
import QuestionListItem from '../../../components/QuestionListItem';
import useMount from '../../../../../utils/useMount';

export default function TutorOnboardingPayoutInfoStep() {
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

    useMount(() => {
        setTimeout(() => {
            document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' });
        }, 237);
    });

    useEffect(() => {
        if (isCroatian) {
            setNextDisabled?.(!!formik.errors.iban);
        } else {
            setNextDisabled?.(!!formik.errors.accountNumber || !!formik.errors.routingNumber);
        }
    }, [formik.errors.accountNumber, formik.errors.iban, formik.errors.routingNumber, isCroatian, setNextDisabled]);

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
            sidebar={QUESTION_ARTICLES.PAYOUT_INFO[countryAbrv ?? '']?.map((article) => (
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
                title={t('ONBOARDING.TUTOR.PAYOUT_INFO.TITLE')}
                subtitle={
                    isCompany
                        ? t('ONBOARDING.TUTOR.PAYOUT_INFO.SUBTITLE_COMPANY')
                        : t('ONBOARDING.TUTOR.PAYOUT_INFO.SUBTITLE')
                }
                centerOnDesktop
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
                            label={t('ONBOARDING.TUTOR.PAYOUT_INFO.ACCOUNT_NUMBER_LABEL')}
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
                            label={t('ONBOARDING.TUTOR.PAYOUT_INFO.ROUTING_NUMBER_LABEL')}
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
        </OnboardingLayout>
    );
}
