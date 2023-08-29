import React, { useRef, useState } from 'react';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import { t } from 'i18next';
import moment from 'moment';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { Tooltip } from 'react-tooltip';
import toastService from '../../services/toastService';
import LessonRecordingModal from './LessonRecordingModal';
import { PiPlayBold } from 'react-icons/pi';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import {
  IMeetRecording,
  useLazyGetLessonRecordingsQuery,
} from '../../services/hiLinkService';
import IGetRecordingLinks from '../../../interfaces/IGetRecordingLinks';
import { BeatLoader, ClipLoader } from 'react-spinners';
import { AiOutlineDown } from 'react-icons/ai';

export interface IBookingInfo {
  bookingId: string;
  startTime: string;
  meetingId: string;
}

interface Props {
  bookingInfo: IBookingInfo,
  activeLesson: ICompletedLesson
}

const StudentBookingInfoItem: React.FC<Props> = ({ bookingInfo , activeLesson}) => {
  const [lessonRecordingModal, setLessonRecordingModal] = useState<boolean>(false);
  const [getRecordingLinks, {isLoading}] = useLazyGetLessonRecordingsQuery();
  const [recordings, setRecordings] = useState<IMeetRecording[]>();
  const [activeRecording, setActiveRecording] = useState<IMeetRecording>();

  function handleInvoiceDownload(){
    //TODO: Do logic for invoice download
    // bookingInfo object has 'bookingId' which you can maybe use
    toastService.info(t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE'));
  }

  function handleLessonPlay(activeRecording: IMeetRecording){
    setLessonRecordingModal(true);
    setActiveRecording(activeRecording);
  }
  async function handleGetLessons(){
    setDropdownVisible(!dropdownVisible);

    if(!recordings){
      const toSend: IGetRecordingLinks = {
        meetingId:bookingInfo.meetingId
      };

      const res = await getRecordingLinks(toSend).unwrap();
      setRecordings(res);
    }

  }

  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <>
      <div
        key={bookingInfo.bookingId}
        className={`completed-lessons-list__item mt-3 mb-0`}
      >
        <div className="completed-lessons-list__item__info completed-booking-info-container">
          <div>
            <div className="type--wgt--bold">
              {t(`SUBJECTS.${activeLesson.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
            </div>
            <div className="type--color--brand">
              {t(`LEVELS.${activeLesson.level.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
            </div>

            <div className="type--wgt--light">
              {
                `${t(`COMPLETED_LESSONS.DATE_TITLE`)}: ` +
                moment(bookingInfo.startTime).toDate().getDate()+ '.' +
                `${moment(bookingInfo.startTime).toDate().getMonth() + 1}` + '.' +
                moment(bookingInfo.startTime).toDate().getFullYear() +  ` ${t('COMPLETED_LESSONS.DATE_AT_WORD')} ` +
                moment(bookingInfo.startTime).format('HH:mm')+ ''
              }
            </div>
          </div>

          <Tooltip
            id="booking-info-tooltip"
            place={'top-end'}
            positionStrategy={'absolute'}
            float={true}
            delayShow={500}
            style={{ backgroundColor: "rgba(70,70,70, 0.9)", color: 'white', fontSize:'smaller'}}
          />

          <div className="container--flex--space-around">
            <LiaFileInvoiceDollarSolid
              className="completed-booking-pointer primary-color"
              size={30}
              data-tip="Click to view invoice"
              data-tooltip-id='booking-info-tooltip'
              data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE')}
              onClick={handleInvoiceDownload}
            />

            <div className="container--flex--space-around">
              <AiOutlineDown
                size={30}
                style={{cursor:'pointer'}}
                data-tip="Click to view invoice"
                data-tooltip-id='booking-info-tooltip'
                data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DROPDOWN_LABEL')}
                onClick={handleGetLessons}
                className={`primary-color arrow-icon ${dropdownVisible ? 'rotated' : ''}`}
              />
            </div>
          </div>
        </div>
        {lessonRecordingModal ? <LessonRecordingModal activeRecording={activeRecording!} handleClose={() => setLessonRecordingModal(false)} /> : <></>}
      </div>
      {dropdownVisible &&
        <div
          style={{width: '100%', flexDirection:'column'}}
          className={`completed-lessons-list__item dropdown-content ${dropdownVisible ? 'show-dropdown' : ''}`}
        >

          {isLoading ? <BeatLoader size={10} color='#7e6cf2'/> : null }
          {recordings?.map((recording, index) => {

            return (

              <div
                style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center', fontSize:'medium', width:'100%'}}
                className="p-3">
                <div className="mr-2">{recordings?.length > 1 ? recording.videoTitle : recording.meetingTitle}</div>
                <PiPlayBold
                  className="completed-booking-pointer primary-color"
                  size={20}
                  data-tip="Click to view invoice"
                  data-tooltip-id='booking-info-tooltip'
                  data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_PLAY_LESSON')}
                  onClick={() => handleLessonPlay(recording)}
                />
              </div>

            );
          })}
        </div>
      }

    </>
  );
};



export default StudentBookingInfoItem;
