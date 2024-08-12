import { useEffect, useState } from 'react';

import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppSelector } from '../../../store/hooks';
import { useLazyGetRoomLinkQuery } from '../../../store/services/hiLinkService';
import { useHistory } from 'react-router';
import { IBookingModalInfo } from '../../tutor-bookings/TutorBookings';
import moment from 'moment-timezone';
import { PATHS } from '../../../routes';
import { useLazyCheckIfCanLeaveReviewQuery } from '../../myReviews/services/myReviewsService';
import { RoleOptions } from '../../../store/slices/roleSlice';

interface Props {
    handleClose: () => void;
    bookingInfo: IBookingModalInfo;
}

const LearnCubeModal = (props: Props) => {
    const { bookingInfo, handleClose } = props;

    const [getRoomLink, { isFetching: roomLinkFetching, isUninitialized: roomLinkUninitialized, isLoading: roomLinkLoading }] =
        useLazyGetRoomLinkQuery();

    const [roomLink, setRoomLink] = useState<string | null>(null);

    const isLoading = roomLinkFetching || roomLinkUninitialized || roomLinkLoading || !roomLink;
    const userId = useAppSelector((state) => state.auth.user?.id);
    const [canLeaveReview] = useLazyCheckIfCanLeaveReviewQuery();
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);

    const history = useHistory();

    const fetchRoomLink = async () => {
        const toSend = {
            userId: userId!,
            bookingId: bookingInfo.bookingId,
        };
        const res = await getRoomLink(toSend).unwrap();
        setRoomLink(res.meetingUrl);
    };

    useEffect(() => {
        fetchRoomLink();
    }, []);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    function closeModal() {
        // check if end time is in 5 minutes or less
        const endTime = moment(bookingInfo.endTime).subtract(10, 'minutes'); // removed 10 mins because lessons last 50min
        const currentTime = moment();
        const diff = endTime.diff(currentTime, 'minutes');
        if (userRole != RoleOptions.Tutor && moment().isAfter(endTime.subtract(5, 'minutes'))) {
            //remove 5 mins because we want to give some buffer
            canLeaveReview(bookingInfo.bookingId).then((res) => {
                if (res.data) {
                    history.push(PATHS.COMPLETED_LESSONS + `?bookingId=${bookingInfo.bookingId}&showModal=true`);
                } else {
                    handleClose();
                }
            });
        } else {
            handleClose();
        }
    }

    return (
        <>
            <div className="iframe-modal">
                <img src="/logo-purple-text.png" alt="" className="pos--abs ml-2 mt-5 iframe-logo" height="40px" />
                <i className="icon icon--base icon--close modal__close cur--pointer mt-2 mr-2" onClick={closeModal}></i>
                {(isLoading && <LoaderPrimary />) || (
                    <iframe style={{ width: '100%', height: '100%' }} id="frame" src={roomLink!} allow="camera;microphone;display-capture"></iframe>
                )}
            </div>
        </>
    );
};

export default LearnCubeModal;
