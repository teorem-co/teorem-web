import { FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import styles from './LevelSubjectSelect.module.scss';
import Delete from '@mui/icons-material/Delete';
import ISubject from '../../../../../../../types/ISubject';
import ILevel from '../../../../../../../types/ILevel';
import ISubjectLevel from '../../../../../../../types/ISubjectLevel';
import { useTranslation } from 'react-i18next';
import IOnboardingSubject from '../../../../types/IOnboardingSubject';

interface ILevelSubjectSelectProps {
    disabledDelete?: boolean;
    onDelete?: () => void;
    subjects: ISubject[];
    levels: ILevel[];
    allPairs?: IOnboardingSubject[];
    subjectLevels: ISubjectLevel[];
    onSubjectChange: (subjectId: string) => void;
    onLevelChange: (levelId: string) => void;
    selectedSubjectId?: string;
    selectedLevelId?: string;
}

// TODO: add filter to not offer existing pairs, add id to IOnboardingSubject object to prevent hiding the selected pair
export default function LevelSubjectSelect({
    onDelete,
    subjects,
    levels,
    subjectLevels,
    onSubjectChange,
    onLevelChange,
    selectedSubjectId,
    selectedLevelId,
    disabledDelete,
    allPairs = [], // TODO: use the allPairs prop to filter out existing pairs
}: Readonly<ILevelSubjectSelectProps>) {
    const { t } = useTranslation();
    return (
        <div className={styles.levelSubjectSelect}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="level-select-label">{t('ONBOARDING.TUTOR.SUBJECTS.LEVEL_LABEL')}</InputLabel>
                <Select
                    labelId="level-select-label"
                    placeholder={t('ONBOARDING.TUTOR.SUBJECTS.LEVEL_LABEL')}
                    value={selectedLevelId}
                    input={
                        <OutlinedInput className={styles.input} label={t('ONBOARDING.TUTOR.SUBJECTS.LEVEL_LABEL')} />
                    }
                    onChange={(e) => onLevelChange(e.target.value)}
                >
                    {levels
                        .filter(
                            (l) =>
                                !selectedSubjectId ||
                                subjectLevels.some((sl) => sl.levelId === l.id && sl.subjectId === selectedSubjectId)
                        )
                        .map((level) => (
                            <MenuItem key={level.id} value={level.id}>
                                {t('LEVELS.' + level.abrv)}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="subject-select-label">{t('ONBOARDING.TUTOR.SUBJECTS.SUBJECT_LABEL')}</InputLabel>
                <Select
                    labelId="subject-select-label"
                    placeholder={t('ONBOARDING.TUTOR.SUBJECTS.SUBJECT_LABEL')}
                    value={selectedSubjectId}
                    input={
                        <OutlinedInput className={styles.input} label={t('ONBOARDING.TUTOR.SUBJECTS.SUBJECT_LABEL')} />
                    }
                    onChange={(e) => onSubjectChange(e.target.value)}
                >
                    {subjects
                        .filter(
                            (s) =>
                                !selectedLevelId ||
                                subjectLevels.some((sl) => sl.subjectId === s.id && sl.levelId === selectedLevelId)
                        )
                        .map((subject) => (
                            <MenuItem key={subject.id} value={subject.id}>
                                {t('SUBJECTS.' + subject.abrv)}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <button className={styles.deleteText} disabled={disabledDelete} onClick={onDelete}>
                - {t('ONBOARDING.TUTOR.SUBJECTS.REMOVE_SUBJECT')}
            </button>
            <IconButton size="small" disabled={disabledDelete} className={styles.deleteIcon} onClick={onDelete}>
                <Delete fontSize="small" />
            </IconButton>
        </div>
    );
}
