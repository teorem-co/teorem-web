import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect } from 'react';

import { RoleOptions } from '../../../../slices/roleSlice';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import { useDeleteBookingMutation } from '../services/bookingService';
import { Tooltip } from 'react-tooltip';

interface IProps {
    handleClose?: (close: boolean) => void;
    openLearnCube?: () => void;
    positionClass: string;
    event: IBooking | null;
    tutorName: string;
    openEditModal: (isOpen: boolean) => void;
    bookingStart: string;
    eventIsAccepted: boolean;
}

const ParentEventModal: React.FC<IProps> = (props) => {
    const { handleClose, positionClass, event, tutorName, openEditModal, bookingStart, eventIsAccepted, openLearnCube } = props;
    const [deleteBooking, { isSuccess: isSuccessDeleteBooking }] = useDeleteBookingMutation();
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const handleDeleteBooking = () => {
        if (event) {
            deleteBooking(event.id);
            handleClose ? handleClose(false) : false;
        }
    };

    useEffect(() => {
        if (isSuccessDeleteBooking) {
            toastService.success('Booking deleted');
        }
    }, [isSuccessDeleteBooking]);

    function isJoinButtonDisabled(event: IBooking){
      // you can't join more than 10 minutes before start OR after meeting has ended
      return !(moment(bookingStart).subtract(10, 'minutes').isBefore(moment()) && moment(event.endTime).isAfter(moment()));
    }

    return (
        <>
            {/*TODO: ovo je kada otvoris kod tutora i takav bi trebao bit na vlastitom kalendaru*/}
            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">{t(`SUBJECTS.${event.Subject.abrv.replace(' ', '').replaceAll('-', '').toLowerCase()}`)}</div>

                                <div className="type--color--secondary">
                                    {moment.utc(event.startTime).format(t('DATE_FORMAT') + ', HH:mm')} - {moment.utc(event.endTime).add(1, 'minutes').format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                              <Tooltip
                                clickable={true}
                                openOnClick={true}
                                id="booking-info"
                                place={'left-start'}
                                positionStrategy={'absolute'}
                                closeOnEsc={true}
                                style={{ zIndex: 9, fontSize:'14px'}}
                              />

                              <i className="icon icon--base icon--grey icon--info mr-4"
                                // onClick={handleShowInfo}
                                 data-tooltip-id='booking-info'
                                 data-tooltip-html={"" +
                                   "<div>Rescheduling info</div> " +
                                   "<div>info 1</div>" +
                                   "<div>info 2</div>" +
                                   "<div>info 3</div>" +
                                   "<div>info 4</div>" +
                                   "<div>info 5</div>" +
                                   ""}
                              ></i>

                                {!moment(event.startTime).isBefore(moment().add(3, 'hours')) && (
                                    <i className="icon icon--base icon--grey icon--edit mr-4" onClick={() => openEditModal(true)}/>
                                )}

                                {moment(bookingStart).isSame(moment(), 'day') ? (
                                    <></>
                                ) : (
                                    <>
                                        <i className="icon icon--base icon--grey icon--delete mr-4" onClick={() => handleDeleteBooking()}/>
                                    </>

                                )}
                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose ? handleClose(false) : false;
                                        openEditModal(false);
                                    }}/>
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--tutor icon--grey mr-4"></i>
                            <div className="type--color--secondary">{tutorName}</div>
                        </div>

                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                              {t(`SUBJECTS.${event.Subject.abrv.replace(' ', '').replace('-', '').toLowerCase()}`)} -

                                {event.Level.name === 'IB (International Baccalaurate)' ?
                                    <td>{t('LEVELS.ib')}</td> :
                                    <td>{t(`LEVELS.${event.Level.name.replace('-', '').replace(' ', '').toLowerCase()}`)}</td>
                                }
                            </div>
                        </div>
                        {userRole === RoleOptions.Student ? (
                            <></>
                        ) : (
                            <div className="flex flex--center">
                                <i className="icon icon--base icon--child icon--grey mr-4"></i>
                                <div className="type--color--secondary">{event.userFullName}</div>
                            </div>
                        )}
                    </div>
                    <div className="modal--parent__footer mt-6">
                      <Tooltip
                        id="join-meeting-button"
                        place={'top-start'}
                        float={true}
                        positionStrategy={'absolute'}
                        closeOnEsc={true}
                        delayShow={500}
                        // style={{ zIndex: 9, fontSize:'14px'}}
                        style={{ backgroundColor: "rgba(70,70,70, 0.9)", color: 'white', fontSize:'smaller'}}
                      />

                        {/*TODO: add new message*/}
                        {eventIsAccepted &&
                          (
                                <button
                                  id="join-meeting-button"
                                  data-tip="Click to view invoice"
                                  data-tooltip-id='join-meeting-button'
                                  data-tooltip-html={"<div>DISABLAN je jer mozes samo</div>"}
                                  disabled={isJoinButtonDisabled(event)}
                                  className="btn btn--base type--wgt--extra-bold btn--primary" onClick={() => openLearnCube && openLearnCube()}>
                                    {t('BOOK.JOIN')}
                                </button>
                            )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default ParentEventModal;
