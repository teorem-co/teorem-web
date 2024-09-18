import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingTitleStep.module.scss';
import { Field } from 'formik';
import { Button } from '@mui/material';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect, useMemo, useState } from 'react';
import TextArea from '../../../../../../../components/form/MyTextArea';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../../../constants/questionArticles';
import QuestionListItem from '../../../../../components/QuestionListItem';
import { useAppSelector } from '../../../../../../../store/hooks';

export default function TutorOnboardingTitleStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.profileTitle);
    }, [formik.errors.profileTitle, setNextDisabled]);

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
            sidebar={QUESTION_ARTICLES.TITLE[countryAbrv ?? '']?.map((article) => (
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
                title={t('ONBOARDING.TUTOR.TITLE.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.TITLE.SUBTITLE')}
                centerOnDesktop
            >
                <Field
                    as={TextArea}
                    name="profileTitle"
                    type="text"
                    fullWidth
                    error={formik.touched.profileTitle && !!formik.errors.profileDescription}
                    helperText={formik.touched.profileTitle && formik.errors.profileTitle}
                    id="profileTitle"
                    variant="outlined"
                    className={styles.textArea}
                    FormHelperTextProps={{
                        style: { color: 'red' }, // Change the color of the helper text here
                    }}
                    maxLength={50}
                    onBlur={(e: any) => {
                        formik.handleBlur(e);
                    }}
                />
                {formik.values.profileTitle?.length ?? 0} / 50
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
