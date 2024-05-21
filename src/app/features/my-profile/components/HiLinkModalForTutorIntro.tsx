import { useEffect, useRef } from 'react';

interface Props {
    handleClose: () => void;
    roomLink: string;
}

export const HiLinkModalForTutorIntro = (props: Props) => {
    const { handleClose, roomLink } = props;
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleLoad = () => {
            if (iframeRef.current) {
                console.log('************************************URL CHANGEEEEEEEEEED!!!!!!!!!!!!:', iframeRef.current);
            }
        };

        if (iframeRef.current) {
            iframeRef.current.addEventListener('load', handleLoad);
            iframeRef.current.addEventListener('click', (e) => {
                console.log('*******CLICKED ', e);
            });
        }

        return () => {
            if (iframeRef.current) {
                iframeRef.current.removeEventListener('load', handleLoad);
            }
        };
    }, []);

    return (
        <>
            <div className="iframe-modal">
                <img src="/logo-purple-text.png" alt="" className="pos--abs ml-2 mt-5 iframe-logo" height="40px" />
                <i className="icon icon--base icon--close modal__close cur--pointer mt-2 mr-2" onClick={handleClose}></i>
                <iframe
                    ref={iframeRef}
                    style={{ width: '100%', height: '100%' }}
                    id="frame"
                    src={roomLink!}
                    allow="camera;microphone;display-capture"
                ></iframe>
            </div>
        </>
    );
};
