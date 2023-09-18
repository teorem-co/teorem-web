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

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        handleClose();
      }
    });

    return (
        <>
          <div className="iframe-modal">
            <img src='/logo-purple-text.png' alt='' className="pos--abs ml-2 mt-5 iframe-logo" height='40px'/>
            <i className="icon icon--base icon--close modal__close cur--pointer mt-2 mr-2" onClick={handleClose}></i>
              {(isLoading && <LoaderPrimary />) || (
                  <iframe style={{ width: '100%', height:'100%' }} id="frame" src={roomLink!} allow="camera;microphone"></iframe>
              )}
          </div>
        </>
    );
};

export default LearnCubeModal;
