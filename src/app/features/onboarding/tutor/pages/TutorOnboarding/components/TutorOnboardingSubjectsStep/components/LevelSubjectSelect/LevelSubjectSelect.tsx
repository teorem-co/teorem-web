import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import styles from './LevelSubjectSelect.module.scss';
import Delete from '@mui/icons-material/Delete';
import ISubject from '../../../../../../../../../types/ISubject';
import ILevel from '../../../../../../../../../types/ILevel';
import ISubjectLevel from '../../../../../../../../../types/ISubjectLevel';
import { useTranslation } from 'react-i18next';

interface ILevelSubjectSelectProps {
    disabledDelete?: boolean;
    onDelete?: () => void;
    subjects: ISubject[];
    levels: ILevel[];
    subjectLevels: ISubjectLevel[];
    onSubjectChange: (subjectId: string) => void;
    onLevelChange: (levelId: string) => void;
    selectedSubjectId?: string;
    selectedLevelId?: string;
}

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
            <IconButton size="small" disabled={disabledDelete} className={styles.close} onClick={onDelete}>
                <Delete fontSize="small" />
            </IconButton>
        </div>
    );
}
