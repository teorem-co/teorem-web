import Select, { SingleValue, StylesConfig } from 'react-select';
import React, { useEffect, useState } from 'react';
import { Option } from '../features/my-profile/VideoRecorder/VideoRecorder';
import { useLazyGetAllTimeZonesQuery } from '../../services/dashboardService';
import { t } from 'i18next';
import moment from 'moment/moment';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setTimeZone } from '../../slices/timeZoneSlice';

const customStyles: StylesConfig<Option, false> = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#7e6cf2' : 'white',
        color: state.isSelected ? 'white' : 'black',
        fontSize: '14px',
    }),
    control: (base) => ({
        ...base,
        borderColor: 'lightgray',
        boxShadow: 'none',
        '&:hover': {
            border: '1px solid #7e6cf2',
        },
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: '#7e6cf2',
        '&:hover': {
            color: '#7e6cf2',
        },
    }),
};

interface Props {
    selectedZone: string;
    setSelectedZone: (selectedZone: string) => void;
    showTitle?: boolean;
    defaultUserZone?: string;
    useSystemDefaultZone?: boolean;
    className?: string;
}

export const TimeZoneSelect = (props: Props) => {
    const { setSelectedZone, selectedZone, showTitle, defaultUserZone, useSystemDefaultZone, className } = props;
    const [getAllTimeZones] = useLazyGetAllTimeZonesQuery();

    const [timeZoneOptions, setTimeZoneOptions] = useState<Option[]>([]);
    const timeZoneState = useAppSelector((state) => state.timeZone);
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
                value: timeZone,
                label: timeZone,
            };
        });

        if (!useSystemDefaultZone && defaultUserZone) {
            setSelectedZone(defaultUserZone);
        } else {
            setSelectedZone(moment.tz.guess());
        }

        setTimeZoneOptions(timeZones);
    }

    useEffect(() => {
        fetchZones();
    }, [defaultUserZone]);

    return (
        <div className={'flex flex--center timezone-container'}>
            {showTitle && <span className={'mr-2'}>{t('MY_PROFILE.GENERAL_AVAILABILITY.SELECT_ZONE')}</span>}
            <Select
                className={`w--250 ${className}`}
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
