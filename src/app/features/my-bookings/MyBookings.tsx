import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import MainWrapper from '../../components/MainWrapper';
import myEventList from '../../constants/bookingEvents';

const MyBookings: React.FC = () => {
    const localizer = momentLocalizer(moment);

    return (
        <MainWrapper>
            <div className="my-bookings">
                <div>
                    <div className="card card--primary">
                        <div className="flex--primary mb-6">
                            <h2 className="type--lg">Calendar</h2>
                            <div className="type--wgt--bold type--color--brand">
                                You have 2 Lessions today!
                            </div>
                        </div>
                        <Calendar
                            localizer={localizer}
                            events={myEventList}
                            style={{ height: '80.2vh' }}
                            startAccessor="start"
                            endAccessor="end"
                        />
                    </div>
                </div>
                <div>
                    <div className="card card--primary mb-4">mali kalendar</div>
                    <p className="type--color--secondary mb-2">
                        UPCOMING EVENTS
                    </p>
                    <div className="card card--primary mb-2">event-1</div>
                    <div className="card card--primary mb-2">event-2</div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyBookings;
