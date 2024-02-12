import { t } from 'i18next';
import moment from 'moment';
import React from 'react';
import IBooking from '../../my-bookings/interfaces/IBooking';
import { Tooltip } from 'react-tooltip';

interface Props {
    booking: IBooking;
}

export const PendingRescheduleRequestItem = (props: Props) => {
    const { booking } = props;
    const isMobile = window.innerWidth < 1200;

    return (
        <>
            {isMobile ? (
                <div className=" dashboard__requests__item flex flex--col flex--jc--center flex--ai--center" key={booking.id}>
                    <div
                        data-tooltip-id={`accept-reschedule-${booking.id}`}
                        data-tooltip-content={'Druga strana je zatrazila izmjenu. Imate još XXXX sati da prihvatite.'}
                        data-tooltip-float
                        className={'dashboard-booking-request-parent-mobile'}
                    >
                        <span className={'tag tag--warning mb-2 mr-0'}>{t('DASHBOARD.REQUESTS.STATUS.RESCHEDULE_DO_ACTION')}</span>
                        <div className="flex flex--row flex--jc--center"></div>
                        <div>
                            {booking.User.firstName}&nbsp;{booking.User.lastName}
                        </div>
                        <div className={''}>
                            <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
                        </div>
                        <div className={'mb-2'}>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>

                        <div className={'flex flex--col'}>
                            <del>
                                {moment(booking.startTime).format(t('DATE_FORMAT'))} @&nbsp;
                                {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                            </del>
                            <span>
                                {moment(booking.suggestedStartTime).format(t('DATE_FORMAT'))} @&nbsp;
                                {moment(booking.suggestedStartTime).format('HH:mm')} -{' '}
                                {moment(booking.suggestedEndTime).add(1, 'minute').format('HH:mm')}
                            </span>
                        </div>
                    </div>
                    <i className="icon icon--base icon--reschedule cur--default mt-2"></i>
                    <Tooltip id={`accept-reschedule-${booking.id}`} place="right-end" />
                </div>
            ) : (
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
                                {moment(booking.suggestedStartTime).format('HH:mm')} -{' '}
                                {moment(booking.suggestedEndTime).add(1, 'minute').format('HH:mm')}
                            </span>
                        </div>
                    </div>

                    <div className={'flex flex--row flex--jc--end'}>
                        <i className="icon icon--base icon--reschedule cur--default d__hidden"></i>
                        <i className="icon icon--base icon--reschedule cur--default"></i>
                    </div>
                    <Tooltip id={`pending-reschedule-${booking.id}`} place="right-end" />
                </div>
            )}
        </>
    );
};
