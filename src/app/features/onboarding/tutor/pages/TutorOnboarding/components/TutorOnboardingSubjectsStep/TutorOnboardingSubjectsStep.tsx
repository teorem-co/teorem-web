import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingSubjectsStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useEffect, useMemo, useState } from 'react';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useAppSelector } from '../../../../../../../store/hooks';
import LevelSubjectSelect from './components/LevelSubjectSelect';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';

export default function TutorOnboardingSubjectsStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, step, substep, maxSubstep, onBack, onNext, nextDisabled } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { levels } = useAppSelector((state) => state.level);
    const { subjects, subjectLevels } = useAppSelector((state) => state.subject);

    const possibleLevels = useMemo(
        () => levels.filter((l) => l.countryId === user?.countryId),
        [levels, user?.countryId]
    );

    const possibleSubjects = useMemo(
        () => subjects.filter((s) => s.countryId === user?.countryId),
        [subjects, user?.countryId]
    );

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.subjects);
        if (!formik.values.subjects?.length) {
            formik.setFieldValue('subjects', [{ levelId: undefined, subjectId: undefined }]);
        }
    }, [setNextDisabled, formik.errors.subjects, formik]);

    const handleDelete = (index: number) => {
        const subjects = formik.values.subjects;
        subjects?.splice(index, 1);
        formik.setFieldValue('subjects', subjects);
    };

    const handleAdd = () => {
        formik.setFieldValue('subjects', [
            ...(formik.values.subjects ?? []),
            { levelId: undefined, subjectId: undefined },
        ]);
    };

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
        >
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.SUBJECTS.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.SUBJECTS.SUBTITLE')}
                className={styles.layout}
            >
                {formik.values.subjects?.map((pair, i) => (
                    <LevelSubjectSelect
                        key={'' + pair?.levelId + pair?.subjectId}
                        subjects={possibleSubjects}
                        levels={possibleLevels}
                        subjectLevels={subjectLevels}
                        allPairs={formik.values.subjects}
                        selectedLevelId={pair.levelId}
                        selectedSubjectId={pair.subjectId}
                        onLevelChange={(levelId) => {
                            formik.setFieldValue(
                                'subjects',
                                formik.values.subjects?.map((s, index) => (index === i ? { ...s, levelId } : s))
                            );
                        }}
                        onSubjectChange={(subjectId) => {
                            formik.setFieldValue(
                                'subjects',
                                formik.values.subjects?.map((s, index) => (index === i ? { ...s, subjectId } : s))
                            );
                        }}
                        disabledDelete={!formik.values.subjects?.length || formik.values.subjects?.length <= 1}
                        onDelete={() => handleDelete(i)}
                    />
                ))}
                <div>
                    <Button onClick={handleAdd} color="inherit" fullWidth={false}>
                        <Add /> <span className={styles.add}>{t('ONBOARDING.TUTOR.SUBJECTS.ADD_SUBJECT')}</span>
                    </Button>
                </div>
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
