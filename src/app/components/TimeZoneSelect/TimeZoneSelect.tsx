import Select, { SingleValue, StylesConfig } from 'react-select';
import React, { useEffect, useState } from 'react';
import { Option } from '../../features/my-profile/VideoRecorder/VideoRecorder';
import { useLazyGetAllTimeZonesQuery } from '../../store/services/dashboardService';
import { t } from 'i18next';
import moment from 'moment/moment';
import { useAppDispatch } from '../../store/hooks';
import { setTimeZone } from '../../store/slices/timeZoneSlice';
import styles from './TimeZoneSelect.module.scss';
import clsx from 'clsx';

const customStyles: StylesConfig<Option, false> = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        color: state.isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontSize: '14px',
        fontWeight: state.isSelected ? 'bold' : 'normal',
    }),
    control: (base) => ({
        ...base,
        borderColor: 'lightgray',
        boxShadow: 'none',
        borderRadius: '8px',
        '&:hover': {
            border: '1px solid black',
        },
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: 'black',
        '&:hover': {
            color: 'black',
        },
    }),
};

interface ITimeZoneSelectProps {
    selectedZone: string;
    setSelectedZone: (selectedZone: string) => void;
    showTitle?: boolean;
    title?: string;
    defaultUserZone?: string;
    useSystemDefaultZone?: boolean;
    className?: string;
    widthClass?: string;
}

export const TimeZoneSelect = ({
    setSelectedZone,
    selectedZone,
    showTitle,
    defaultUserZone,
    useSystemDefaultZone,
    className,
    widthClass,
    title,
}: ITimeZoneSelectProps) => {
    const [getAllTimeZones] = useLazyGetAllTimeZonesQuery();

    const [timeZoneOptions, setTimeZoneOptions] = useState<Option[]>([]);

    const dispatch = useAppDispatch();

    const handleChangeZone = (selectedOption: SingleValue<Option>) => {
        const selectedValue = selectedOption ? selectedOption.value : '';
        setSelectedZone(selectedValue);
        dispatch(setTimeZone(selectedValue));
        moment.tz.setDefault(selectedValue);
    };

    async function fetchZones() {
        const res = await getAllTimeZones().unwrap();
        const timeZones = res.map((timeZone) => {
            return {
                value: timeZone.timeZoneId,
                label: (
                    <div className={'flex flex--col'}>
                        <span className={'type--base'}>{timeZone.timeZoneId}</span>
                        <span className={'type--sm type--color--secondary'}>({timeZone.offset})</span>
                    </div>
                ),
            };
        });

        if (!useSystemDefaultZone && defaultUserZone) {
            setSelectedZone(defaultUserZone);
            moment.tz.setDefault(defaultUserZone);
        } else {
            setSelectedZone(moment.tz.guess());
            moment.tz.setDefault(moment.tz.guess());
        }

        setTimeZoneOptions(timeZones);
    }

    useEffect(() => {
        fetchZones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultUserZone]);

    return (
        <div className={clsx(styles.container, 'flex flex--center timezone-container')}>
            {showTitle || title ? (
                <span className={styles.label}>{title ?? t('MY_PROFILE.GENERAL_AVAILABILITY.SELECT_ZONE')}</span>
            ) : null}
            <Select
                className={clsx(styles.select, `${widthClass ? widthClass : 'select-width'} ${className}`)}
                classNamePrefix="select"
                value={timeZoneOptions.find((option) => option.value === selectedZone)}
                onChange={handleChangeZone}
                options={timeZoneOptions}
                placeholder={t('MY_PROFILE.GENERAL_AVAILABILITY.TIME_ZONE')}
                styles={customStyles}
                components={{
                    IndicatorSeparator: () => null,
                }}
            />
        </div>
    );
};
