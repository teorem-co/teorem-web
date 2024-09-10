import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingAvailabilityStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useEffect, useState } from 'react';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import DayEnum from '../../../../types/DayEnum';
import AvailabilityDayItem from './components/AvailabilityDayItem';
import { TimeZoneSelect } from '../../../../../../../components/TimeZoneSelect';
import { useAppSelector } from '../../../../../../../store/hooks';

export default function TutorOnboardingAvailabilityStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, setShowQuestions } = useTutorOnboarding();
    const { user } = useAppSelector((state) => state.auth);
    const [defaultZone, setDefaultZone] = useState<string | undefined>();

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.availability);
        setShowQuestions?.(true);
    }, [setNextDisabled, setShowQuestions, formik.errors.availability]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.AVAILABILITY.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.AVAILABILITY.SUBTITLE')}
        >
            <TimeZoneSelect
                title={t('ONBOARDING.TUTOR.AVAILABILITY.TIMEZONE_LABEL')}
                className={styles.timeZoneSelect}
                defaultUserZone={defaultZone}
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
        </OnboardingStepFormLayout>
    );
}
