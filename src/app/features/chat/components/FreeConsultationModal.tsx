import { useEffect, useRef, useState } from 'react';

interface Props {
  handleClose: () => void;
  myStream: any;
  guestStream: any;
}

const FreeConsultationModal = (props: Props) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const guestStream = props.guestStream;
  const myStream = props.myStream;

  const videoRef = useRef<any>(null);
  const videoRef2 = useRef<any>(null);

  const onIframeLoad = () => {

    setIsLoading(false);
  };

  useEffect(() => {

    if (myStream) {
      videoRef.current.muted = true;

      if ('srcObject' in videoRef.current) {
        videoRef.current.srcObject = myStream;
      } else {
        videoRef.current.src = window.URL.createObjectURL(myStream); // for older browsers
      }
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      });
    }

  }, [myStream]);

  useEffect(() => {

    if (guestStream) {

      if ('srcObject' in videoRef2.current) {
        videoRef2.current.srcObject = guestStream;
      } else {
        videoRef2.current.src = window.URL.createObjectURL(guestStream); // for older browsers
      }
      videoRef2.current.addEventListener('loadedmetadata', () => {
        videoRef2.current.play();
      });
    }

  }, [guestStream]);

  return (
    <>
      <div className='modal__overlay'>
        <div className='modal modal--stripe'>
          <i className='icon icon--base icon--close modal__close'
             onClick={props.handleClose}></i>

          <div className='modal__body'>
            <video ref={videoRef} style={{ width: '50%' }} id='video-host'
                   onLoad={onIframeLoad}></video>
            <video ref={videoRef2} style={{ width: '50%' }} id='video-guest'
                   onLoad={onIframeLoad}></video>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeConsultationModal;
