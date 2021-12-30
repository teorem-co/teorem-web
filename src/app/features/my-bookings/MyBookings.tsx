import moment from 'moment';
import { useState } from 'react';
import BigCalendar, { Calendar } from 'react-big-calendar';

import MainWrapper from '../../components/MainWrapper';

const MyBookings: React.FC = () => {
    const localizer = BigCalendar.momentLocalizer(moment);
    const [currentMonth] = useState<string>(
        moment().startOf('month').format('MM/DD/yyyy')
    );
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    if (selectedSlot === 'adwdjawpihdw') {
        alert(selectedSlot);
    }
    const myEventList = [
        {
            id: 1,
            label: 'Ured struja',
            title: '42000',
            start: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
            className: '',
        },
        {
            id: 9,
            label: 'Nekakav inflow',
            title: '42000',
            start: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
            className: '',
        },
        {
            id: 2,
            label: 'Gaming oprema',
            title: '-42000',
            start: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 3,
            label: 'Hrana',
            title: '42000',
            start: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 4,
            label: 'Jana mjesecna naplata',
            title: '-10000',
            start: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 10,
            label: 'Jana mjesecna naplata',
            title: '-10000',
            start: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 11,
            label: 'Jana mjesecna naplata',
            title: '10000',
            start: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 12,
            label: 'Jana mjesecna naplata',
            title: '-10000',
            start: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 13,
            label: 'Jana mjesecna naplata',
            title: '10000',
            start: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 14,
            label: 'Jana mjesecna naplata',
            title: '10000',
            start: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Wed Nov 17 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },

        {
            id: 5,
            label: 'Marketing kampanja',
            title: '-12356',
            start: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Tue Nov 16 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 6,
            label: 'Nove stolice',
            title: '22000',
            start: new Date(
                'Thu Nov 18 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Thu Nov 18 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 7,
            label: 'Marketing kampanja',
            title: '-12356',
            start: new Date(
                'Tue Nov 02 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Tue Nov 02 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
        {
            id: 8,
            label: 'Nove stolice',
            title: '22000',
            start: new Date(
                'Thu Nov 07 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            end: new Date(
                'Thu Nov 07 2021 00:10:00 GMT+0100 (Central European Standard Time)'
            ),
            allDay: false,
        },
    ];

    const eventStyleGetter = (event: any) => {
        return {
            className: Number(event.title) > 0 ? 'rbc-success' : 'rbc-error',
        };
    };
    const handleSelectedSlot = (e: any) => {
        setSelectedSlot(moment(e.start).format('MMM DD. yyyy'));
        return {
            style: { backgroundColor: 'red' },
        };
    };

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
                            events={[]}
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
