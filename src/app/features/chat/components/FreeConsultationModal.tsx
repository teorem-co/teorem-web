import { useEffect, useState } from 'react';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppSelector } from '../../../hooks';
import { useLazyGetRoomLinkQuery } from '../../../services/learnCubeService';

interface Props {
    handleClose: () => void;
    link: string;
}

const FreeConsultationModal = (props: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const onIframeLoad = () => {

        setIsLoading(false);
    };

    return (
        <>
            <div className="modal__overlay">
                <div className="modal modal--stripe">
                    <i className="icon icon--base icon--close modal__close" onClick={props.handleClose}></i>

                    <div className="modal__body">
                        {
                            <iframe style={{ width: '100%' }} id="frame" onLoad={onIframeLoad} src={props.link} allow="camera;microphone"></iframe>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default FreeConsultationModal;
