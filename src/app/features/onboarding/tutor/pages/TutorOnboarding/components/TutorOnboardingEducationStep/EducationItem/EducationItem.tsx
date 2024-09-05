import styles from './EducationItem.module.scss';
import IDegree from '../../../../../../../../types/IDegree';
import IUniversity from '../../../../../../../../types/IUniversity';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Delete, Remove } from '@mui/icons-material';
import YEARS from '../constants/years';
import { useTranslation } from 'react-i18next';
import START_YEARS from '../constants/startYears';

interface IEducationItemProps {
    degrees: IDegree[];
    universities: IUniversity[];
    selectedDegreeId?: string;
    selectedUniversityId?: string;
    selectedStartYear?: number;
    selectedEndYear?: number;
    major?: string;
    onDelete?: () => void;
    disabledDelete?: boolean;
    onDegreeChange: (degreeId: string) => void;
    onUniversityChange: (universityId: string) => void;
    onStartYearChange: (startYear: number) => void;
    onEndYearChange: (endYear: number) => void;
    onMajorChange: (major: string) => void;
}

export default function EducationItem({
    degrees,
    universities,
    selectedDegreeId,
    selectedUniversityId,
    major,
    selectedEndYear,
    selectedStartYear,
    onDelete,
    disabledDelete,
    onDegreeChange,
    onUniversityChange,
    onStartYearChange,
    onEndYearChange,
    onMajorChange,
}: Readonly<IEducationItemProps>) {
    const { t } = useTranslation();
    return (
        <div className={styles.educationItem}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="university-select-label">University</InputLabel>
                <Select
                    labelId="university-select-label"
                    placeholder="University"
                    value={selectedUniversityId}
                    onChange={(e) => onUniversityChange(e.target.value)}
                >
                    {universities.map((university) => (
                        <MenuItem key={university.id} value={university.id}>
                            {university.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="degree-select-label">Degree</InputLabel>
                <Select
                    labelId="degree-select-label"
                    placeholder="Degree"
                    value={selectedDegreeId}
                    onChange={(e) => onDegreeChange(e.target.value)}
                >
                    {degrees.map((degree) => (
                        <MenuItem key={degree.id} value={degree.id}>
                            {degree.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField fullWidth value={major} onChange={(e) => onMajorChange(e.target.value)} />
            <div className={styles.bottomRow}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="start-year-select-label">
                        {t('ONBOARDING.TUTOR.EDUCATION.STARTED_LABEL')}
                    </InputLabel>
                    <Select
                        labelId="start-year-select-label"
                        value={selectedStartYear}
                        onChange={(e) =>
                            onStartYearChange(
                                typeof e.target.value === 'string' ? parseInt(e.target.value) : e.target.value
                            )
                        }
                        placeholder="-"
                    >
                        {START_YEARS.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Remove />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="end-year-select-label">{t('ONBOARDING.TUTOR.EDUCATION.FINISHED_LABEL')}</InputLabel>
                    <Select
                        labelId="end-year-select-label"
                        value={selectedEndYear}
                        onChange={(e) =>
                            onEndYearChange(
                                typeof e.target.value === 'string' ? parseInt(e.target.value) : e.target.value
                            )
                        }
                        placeholder="-"
                    >
                        <MenuItem value={0}>{t('ONBOARDING.TUTOR.EDUCATION.ONGOING')}</MenuItem>
                        {YEARS.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <IconButton className={styles.deleteButton} onClick={onDelete} disabled={disabledDelete}>
                    <Delete />
                </IconButton>
            </div>
        </div>
    );
}
