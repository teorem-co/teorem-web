import React, { useState } from 'react';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import { t } from 'i18next';
import moment from 'moment';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { Tooltip } from 'react-tooltip';
import toastService from '../../services/toastService';
import LessonRecordingModal from './LessonRecordingModal';
import { PiPlayBold } from 'react-icons/pi';
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

  function handleInvoiceDownload(){
    //TODO: Complete this
    toastService.info(t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE'));
  }

  function handleLessonDownload(){
    setLessonRecordingModal(true);
  }

  return (

    <div
      key={bookingInfo.bookingId}
      className={`completed-lessons-list__item`}
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
          style={{ backgroundColor: "rgba(70,70,70, 0.9)", color: 'white', fontSize:'smaller' }}
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

          <PiPlayBold
            className="completed-booking-pointer primary-color"
            size={30}
            data-tip="Click to view invoice"
            data-tooltip-id='booking-info-tooltip'
            data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_LESSON')}
            onClick={handleLessonDownload}
          />
        </div>
      </div>
      {lessonRecordingModal ? <LessonRecordingModal meetingId={bookingInfo.meetingId}  handleClose={() => setLessonRecordingModal(false)} /> : <></>}
    </div>
  );
};



export default StudentBookingInfoItem;
