import { t } from 'i18next';
import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router';
import IBooking from '../../my-bookings/interfaces/IBooking';
import { Tooltip } from 'react-tooltip';

interface Props {
    booking: IBooking;
}

export const NotAcceptedLesson = (props: Props) => {
    const { booking } = props;
    const isMobile = window.innerWidth < 1200;
    const history = useHistory();

    const message = `Vaša rezervacija je poslana, tutor ima još ${getTimeLeft()} h da prihvati vašu rezervaciju`;

    function getTimeLeft(): string {
        const time = moment.duration(moment(booking.createdAt).add(1, 'day').diff(moment())).hours();
        return '<' + (time + 1);
    }
    return (
        <div data-tooltip-id={`new-booking-${booking.id}`} data-tooltip-content={message} data-tooltip-float>
            <div className="dashboard__requests__item" key={booking.id}>
                <div className={'dashboard-booking-request-parent'}>
                    <div>
                        <span className={'tag tag--success'}>{t('DASHBOARD.REQUESTS.STATUS.NEW_BOOKING_REQUESTED')}</span>
                    </div>
                    <div>
                        {booking.User.firstName}&nbsp;{booking.User.lastName}
                    </div>
                    <div>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>
                    <div>
                        <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
                    </div>
                    <div>
                        <span>
                            {moment(booking.startTime).format(t('DATE_FORMAT'))} @&nbsp;
                            {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                        </span>
                    </div>
                </div>
                <div></div>
            </div>
            <Tooltip id={`new-booking-${booking.id}`} place="right-end" />
        </div>
    );
};
