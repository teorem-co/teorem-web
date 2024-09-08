import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingEducationStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../../store/hooks';
import { useEffect, useMemo } from 'react';
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import EducationItem from './EducationItem';

export default function TutorOnboardingEducationStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik } = useTutorOnboarding();
    const { user } = useAppSelector((state) => state.auth);
    const { degrees } = useAppSelector((state) => state.degree);
    const { universities } = useAppSelector((state) => state.university);

    const possibleDegrees = useMemo(
        () => degrees.filter((d) => d.countryId === user?.countryId),
        [degrees, user?.countryId]
    );

    const possibleUniversities = useMemo(
        () => universities.filter((u) => u.countryId === user?.countryId),
        [universities, user?.countryId]
    );

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.degrees);
        if (!formik.values.degrees?.length) {
            formik.setFieldValue('degrees', [{}]);
        }
    }, [setNextDisabled, formik.errors.subjects, formik]);

    const handleCheckbox = () => {
        formik.setFieldValue('hasNoDegree', !formik.values.hasNoDegree);
    };

    const handleDelete = (index: number) => {
        const degrees = formik.values.degrees;
        degrees?.splice(index, 1);
        formik.setFieldValue('degrees', degrees);
    };

    const handleAdd = () => {
        formik.setFieldValue('degrees', [...(formik.values.degrees ?? []), {}]);
    };
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.EDUCATION.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.EDUCATION.SUBTITLE')}
        >
            <FormControlLabel
                control={<Checkbox checked={formik.values.hasNoDegree} onChange={handleCheckbox} />}
                label={<Typography>{t('ONBOARDING.TUTOR.EDUCATION.CHECKBOX_NO_DEGREE')}</Typography>}
            />
            {formik.values.hasNoDegree
                ? null
                : formik.values.degrees?.map((item, index) => (
                      <EducationItem
                          key={index}
                          degrees={possibleDegrees}
                          universities={possibleUniversities}
                          selectedDegreeId={item.degreeId}
                          selectedUniversity={
                              item.universityId ? universities.find((u) => u.id === item.universityId) : undefined
                          }
                          selectedStartYear={item.startYear}
                          selectedEndYear={item.endYear}
                          major={item.majorName}
                          onDegreeChange={(degreeId) =>
                              formik.setFieldValue(
                                  `degrees`,
                                  formik.values.degrees?.map((d, i) => (index === i ? { ...d, degreeId } : d))
                              )
                          }
                          onUniversityChange={(universityId) =>
                              formik.setFieldValue(
                                  `degrees`,
                                  formik.values.degrees?.map((d, i) => (index === i ? { ...d, universityId } : d))
                              )
                          }
                          onStartYearChange={(startYear) =>
                              formik.setFieldValue(
                                  `degrees`,
                                  formik.values.degrees?.map((d, i) => (index === i ? { ...d, startYear } : d))
                              )
                          }
                          onEndYearChange={(endYear) =>
                              formik.setFieldValue(
                                  `degrees`,
                                  formik.values.degrees?.map((d, i) => (index === i ? { ...d, endYear } : d))
                              )
                          }
                          onMajorChange={(majorName) =>
                              formik.setFieldValue(
                                  `degrees`,
                                  formik.values.degrees?.map((d, i) => (index === i ? { ...d, majorName } : d))
                              )
                          }
                          onDelete={() => handleDelete(index)}
                          disabledDelete={formik.values.degrees?.length === 1}
                      />
                  ))}
            {formik.values.hasNoDegree ? null : (
                <Button onClick={handleAdd}>
                    <Add /> {t('ONBOARDING.TUTOR.EDUCATION.ADD_DEGREE')}
                </Button>
            )}
        </OnboardingStepFormLayout>
    );
}
