import React from 'react';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import { t } from 'i18next';
import moment from 'moment';
import { divide } from 'lodash';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { BiSolidDownload } from 'react-icons/bi';
import { Tooltip } from 'react-tooltip';
import toastService from '../../services/toastService';
export interface IBookingInfo {
  bookingId: string;
  startTime: string;
}

interface Props {
  bookingInfo: IBookingInfo,
  activeLesson: ICompletedLesson
}
// <div className="lessons-list">
//   <p>{activeLesson.Subject.name}</p>
//   <p>{activeLesson.level.name}</p>
//   <p>Start Time: {bookingInfo.startTime}</p>
// </div>
const StudentBookingInfoItem: React.FC<Props> = ({ bookingInfo , activeLesson}) => {

  function handleInvoiceDownload(){
    //TODO: Complete this
    toastService.info(t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE'));
  }

  function handleLessonDownload(){
    //TODO: Complete this
    toastService.info(t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_LESSON'));
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

          <div className="type--color--brand">
            {
              'Datum: ' +
              moment(bookingInfo.startTime).toDate().getDay()+ '.' +
              moment(bookingInfo.startTime).toDate().getDate() + '.' +
              moment(bookingInfo.startTime).toDate().getFullYear() + ' u ' +
              moment(bookingInfo.startTime).format('HH:mm:ss')+ ''
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
            className="completed-booking-pointer"
            size={30}
            data-tip="Click to view invoice"
            data-tooltip-id='booking-info-tooltip'
            data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE')}
            onClick={handleInvoiceDownload}
          />

          <BiSolidDownload
            className="completed-booking-pointer"
            size={30}
            data-tip="Click to view invoice"
            data-tooltip-id='booking-info-tooltip'
            data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_LESSON')}
            onClick={handleLessonDownload}
          />
        </div>

      </div>


    </div>
  );
};



export default StudentBookingInfoItem;
