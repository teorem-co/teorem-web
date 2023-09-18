import { t } from 'i18next';
import moment from 'moment';

import { RoleOptions } from '../../../../slices/roleSlice';
import { useAppSelector } from '../../../hooks';
import IBooking from '../interfaces/IBooking';
import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

interface IEvent {
    id?: string;
    label: string;
    start: string;
    end: string;
    allDay: boolean;
}

interface IProps {
    handleClose?: (close: boolean) => void;
    openLearnCube?: () => void;
    positionClass: string;
    event: IBooking | null;
    goToTutorCalendar: () => void;
}

const OpenTutorCalendarModal: React.FC<IProps> = (props) => {
    const { handleClose, positionClass, event, goToTutorCalendar, openLearnCube } = props;

    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const [showInfo, setShowInfo] = useState(false);

    function handleShowInfo() {
      setShowInfo(!showInfo);
    }

  return (
        <>
            {/*TODO: ovo je komponenta na vlastitom kalendaru*/}

            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {event.Tutor.User.firstName} {event.Tutor.User.lastName}
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event.startTime).format(t('DATE_FORMAT') + ', HH:mm')} - {moment(event.endTime).add(1, 'minutes').format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                              {/* THIS IS FOR TOOLTIP ON MEETING MODAL*/}
                              {/*<Tooltip*/}
                              {/*  clickable={true}*/}
                              {/*  openOnClick={true}*/}
                              {/*  id="booking-info"*/}
                              {/*  place={'left-start'}*/}
                              {/*  positionStrategy={'absolute'}*/}
                              {/*  closeOnEsc={true}*/}
                              {/*  style={{ zIndex: 9, fontSize:'14px'}}*/}
                              {/*/>*/}

                              {/* <i className="icon icon--base icon--grey icon--info"*/}
                              {/*    // onClick={handleShowInfo}*/}
                              {/*    data-tooltip-id='booking-info'*/}
                              {/*    data-tooltip-html={"" +*/}
                              {/*      "<div>Rescheduling info</div> " +*/}
                              {/*      "<div>info 1</div>" +*/}
                              {/*      "<div>info 2</div>" +*/}
                              {/*      "<div>info 3</div>" +*/}
                              {/*      "<div>info 4</div>" +*/}
                              {/*      "<div>informacija</div>" +*/}
                              {/*      ""}*/}
                              {/* ></i>*/}

                              {/*<i className="icon icon--base icon--grey icon--info"*/}
                              {/*  // onClick={handleShowInfo}*/}
                              {/*   data-tooltip-id='booking-info'*/}
                              {/*   data-tooltip-html={"" +*/}
                              {/*     "<div>Rescheduling info</div> " +*/}
                              {/*     "<div>info 1</div>" +*/}
                              {/*     "<div>info 2</div>" +*/}
                              {/*     "<div>info 3</div>" +*/}
                              {/*     "<div>info 4</div>" +*/}
                              {/*     "<div>informacija</div>" +*/}
                              {/*     ""}*/}
                              {/*></i>*/}


                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose ? handleClose(false) : false;
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {t(`SUBJECTS.${event.Subject.abrv}`)} -{' '}
                                {event.Level.name === 'IB (International Baccalaurate)'
                                    ? t('LEVELS.ib')
                                    : t(`LEVELS.${event.Level.name.replace('-', '').replace(' ', '').toLowerCase()}`)}
                            </div>
                        </div>

                        <div className="flex flex--center">
                            <i className="icon icon--base icon--child icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {event.User.firstName} {event.User.lastName}
                            </div>
                        </div>
                    </div>
                    <div className="modal--parent__footer mt-6">
                        {userRole !== RoleOptions.Child && (
                            <button className="btn btn--base btn--primary type--wgt--extra-bold" onClick={() => goToTutorCalendar()}>
                                {t('MY_BOOKINGS.MODAL.TUTOR_CALENDAR')}
                            </button>
                        )}

                        {event.isAccepted
                          //TODO: uncomment later or maybe show button but disable it
                            //&&
                        // moment(event.startTime).subtract(10, 'minutes').isBefore(moment()) &&
                        // moment(event.endTime).isAfter(moment())
                            && (
                            <button className="btn btn--base btn--primary mt-4" onClick={() => openLearnCube && openLearnCube()}>
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

export default OpenTutorCalendarModal;
