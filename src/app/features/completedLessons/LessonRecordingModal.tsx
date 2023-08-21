import { t } from 'i18next';
import TextField from '../../components/form/TextField';
import { Form, FormikProvider } from 'formik';
import RatingField from '../../components/form/RatingField';
import TextArea from '../../components/form/MyTextArea';
import { useEffect } from 'react';

interface Props {
  handleClose: () => void;
  recordingUrl: string;
  lessonTitle?: string
}

const LessonRecordingModal = (props: Props) => {
  const { recordingUrl, lessonTitle, handleClose } = props;
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
      <div className="video-modal__overlay">
        <div style={{backgroundColor: 'white', padding: '10px', alignContent:'start', textAlign: 'center'}}>
          {lessonTitle ? lessonTitle : 'TITLE'}
        </div>
        <div className="video-modal__video-container">
          <video controls>
            <source src={recordingUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <i onClick={handleClose} className="icon icon--md icon--close video-icon--close icon--grey"></i>
        </div>
      </div>
    </>
  );
};

export default LessonRecordingModal;
