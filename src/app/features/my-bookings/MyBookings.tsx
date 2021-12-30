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
        const test = date;
        debugger;
        return (
            <>
                <div>test</div>
            </>
        );
    };

    return (
        <MainWrapper>
            <div className="my-bookings">
                <div>
                    <div className="card card--primary card--calendar">
                        <div className="flex--primary mb-6">
                            <h2 className="type--lg">Calendar</h2>
                            <div className="type--wgt--bold type--color--brand">
                                You have 2 Lessions today!
                            </div>
                        </div>
                        <BigCalendar
                            localizer={localizer}
                            events={myEventList}
                            toolbar={false}
                            date={value}
                            view="week"
                            style={{ height: 'calc(100% - 60px)' }}
                            startAccessor="start"
                            endAccessor="end"
                            components={{
                                week: {
                                    header: (date) => CustomHeader(date),
                                },
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
