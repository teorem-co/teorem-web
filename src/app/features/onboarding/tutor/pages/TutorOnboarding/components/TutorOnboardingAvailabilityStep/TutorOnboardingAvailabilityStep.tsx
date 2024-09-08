import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingAvailabilityStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useEffect } from 'react';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import DayEnum from '../../../../types/DayEnum';
import AvailabilityDayItem from './components/AvailabilityDayItem';

export default function TutorOnboardingAvailabilityStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik } = useTutorOnboarding();

    useEffect(() => {
        console.log(formik.values.availability);
    }, [formik.values.availability]);

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.availability);
    }, [setNextDisabled, formik.errors.availability]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.AVAILABILITY.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.AVAILABILITY.SUBTITLE')}
        >
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
