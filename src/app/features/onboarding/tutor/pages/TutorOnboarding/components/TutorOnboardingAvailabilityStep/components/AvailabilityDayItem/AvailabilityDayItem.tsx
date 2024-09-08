import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import DayEnum from '../../../../../../types/DayEnum';
import IOnboardingAvailability from '../../../../../../types/IOnboardingAvailability';
import { useTranslation } from 'react-i18next';
import styles from './AvailabilityDayItem.module.scss';

interface IAvailabilityDayItemProps {
    day: DayEnum;
    selected?: boolean;
    availability: IOnboardingAvailability;
    onDayChange: (day: IOnboardingAvailability) => void;
    onSelectedChange: (selected: boolean) => void;
}

export default function AvailabilityDayItem({
    day,
    selected,
    availability,
    onSelectedChange,
    onDayChange,
}: Readonly<IAvailabilityDayItemProps>) {
    const { t } = useTranslation();

    const handleEntryChange = (newEntry: IOnboardingAvailability) => {
        onDayChange(newEntry);
    };

    return (
        <div className={styles.item}>
            <FormControlLabel
                control={<Checkbox checked={selected} onChange={() => onSelectedChange(!selected)} />}
                label={t(`CONSTANTS.DAYS_LONG.${day}`)}
            />
            {selected ? (
                <div className={styles.subItems}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={availability?.beforeNoon}
                                onChange={() => onDayChange({ ...availability, beforeNoon: !availability?.beforeNoon })}
                            />
                        }
                        label={t(`CONSTANTS.TIME_OF_DAY.BEFORE_NOON`)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={availability?.noonToFive}
                                defaultChecked={availability?.noonToFive}
                                onChange={() => onDayChange({ ...availability, noonToFive: !availability?.noonToFive })}
                            />
                        }
                        label={t(`CONSTANTS.TIME_OF_DAY.NOON_TO_FIVE`)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={availability?.afterFive}
                                onChange={() => onDayChange({ ...availability, afterFive: !availability?.afterFive })}
                            />
                        }
                        label={t(`CONSTANTS.TIME_OF_DAY.AFTER_FIVE`)}
                    />
                </div>
            ) : null}
        </div>
    );
}
