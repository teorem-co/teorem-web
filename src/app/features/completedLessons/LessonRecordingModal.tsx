import { useEffect, useState } from 'react';

import {
  IMeetRecording,
} from '../../services/hiLinkService';
import { ClipLoader } from 'react-spinners';

interface Props {
  handleClose: () => void;
  activeRecording: IMeetRecording;
}

const LessonRecordingModal = (props: Props) => {
  const {activeRecording, handleClose } = props;

  const [isVideoReady, setIsVideoReady] = useState(false);
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);


  return (
    <>
      {isVideoReady ?
        <></> :
        <div className="video-modal__overlay">
          <ClipLoader size={80} color='#7e6cf2'/>
        </div>
      }
        <div className={`d__${isVideoReady ? 'visible' : 'hidden'}`}>
            <div className="video-modal__overlay" style={{backgroundColor: 'white'}}>
              <video
                key={activeRecording.videoUrl}
                width='auto'
                height='100%'
                controls
                preload='metadata'
                autoPlay={true}
                onLoadedMetadata={() => {
                  setIsVideoReady(true);
                }}
              >
                <source src={activeRecording.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="video-icon--close" style={{display:'flex', flexDirection:'row', alignContent:'baseline' }}>
                <img  className="video-modal-logo mt-2 mr-2" src='/logo-purple-text.png' alt='logo'></img>
                <i onClick={handleClose} className="icon icon--md icon--close icon--grey mt-2 mr-2"></i>
              </div>
          </div>
        </div>
    </>
  );
};

export default LessonRecordingModal;
