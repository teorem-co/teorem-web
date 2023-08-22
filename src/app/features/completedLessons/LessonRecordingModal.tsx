import { useEffect, useState } from 'react';

import IGetRecordingLinks from '../../../interfaces/IGetRecordingLinks';
import {
  IMeetRecording,
  useLazyGetRecordingLinksQuery,
} from '../../services/hiLinkService';
import { ClipLoader } from 'react-spinners';

interface Props {
  handleClose: () => void;
  meetingId: string;
  recordingUrl: string;
}

const LessonRecordingModal = (props: Props) => {
  const {meetingId, handleClose } = props;
  const [meetingTitle, setMeetingTitle] = useState<string>();
  const [recordings, setRecordings] = useState<IMeetRecording[]>();
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(1);
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
      setRecordings(res);
      setVideoUrl(res[0].videoUrl); // TODO: this is getting url only of first recording
      setMeetingTitle(res[0].meetingTitle);
      setIsLoading(false);
    }catch (e){
      setIsVideoReady(true); // turn of spinner if there is error
      handleClose();
    }
  }

  function setNewVideoUrl() {
    if(recordings && recordings.length > 1 && currentVideoIndex < recordings.length){
      console.log('setting new videoUrl');
      console.log(recordings);
      setVideoUrl(recordings[currentVideoIndex].videoUrl);
      setCurrentVideoIndex(currentVideoIndex + 1);
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
        <div className={`d__${isVideoReady ? 'visible' : 'hidden'}`}>
            <div className="video-modal__overlay" style={{backgroundColor: 'white'}}>
              <video
                key={videoUrl}
                width='auto'
                height='100%'
                controls
                preload='metadata'
                autoPlay={true}
                onLoadedMetadata={() => {
                  setIsVideoReady(true);
                }}
                onEnded={() =>{
                  setNewVideoUrl();
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="video-icon--close" style={{display:'flex', flexDirection:'row', alignContent:'baseline' }}>
                <img  className="video-modal-logo mt-2 mr-2" src='/logo.png' alt='logo'></img>
                <i onClick={handleClose} className="icon icon--md icon--close icon--grey mt-2 mr-2"></i>
              </div>
          </div>
        </div>
        :
        <></>
      }

    </>
  );
};

export default LessonRecordingModal;
