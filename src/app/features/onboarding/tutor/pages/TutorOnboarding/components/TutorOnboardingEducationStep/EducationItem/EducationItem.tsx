import styles from './EducationItem.module.scss';
import IDegree from '../../../../../../../../types/IDegree';
import IUniversity from '../../../../../../../../types/IUniversity';

import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Delete from '@mui/icons-material/Delete';
import Remove from '@mui/icons-material/Remove';
import YEARS from '../constants/years';
import { useTranslation } from 'react-i18next';
import START_YEARS from '../constants/startYears';

interface IEducationItemProps {
    degrees: IDegree[];
    universities: IUniversity[];
    selectedDegreeId?: string;
    selectedUniversity?: IUniversity;
    selectedStartYear?: number;
    selectedEndYear?: number;
    major?: string;
    onDelete?: () => void;
    disabledDelete?: boolean;
    onDegreeChange: (degreeId: string) => void;
    onUniversityChange: (universityId: string | undefined) => void;
    onStartYearChange: (startYear: number) => void;
    onEndYearChange: (endYear: number) => void;
    onMajorChange: (major: string) => void;
}

export default function EducationItem({
    degrees,
    universities,
    selectedDegreeId,
    selectedUniversity,
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
                <Autocomplete
                    disablePortal
                    fullWidth
                    value={selectedUniversity}
                    getOptionLabel={(o) => t('UNIVERSITIES.' + o.abrv)}
                    onChange={(e, v) => onUniversityChange(v?.id)}
                    options={universities}
                    renderInput={(params) => (
                        <TextField {...params} label={t('ONBOARDING.TUTOR.EDUCATION.UNI_LABEL')} />
                    )}
                />
            </FormControl>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="degree-select-label">{t('ONBOARDING.TUTOR.EDUCATION.DEGREE_LABEL')}</InputLabel>
                <Select
                    labelId="degree-select-label"
                    placeholder="Degree"
                    value={selectedDegreeId}
                    onChange={(e) => onDegreeChange(e.target.value)}
                    input={<OutlinedInput label={t('ONBOARDING.TUTOR.EDUCATION.DEGREE_LABEL')} />}
                >
                    {degrees.map((degree) => (
                        <MenuItem key={degree.id} value={degree.id}>
                            {t('DEGREES.' + degree.abrv)}
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
                        input={<OutlinedInput label={t('ONBOARDING.TUTOR.EDUCATION.STARTED_LABEL')} />}
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
                        input={<OutlinedInput label={t('ONBOARDING.TUTOR.EDUCATION.FINISHED_LABEL')} />}
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
