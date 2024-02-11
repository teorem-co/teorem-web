import { t } from 'i18next';
import moment from 'moment';
import { PATHS } from '../../../routes';
import React from 'react';
import { useHistory } from 'react-router';
import { useAcceptRescheduleRequestMutation, useDenyRescheduleRequestMutation } from '../../my-bookings/services/bookingService';
import IBooking from '../../my-bookings/interfaces/IBooking';
import { Tooltip } from 'react-tooltip';

interface Props {
    booking: IBooking;
}

export const PendingRescheduleRequestItem = (props: Props) => {
    const { booking } = props;
    const isMobile = window.innerWidth < 1200;
    const history = useHistory();

    return (
        // <>
        //   {!isMobile ? <div className='flex flex--row flex--jc--space-between flex--ai--center' key={bookingId}>
        //       <div>
        //         {firstName}&nbsp;{lastName}
        //       </div>
        //       <div>{t(`LEVELS.${levelAbrv.toLowerCase().replace('-', '')}`)}</div>
        //       <div>
        //         <span
        //           className='tag tag--primary'>{t(`SUBJECTS.${subjectAbrv.replaceAll('-', '')}`)}</span>
        //       </div>
        //     <span>
        //       Korisnik xy zeli promjeniti termin sa {moment(startTime).format('HH:mm')} -{' '} na {moment(suggestedStartTime).format('HH:mm')} -{' '}
        //     </span>
        //      <div className='flex flex--col'>
        //        <del>
        //          {moment(startTime).format('HH:mm')} -{' '}
        //          {moment(endTime).add(1, 'minute').format('HH:mm')}
        //        </del>
        //        <div>
        //          {moment(suggestedStartTime).format('HH:mm')} -{' '}
        //          {moment(suggestedEndTime).add(1, 'minute').format('HH:mm')}
        //        </div>
        //      </div>
        //       <div className='flex'>
        //         <div
        //           onClick={() => {
        //             //todo: accept new time
        //             acceptReschedule(bookingId);
        //             console.log('Accepting new time...');
        //           }}>
        //           <i className='icon icon--base icon--check icon--primary'></i>
        //         </div>
        //         <div
        //           onClick={() => {
        //             //todo: deny new time
        //             denyReschedule(bookingId);
        //             console.log('Denying new time...');
        //           }}>
        //           <i className='icon icon--base icon--close icon--primary'></i>
        //         </div>
        //       </div>
        //     </div>
        //
        //     :
        //     // MOBILE
        //     <div className='dashboard-upcoming-item' key={bookingId}>
        //       <div
        //         className='flex flex--row flex--ai--center flex--jc--space-between'>
        //         <div className='flex flex--col'>
        //           <span className='mb-2 ml-1'> {firstName}&nbsp;{lastName}</span>
        //           <span
        //             style={{ margin: 0, padding: '0 5px', width: 'fit-content' }}
        //             className='tag tag--primary text-align--start '>{t(`SUBJECTS.${subjectAbrv.replaceAll('-', '')}`)}</span>
        //         </div>
        //
        //         <div className='flex flex--col'>
        //           <div className='flex flex--row flex--ai--center mb-2'>
        //             <p> {moment(startTime).format('HH:mm')} -{' '}
        //               {moment(endTime).add(1, 'minute').format('HH:mm')}</p>
        //
        //           </div>
        //           <p>{t(`LEVELS.${levelAbrv.toLowerCase().replaceAll('-', '')}`)}</p>
        //         </div>
        //
        //         <div className='flex'>
        //           <div
        //             onClick={() => {
        //               //todo: accept new time
        //               acceptReschedule(bookingId);
        //               console.log('Accepting new time...');
        //             }}>
        //             <i className='icon icon--base icon--check icon--primary'></i>
        //           </div>
        //           <div
        //             onClick={() => {
        //               //todo: deny new time
        //               denyReschedule(bookingId);
        //               console.log('Denying new time...');
        //             }}>
        //             <i className='icon icon--base icon--close icon--primary'></i>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   }
        // </>

        <div className="dashboard__requests__item" key={booking.id}>
            <div
                data-tooltip-id={`pending-reschedule-${booking.id}`}
                data-tooltip-content={'Vaša izmjena je poslana, druga strana ima X sati da prihvati vašu izmjenu'}
                data-tooltip-float
                className={'dashboard-booking-request-parent'}
            >
                <div>
                    <span className={'tag tag--warning'}>{t('DASHBOARD.REQUESTS.STATUS.RESCHEDULE_REQUESTED')}</span>
                </div>
                <div>
                    {booking.User.firstName}&nbsp;{booking.User.lastName}
                </div>
                <div>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>
                <div className={''}>
                    <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
                </div>
                <div className={'flex flex--col'}>
                    <del>
                        {moment(booking.startTime).format(t('DATE_FORMAT'))} @&nbsp;
                        {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                    </del>
                    <span>
                        {moment(booking.suggestedStartTime).format(t('DATE_FORMAT'))} @&nbsp;
                        {moment(booking.suggestedStartTime).format('HH:mm')} - {moment(booking.suggestedEndTime).add(1, 'minute').format('HH:mm')}
                    </span>
                </div>
            </div>

            <div className={'flex flex--row flex--jc--end'}>
                <i className="icon icon--base icon--reschedule cur--default d__hidden"></i>
                <i className="icon icon--base icon--reschedule cur--default"></i>
            </div>
            <Tooltip id={`pending-reschedule-${booking.id}`} place="right-end" />
        </div>
    );
};
