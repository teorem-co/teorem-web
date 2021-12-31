import moment from 'moment';
import { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Calendar from 'react-calendar';

import MainWrapper from '../../components/MainWrapper';
import myEventList from '../../constants/bookingEvents';
import upcomingLessons from '../../constants/upcomingLessons';
import UpcomingLessons from './components/UpcomingLessons';

const MyBookings: React.FC = () => {
    const localizer = momentLocalizer(moment);
    const [value, onChange] = useState(new Date());

    const CustomHeader = (date: any) => {
        return (
            <>
                <div className="mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary">
                    {moment(date.date).format('DD.MM')}
                </div>
            </>
        );
    };

    const CustomEvent = (event: any) => {
        return (
            <>
                <div>
                    <div className="mb-2">
                        {moment(event.event.start).format('HH:mm')}
                    </div>
                    <div className="type--wgt--bold">{event.event.label}</div>
                </div>
            </>
        );
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
                            events={myEventList}
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
                        />
                    </div>
                </div>
                <div>
                    <div className="card card--primary mb-4">
                        <Calendar onChange={onChange} value={value} />
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
