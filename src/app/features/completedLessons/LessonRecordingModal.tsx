import { useEffect, useState } from 'react';

import IGetRecordingLinks from '../../../interfaces/IGetRecordingLinks';
import { useLazyGetRecordingLinksQuery } from '../../services/hiLinkService';
import { ClipLoader } from 'react-spinners';

interface Props {
  handleClose: () => void;
  meetingId: string;
  recordingUrl: string;
}

const LessonRecordingModal = (props: Props) => {
  const {meetingId, handleClose } = props;
  const [meetingTitle, setMeetingTitle] = useState<string>();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [getRecordingLinks] = useLazyGetRecordingLinksQuery();
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    fetchData();

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  async function fetchData(){
    const toSend: IGetRecordingLinks = {
      meetingId
    };

    try{
      const res = await getRecordingLinks(toSend).unwrap();
      setVideoUrl(res[0].videoUrl); // TODO: this is getting url only of first recording
      setMeetingTitle(res[0].meetingTitle);
      setIsLoading(false);
    }catch (e){
      setIsVideoReady(true); // turn of spinner if there is error
      handleClose();
    }
  }

  return (
    <>
      {isVideoReady ?
        <></> :
        <div className="video-modal__overlay">
          <ClipLoader size={80} color='#7e6cf2'/>
        </div>
      }
      {!isLoading ?
        <div className={`video-modal__overlay d__${isVideoReady ? 'visible' : 'hidden'}`}>
        {meetingTitle &&
            <div className='type--lg video-modal-title'>
            {meetingTitle}
          </div>}
            <div className="video-modal__video-container">
              <video
                controls
                preload='metadata'
                onLoadedMetadata={() => {
                  setIsVideoReady(true);
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <i onClick={handleClose} className="icon icon--md icon--close video-icon--close icon--grey"></i>
          </div>
        </div>
        :
        <></>
      }

    </>
  );
};

export default LessonRecordingModal;
