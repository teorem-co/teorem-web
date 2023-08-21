import { t } from 'i18next';
import TextField from '../../components/form/TextField';
import { Form, FormikProvider } from 'formik';
import RatingField from '../../components/form/RatingField';
import TextArea from '../../components/form/MyTextArea';
import { useEffect, useState } from 'react';
import { useLazyGetRecordingLinksQuery } from '../../services/hiLinkService';
import IGetRecordingLinks from '../../../interfaces/IGetRecordingLinks';

interface Props {
  handleClose: () => void;
  meetingId: string;
  recordingUrl: string;
}

const LessonRecordingModal = (props: Props) => {
  const {meetingId, handleClose } = props;
  const [meetingTitle, setMeetingTitle] = useState<string>();
  const [videoUrl, setVideoUrl] = useState<string>("https://vcaas-record.s3.amazonaws.com/229/d3e797e233492279b69f9ca16f907462_VCaaS2298644_0.mp4?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCXVzLWVhc3QtMSJIMEYCIQC%2FaKG8kQsvOEWj7X4sIOti5F6OW1Tdg8w7mXlVVcwtwwIhAOfh3mCPa9Y7tXGYJw72FXzmLiOLM%2B9y7Icl9hmlKyhMKsMFCNH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjE1ODc4MjI5NjIyIgyj1NQzG4jJC7%2F5pGMqlwWcZER%2BC2oMWgVk5w9ziK35tz42xTmvyU44s8g4q2gynfQ2m4Xr6Fri9H29oOd9BirAtO9MzUEIzsa2DqPochdoHo2fviBylA7q4CQpLvpK%2Bq8y4d%2BsaE10dvqPjjRoHMOi1siz%2BSJGRiEqvaYy95hzwRptDy2hm%2ByOb6V45YuGEiM%2FxkkzJAQFGLLzr6vriPpcBD8bRQGj2ZHK7HLotRHEQQcZ23hGgvalHeCs%2Fjih53di3uMGVIaCA2LEGh0OJG8pt9cNFPQhqH9o1JAeBPl1rPH1hWpocSWqFUQQtPyQ96oodd7be254%2B7ovANsMICxq6FRkxI4y4rLkpOFuC%2BJoggS9YQimwf0XdVUucUT%2F5yRFnzpYr6Pi85UQU9h9Z9uROoQleke2IPtJ5s9TlWouIaQJFUkNYYIkbRjXYWl5A45dbRuRW%2FZ7Jr%2BthIn84BGI3ZqesWslB0peYr1aQuDxcQFXEuHPtC6uscpfjp1G%2BFcwNziX3MrC9WrT5AfGTCQ8R%2FZUEEZEE4vPsslGfFYXp2N6%2Bttp8%2BK%2FVZBDH4DsO9KL7Ah93vR%2BuP9SHe80WOBpyaD%2Bnf04PNv9WqmVQmUUTifpwpyzudAgVAZ4hCMWB8GwdeLZZ46W9libxm2zGEbmX2mNaRYo5l0I%2FilRU4AuGIQOs2Pr3%2BwEr7u0oPUHSKv0we2S7R1Sfip4vCZr6V2TXYdsPGOsVjU2AET%2Bh5eOdZM2t%2By2dbglkHrSVtvOWdHO27qcFdl9YKyeaHn8jqwt6U4FOgTHpiAKVNZ7pRYPBgEVBC1R0Rs9TAYPLzZEwhRvCTHGdg5RV9no1DrHbTl%2F6lFCNu8k3y%2FTSnRsMPQlfO8flXpvXJbEf2POL3660b%2BciR24LYMw4rqMpwY6sAG38TXvidJvEtVU7mM9MonoNYvzCBzCuuI3GNaeLCTOrbpXg3%2BaBMl3agq2cRdCOQUb5ov27gKaNtkwlsf0kJ1%2BzrVt%2BjUmH5dOevZbk9491IV7LatqBEhum7CZ7FfyNmL9ugl%2BZTGzk9mBU431Kowta1TA%2FahM46bWrRlZx%2FkvsLhBDrIJ7wrpibg3%2Fi167eVogC%2BxzEbjBWtkQfu5N2zvH3a87lu7FbpHVIzuh663HA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230821T094044Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=ASIAY6ZJT7Z3JKOZ7DGG%2F20230821%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=23786401337c689395b2d10732d4bb8d104ec3a55ed6d3fb4d9aae2fa7602efa");
  const [isLoading, setIsLoading] = useState(true);
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
    const res = await getRecordingLinks(toSend).unwrap();
    setVideoUrl(res[0].videoUrl); // TODO: this is getting url only of first recording
    setMeetingTitle(res[0].meetingTitle);
    setIsLoading(false);
  }

  return (
    <>
      {!isLoading ?
        <div className="video-modal__overlay">
          {meetingTitle &&
            <div style={{backgroundColor: 'white', padding: '10px', alignContent:'start', textAlign: 'center'}}>
            {meetingTitle}
          </div>}
          <div className="video-modal__video-container">
            <video controls>
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
