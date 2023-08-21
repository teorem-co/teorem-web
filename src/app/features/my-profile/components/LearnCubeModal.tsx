import { useEffect, useState } from 'react';

import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppSelector } from '../../../hooks';
import { useLazyGetRoomLinkQuery } from '../../../services/hiLinkService';

interface Props {
    handleClose: () => void;
    bookingId: string;
}

const LearnCubeModal = (props: Props) => {
    const { bookingId, handleClose } = props;

    const [getRoomLink, { isFetching: roomLinkFetching, isUninitialized: roomLinkUninitialized, isLoading: roomLinkLoading }] =
        useLazyGetRoomLinkQuery();

    const [roomLink, setRoomLink] = useState<string | null>(null);

    const isLoading = roomLinkFetching || roomLinkUninitialized || roomLinkLoading || !roomLink;
    const userId = useAppSelector((state) => state.auth.user?.id);

    const fetchRoomLink = async () => {
        const toSend = {
            userId: userId!,
            bookingId: bookingId,
        };
        const res = await getRoomLink(toSend).unwrap();
        setRoomLink(res.meetingUrl);
    };

    useEffect(() => {
        fetchRoomLink();
    }, []);

    return (
        <>
            <div className="modal__overlay" style={{ width: '100%' }}>
                <div className="modal modal--stripe">
                    <i className="icon icon--base icon--close modal__close" onClick={handleClose}></i>

                    <div className="modal__body">
                        {(isLoading && <LoaderPrimary />) || (
                            <iframe style={{ width: '100%' }} id="frame" src={roomLink!} allow="camera;microphone"></iframe>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LearnCubeModal;
