import moment from 'moment';
import { useEffect } from 'react';

import { RoleOptions } from '../../../../slices/roleSlice';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import { useDeleteBookingMutation } from '../services/bookingService';

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

    return (
        <>
            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">{event.Subject.name}</div>
                                <div className="type--color--secondary">
                                    {moment(event.startTime).format('DD/MMM/YYYY, HH:mm')} - {moment(event.endTime).add(1, 'minutes').format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                                {!moment(event.startTime).isBefore(moment().add(3, 'hours')) && (
                                    <i className="icon icon--base icon--grey icon--edit mr-4" onClick={() => openEditModal(true)}></i>
                                )}

                                {moment(bookingStart).isSame(moment(), 'day') ? (
                                    <></>
                                ) : (
                                    <i className="icon icon--base icon--grey icon--delete mr-4" onClick={() => handleDeleteBooking()}></i>
                                )}
                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose ? handleClose(false) : false;
                                        openEditModal(false);
                                    }}
                                ></i>
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
                                {event.Subject.name} - {event.Level.name}
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
                        {eventIsAccepted === false ? (
                            <></>
                        ) : (
                            <button className="btn btn--base type--wgt--extra-bold btn--primary" onClick={() => openLearnCube && openLearnCube()}>
                                Join
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
