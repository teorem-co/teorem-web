import { t } from 'i18next';
import moment from 'moment';
import { PATHS } from '../../../routes';
import React from 'react';
import { useHistory } from 'react-router';
import { useAcceptRescheduleRequestMutation, useDenyRescheduleRequestMutation } from '../../my-bookings/services/bookingService';
import IBooking from '../../my-bookings/interfaces/IBooking';

interface Props {
    booking: IBooking;
    acceptReschedule: (id: string) => void;
    denyReschedule: (id: string) => void;
}

export const NotAcceptedLesson = (props: Props) => {
    const { booking, acceptReschedule, denyReschedule } = props;
    const isMobile = window.innerWidth < 1200;
    const history = useHistory();

    return (
        <div className="dashboard__requests__item " key={booking.id}>
            <div>
                <span className={'tag tag--success'}>Poslana rezervacija. Cekanje da tutor prihvati</span>
            </div>
            <div>
                {booking.User.firstName}&nbsp;{booking.User.lastName}
            </div>
            <div>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>
            <div className={''}>
                <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
            </div>
            <div className={'flex flex--col'}>
                <span>
                    {moment(booking.startTime).format(t('DATE_FORMAT'))} @&nbsp;
                    {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                </span>
            </div>
        </div>
    );
};
