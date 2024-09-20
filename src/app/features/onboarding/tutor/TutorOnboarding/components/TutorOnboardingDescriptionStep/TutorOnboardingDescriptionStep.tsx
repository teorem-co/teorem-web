import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingDescriptionStep.module.scss';
import { useTutorOnboarding } from '../../../providers/TutorOnboardingProvider';
import { useEffect, useMemo, useState } from 'react';
import { Field } from 'formik';
import TextArea from '../../../../../../components/form/MyTextArea';
import OnboardingLayout from '../../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../../constants/questionArticles';
import QuestionListItem from '../../../../components/QuestionListItem';
import { useAppSelector } from '../../../../../../store/hooks';

export default function TutorOnboardingDescriptionStep() {
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
        setNextDisabled?.(!!formik.errors.profileDescription);
    }, [formik.errors.profileDescription, setNextDisabled]);

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
            sidebar={QUESTION_ARTICLES.DESCRIPTION[countryAbrv ?? '']?.map((article) => (
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
                title={t('ONBOARDING.TUTOR.DESCRIPTION.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.DESCRIPTION.SUBTITLE')}
                centerOnDesktop
            >
                <Field
                    as={TextArea}
                    name="profileDescription"
                    type="text"
                    fullWidth
                    error={formik.touched.profileDescription && !!formik.errors.profileDescription}
                    helperText={formik.touched.profileDescription && formik.errors.profileDescription}
                    id="profileDescription"
                    variant="outlined"
                    FormHelperTextProps={{
                        style: { color: 'red' }, // Change the color of the helper text here
                    }}
                    maxLength={300}
                    className={styles.textArea}
                    onBlur={(e: any) => {
                        formik.handleBlur(e);
                    }}
                />
                {formik.values.profileDescription?.length ?? 0} / 300
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
