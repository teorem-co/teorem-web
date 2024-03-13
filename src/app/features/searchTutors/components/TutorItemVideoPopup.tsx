import React from 'react';
import { IoIosCloseCircle } from 'react-icons/io';

interface Props {
    videoUrl: string;
    onClose: () => void;
}

export const TutorItemVideoPopup = (props: Props) => {
    const { videoUrl, onClose } = props;

    return (
        <div className={'video-modal__overlay'}>
            <div className={'pos--rel'}>
                <iframe
                    id={'iframe-video'}
                    src={videoUrl}
                    width="640"
                    height="360"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ background: 'black' }}
                ></iframe>

                <IoIosCloseCircle
                    onClick={onClose}
                    className={'cur--pointer'}
                    style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                    }}
                    size={30}
                />
            </div>
        </div>
    );
};
