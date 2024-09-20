import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingAvailabilityStep.module.scss';
import OnboardingStepFormLayout from '../../../components/OnboardingStepFormLayout';
import { useEffect, useMemo, useState } from 'react';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import DayEnum from '../../types/DayEnum';
import AvailabilityDayItem from './components/AvailabilityDayItem';
import { TimeZoneSelect } from '../../../../../components/TimeZoneSelect';
import { useAppSelector } from '../../../../../store/hooks';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import CtaButton from '../../../../../components/CtaButton';
import QUESTION_ARTICLES from '../../constants/questionArticles';
import QuestionListItem from '../../../components/QuestionListItem';

export default function TutorOnboardingAvailabilityStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, step, substep, maxSubstep, onBack, onNext, nextDisabled } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.availability);
    }, [setNextDisabled, formik.errors.availability]);

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
            sidebar={QUESTION_ARTICLES.AVAILABILITY[countryAbrv ?? '']?.map((article) => (
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
                title={t('ONBOARDING.TUTOR.AVAILABILITY.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.AVAILABILITY.SUBTITLE')}
            >
                <TimeZoneSelect
                    title={t('ONBOARDING.TUTOR.AVAILABILITY.TIMEZONE_LABEL')}
                    className={styles.timeZoneSelect}
                    selectedZone={formik.values.timeZone ?? ''}
                    setSelectedZone={(z) => formik.setFieldValue('timeZone', z)}
                />
                {Object.entries(formik.values.availability || {})?.map(([day, item]) => (
                    <AvailabilityDayItem
                        key={day}
                        day={parseInt(day) as DayEnum}
                        availability={item.entries}
                        selected={item.selected}
                        onDayChange={(newEntries) => {
                            formik.setFieldValue('availability', {
                                ...formik.values.availability,
                                [day]: {
                                    selected: item.selected,
                                    entries: newEntries,
                                },
                            });
                        }}
                        onSelectedChange={(selected) => {
                            formik.setFieldValue('availability', {
                                ...formik.values.availability,
                                [day]: {
                                    selected,
                                    entries: item.entries,
                                },
                            });
                        }}
                    />
                ))}
                {formik.touched.availability && formik.errors?.availability ? (
                    <div className="field__validation">{formik.errors.availability}</div>
                ) : null}
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
