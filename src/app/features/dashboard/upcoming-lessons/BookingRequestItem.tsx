import { t } from 'i18next';
import moment from 'moment/moment';
import React from 'react';
import IBooking from '../../my-bookings/interfaces/IBooking';

interface Props {
  booking: IBooking,
  handleAccept: (id: string) => void,
  handleDeny: (id: string) => void,
  date: string,
}

export const BookingRequestItem = (props: Props) => {

  const { booking, handleAccept, handleDeny, date } = props;

  return (
    <div className="dashboard__requests__item " key={booking.id}>
      <div>
        <span className="tag tag--success">Nova rezervacija</span>
      </div>
      <div>
        {booking.User.firstName}&nbsp;{booking.User.lastName}
      </div>
      <div>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace("-", "")}`)}</div>
      <div className={""}>
        <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
      </div>
      <div>
        {date} @&nbsp;
        {moment(booking.startTime).format('HH:mm')} -{' '}
        {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
      </div>
      <div className={"flex flex--row flex--jc--space-between mr-4"}>
        <div
          onClick={() => {
            handleAccept(booking.id);
          }
          }>
          <i className="icon icon--base icon--check icon--primary"></i>
        </div>
        <div
          onClick={() => {
            handleDeny(booking.id);
          }
          }>
          <i className="icon icon--base icon--close-request icon--secondary tutor-intro-3"></i>
        </div>
      </div>
    </div>
  );
};
