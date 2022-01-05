import 'moment/locale/en-gb';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Calendar from 'react-calendar';

import MainWrapper from '../../components/MainWrapper';
import upcomingLessons from '../../constants/upcomingLessons';
import { useAppSelector } from '../../hooks';
import UpcomingLessons from './components/UpcomingLessons';
import { useLazyGetBookingsQuery } from './services/bookingService';

const MyBookings: React.FC = () => {
    const localizer = momentLocalizer(moment);
    const [value, onChange] = useState(new Date());
    const [calChange, setCalChange] = useState<boolean>(false);

    const [getBookings, {data: bookings}] = useLazyGetBookingsQuery();
    const userId = useAppSelector(state => state.user.user?.id);
    
    useEffect(() => {
        if (userId) {
            getBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(), 
                dateTo: moment(value).endOf('isoWeek').toISOString(),
                userId
        }); 
        }
    }, [value, userId]);

    const myEvents = bookings ? bookings.rows.map(x =>
        {
            return {
                id: x.id,
                label: x.Subject ? x.Subject.abrv : 'No title',
                start: new Date(x.startTime),
                end: new Date(x.endTime),
                allDay: false,
            };
        }
    ) : [];

    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));

    const CustomHeader = (date: any) => {
        setCalChange(true);
        return (
            <>
                <div className="mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary">
                    {moment(date.date).format('DD.MM')}
                </div>
            </>
        );
    };

    useEffect(() => {
        const indicator: any = document.getElementsByClassName(
            'rbc-current-time-indicator'
        );
        indicator[0] &&
            indicator[0].setAttribute('data-time', moment().format('HH:mm'));

        const interval = setInterval(() => {
            indicator[0] &&
                indicator[0].setAttribute(
                    'data-time',
                    moment().format('HH:mm')
                );
        }, 60000);
        return () => clearInterval(interval);
    }, [calChange]);

    const CustomEvent = (event: any) => {
        return (
            <>
                <div className="mb-2">
                    {moment(event.event.start).format('HH:mm')}
                </div>
                <div className="type--wgt--bold">{event.event.label}</div>
            </>
        );
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };
    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    return (
        <MainWrapper>
            <div className="my-bookings">
                <div>
                    <div className="card--calendar">
                        <div className="flex--primary p-6">
                            <h2 className="type--lg">Calendar</h2>
                            <div className="type--wgt--bold type--color--brand">
                                You have 2 Lessions today!
                            </div>
                        </div>
                        <BigCalendar
                            localizer={localizer}
                            formats={{
                                timeGutterFormat: 'HH:mm',
                            }}
                            events={myEvents}
                            toolbar={false}
                            date={value}
                            view="week"
                            style={{ height: 'calc(100% - 84px)' }}
                            startAccessor="start"
                            endAccessor="end"
                            components={{
                                week: {
                                    header: (date) => CustomHeader(date),
                                },
                                event: (event) => CustomEvent(event),
                            }}
                            scrollToTime={defaultScrollTime}
                        />
                    </div>
                </div>
                <div>
                    <div className="card card--primary mb-4">
                        <Calendar
                            onChange={(e: Date) => {onChange(e); setCalChange(!calChange);}}
                            value={value}
                            prevLabel={<PrevIcon />}
                            nextLabel={<NextIcon />}
                        />
                    </div>
                    <div className="upcoming-lessons">
                        <UpcomingLessons upcomingLessons={upcomingLessons} />
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyBookings;
