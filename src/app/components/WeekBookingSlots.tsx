import { TimeZoneSelect } from './TimeZoneSelect';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import moment from 'moment-timezone';
import { useLazyGetWeekPeriodsForTutorQuery } from '../store/services/bookingService';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { t } from 'i18next';
import { ClipLoader } from 'react-spinners';

export interface TimeSlots {
    [date: string]: string[];
}

interface Props {
    tutorId: string;
    className?: string;
    onClickPeriod?: (arg: string) => void;
    onClose?: () => void;
    showTitle?: boolean;
}

export const WeekBookingSlots = (props: Props) => {
    const { tutorId, className, onClickPeriod, onClose, showTitle } = props;
    const isMobile = window.innerWidth < 765;

    const timeZoneState = useAppSelector((state) => state.timeZone);
    const [selectedZone, setSelectedZone] = useState(
        timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess()
    );

    const [timeSlots, setTimeSlots] = useState<TimeSlots>();

    const [getTimeSlots] = useLazyGetWeekPeriodsForTutorQuery();
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded((prevState) => !prevState);
    };

    const [period, setPeriod] = useState({
        startDate: '',
        endDate: '',
    });

    const setStartAndEndOfWeek = () => {
        if (period.endDate === '' || period.startDate === '') {
            const now = moment.tz(selectedZone);
            const start = now.clone().tz(selectedZone).toISOString();
            const end = now.clone().add(6, 'days').tz(selectedZone).toISOString();
            setPeriod({
                startDate: start,
                endDate: end,
            });
        } else {
            setPeriod({
                startDate: moment(period.startDate).tz(selectedZone).toISOString(),
                endDate: moment(period.endDate).tz(selectedZone).toISOString(),
            });
        }
    };

    function increaseWeek() {
        const startDate = moment(period.startDate).tz(selectedZone).add(1, 'week').toISOString();
        const endDate = moment(period.endDate).tz(selectedZone).add(1, 'week').toISOString();
        setPeriod({ startDate, endDate });
    }

    function decreaseWeek() {
        const startDate = moment(period.startDate).tz(selectedZone).subtract(1, 'week').toISOString();
        const endDate = moment(period.endDate).tz(selectedZone).subtract(1, 'week').toISOString();
        setPeriod({ startDate, endDate });
    }

    useEffect(() => {
        setStartAndEndOfWeek();
    }, [selectedZone]);

    const fetchData = useCallback(
        async (
            tutorId: string,
            selectedZone: string,
            period: {
                startDate: string;
                endDate: string;
            }
        ) => {
            if (!period.startDate || !period.endDate) return;

            const res = await getTimeSlots({
                tutorId,
                startDate: moment(period.startDate).tz(selectedZone).format('YYYY-MM-DD'),
                endDate: moment(period.endDate).tz(selectedZone).format('YYYY-MM-DD'),
                timeZone: selectedZone,
            }).unwrap();

            setTimeSlots(res);
        },
        [getTimeSlots]
    );

    useEffect(() => {
        if (!tutorId) return;
        fetchData(tutorId, selectedZone, period);
    }, [selectedZone, period, tutorId, fetchData]);

    return (
        <div className={`${className} w--800--max  flex flex--col booking-slots-container`}>
            {showTitle && (
                <span className="text-align--center type--wgt--extra-bold type--md mb-4">
                    {t('WEEK_BOOKING.TITLE')}
                </span>
            )}
            <div>
                {isMobile ? (
                    <div>
                        <div className={'flex flex--col flex--jc--space-between w--100'}>
                            <div className={'flex flex-gap-2 flex--grow w--100'}>
                                <div className={'flex flex--jc--space-between w--100 mb-2'}>
                                    <button
                                        onClick={decreaseWeek}
                                        className={'btn pr-2 pl-2 flex flex--center calendar-button'}
                                        disabled={moment(period.startDate)
                                            .tz(selectedZone)
                                            .isSameOrBefore(moment().tz(selectedZone))}
                                    >
                                        <FaChevronLeft size={15} />
                                    </button>
                                    <span className={'type--calendar'}>
                                        {moment(period.startDate).tz(selectedZone).format('MMM D') +
                                            (moment(period.startDate).tz(selectedZone).format('MMM') !==
                                            moment(period.endDate).tz(selectedZone).format('MMM')
                                                ? ' - ' + moment(period.endDate).tz(selectedZone).format('MMM DD, YYYY')
                                                : ' - ' + moment(period.endDate).tz(selectedZone).format('DD, YYYY'))}
                                    </span>
                                    <button
                                        onClick={increaseWeek}
                                        className={'btn pr-2 pl-2 flex flex--center calendar-button'}
                                    >
                                        <FaChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                            <TimeZoneSelect
                                className={'z-index-5 mb-3'}
                                widthClass={isMobile ? 'w--100' : undefined}
                                defaultUserZone={timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess()}
                                selectedZone={selectedZone}
                                setSelectedZone={setSelectedZone}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={'flex flex--jc--space-between w--100'}>
                        <div className={'flex flex-gap-2'}>
                            <div className={'flex calendar-button-container'}>
                                <button
                                    onClick={decreaseWeek}
                                    className={'btn pr-2 pl-2 flex flex--center calendar-button'}
                                    disabled={moment(period.startDate)
                                        .tz(selectedZone)
                                        .isSameOrBefore(moment().tz(selectedZone))}
                                >
                                    <FaChevronLeft size={15} />
                                </button>
                                <button
                                    onClick={increaseWeek}
                                    className={'btn pr-2 pl-2 flex flex--center calendar-button'}
                                >
                                    <FaChevronRight size={15} />
                                </button>
                            </div>
                            <span>
                                {moment(period.startDate).tz(selectedZone).format('MMM D') +
                                    (moment(period.startDate).tz(selectedZone).format('MMM') !==
                                    moment(period.endDate).tz(selectedZone).format('MMM')
                                        ? ' - ' + moment(period.endDate).tz(selectedZone).format('MMM DD, YYYY')
                                        : ' - ' + moment(period.endDate).tz(selectedZone).format('DD, YYYY'))}
                            </span>
                        </div>
                        <TimeZoneSelect
                            className={'z-index-5 mb-3'}
                            widthClass={isMobile ? 'w--100' : undefined}
                            defaultUserZone={timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess()}
                            selectedZone={selectedZone}
                            setSelectedZone={setSelectedZone}
                        />
                        {onClose && (
                            <button
                                className="btn btn--clear"
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '0',
                                }}
                            >
                                <i className={'icon icon--md icon--close'}></i>
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div>
                {timeSlots ? (
                    <div className={'flex mt-4 flex-gap-1'}>
                        {Object.keys(timeSlots).map((date) => (
                            <div key={date} className={'w--50'}>
                                <div
                                    className={`flex pt-1 pb-2 type--wgt--bold flex--col type--md type--center border-top-calendar${timeSlots[date].length > 0 ? '--primary' : '--secondary'}`}
                                >
                                    <span className={'d--b type--base'}>
                                        {moment(date).format('ddd').substring(0, 3).charAt(0).toUpperCase() +
                                            moment(date).format('ddd').substring(0, 3).slice(1)}
                                    </span>
                                    <span className={'d--b type--base'}>{moment(date).format('DD')}</span>
                                </div>
                                <div className={`type--center timeslot-container ${isExpanded ? 'expanded' : ''}`}>
                                    {timeSlots[date].map((timeSlot) => (
                                        <span
                                            className="d--b mt-4 type--underline cur--pointer type--calendar-slot"
                                            onClick={() => {
                                                if (onClickPeriod) {
                                                    onClickPeriod(moment(timeSlot).toISOString());
                                                }
                                            }}
                                            key={timeSlot}
                                        >
                                            {moment(timeSlot).format('HH:mm')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w--100 flex flex--jc--center mt-10 mb-10">
                        <ClipLoader loading={true} size={50} color={'#7e6cf2'} />
                    </div>
                )}
            </div>
            <button
                onClick={toggleExpand}
                className={'btn btn--secondary  pt-2 pb-2 pr-6 pl-6 mt-4 w--25 align-self-center'}
            >
                {isExpanded ? t('WEEK_BOOKING.SHOW_LESS') : t('WEEK_BOOKING.SHOW_MORE')}
            </button>

            {onClose && (
                <button
                    onClick={onClose}
                    className={
                        'btn btn--base  pt-2 pb-2 pr-6 pl-6 mt-4 w--25 align-self-center btn--clear type--color--error'
                    }
                >
                    {t('WEEK_BOOKING.CLOSE')}
                </button>
            )}
        </div>
    );
};
