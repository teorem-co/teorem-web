import React, { useState } from 'react';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import { t } from 'i18next';
import moment from 'moment';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { Tooltip } from 'react-tooltip';
import LessonRecordingModal from './LessonRecordingModal';
import { PiPlayBold } from 'react-icons/pi';
import {
  IMeetRecording,
  useLazyGetLessonRecordingsQuery,
} from '../../store/services/hiLinkService';
import IGetRecordingLinks from '../../types/IGetRecordingLinks';
import { BeatLoader } from 'react-spinners';
import { AiOutlineDown } from 'react-icons/ai';
import { useAppSelector } from '../../store/hooks';
import toastService from '../../store/services/toastService';

export interface IBookingInfo {
  bookingId: string;
  startTime: string;
  meetingId: string;
}

interface Props {
  bookingInfo: IBookingInfo,
  activeLesson: ICompletedLesson
}

const fileUrl = 'api/v1/bookings';
const url = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_CHAT_FILE_DOWNLOAD_HOST}/${fileUrl}`;

const StudentBookingInfoItem: React.FC<Props> = ({
                                                   bookingInfo,
                                                   activeLesson,
                                                 }) => {
  const [lessonRecordingModal, setLessonRecordingModal] = useState<boolean>(false);
  const [getRecordingLinks, { isLoading }] = useLazyGetLessonRecordingsQuery();
  const [recordings, setRecordings] = useState<IMeetRecording[]>();
  const [activeRecording, setActiveRecording] = useState<IMeetRecording>();
  const userToken = useAppSelector((state) => state.auth.token);

  function handleInvoiceDownload(bookingId: string) {
    fetch(`${url}/${bookingId}/invoice`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/octet-stream',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Failed to download invoice');
        }
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice-' + bookingId + '.pdf';
        a.click();

        // Display success message
        toastService.success(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_SUCCESS'));
      })
      .catch(error => {
        // Display error message
        toastService.error(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_FAIL'));
      });
  }

  function handleLessonPlay(activeRecording: IMeetRecording) {
    setLessonRecordingModal(true);
    setActiveRecording(activeRecording);
  }

  async function handleGetLessons() {
    setDropdownVisible(!dropdownVisible);

    if (!recordings) {
      const toSend: IGetRecordingLinks = {
        meetingId: bookingInfo.meetingId,
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
        <div
          className='completed-lessons-list__item__info completed-booking-info-container'>
          <div>
            <div className='type--wgt--bold'>
              {t(`SUBJECTS.${activeLesson.Subject.abrv.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
            </div>
            <div className='type--color--brand'>
              {t(`LEVELS.${activeLesson.level.abrv.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
            </div>

            <div className='type--wgt--light'>
              {
                `${t(`COMPLETED_LESSONS.DATE_TITLE`)}: ` +
                moment(bookingInfo.startTime).toDate().getDate() + '.' +
                `${moment(bookingInfo.startTime).toDate().getMonth() + 1}` + '.' +
                moment(bookingInfo.startTime).toDate().getFullYear() + ` ${t('COMPLETED_LESSONS.DATE_AT_WORD')} ` +
                moment(bookingInfo.startTime).format('HH:mm') + ''
              }
            </div>
          </div>

          <Tooltip
            id='booking-info-tooltip'
            place={'top-end'}
            positionStrategy={'absolute'}
            float={true}
            delayShow={500}
            style={{
              backgroundColor: 'rgba(70,70,70, 0.9)',
              color: 'white',
              fontSize: 'smaller',
            }}
          />

          <div className='container--flex--space-around'>
            <LiaFileInvoiceDollarSolid
              className='completed-booking-pointer primary-color'
              size={30}
              data-tip='Click to view invoice'
              data-tooltip-id='booking-info-tooltip'
              data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE')}
              onClick={() => handleInvoiceDownload(bookingInfo.bookingId)}
            />

            <div className='container--flex--space-around'>
              <AiOutlineDown
                size={30}
                style={{ cursor: 'pointer' }}
                data-tip='Click to view invoice'
                data-tooltip-id='booking-info-tooltip'
                data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DROPDOWN_LABEL')}
                onClick={handleGetLessons}
                className={`primary-color arrow-icon ${dropdownVisible ? 'rotated' : ''}`}
              />
            </div>
          </div>
        </div>
        {lessonRecordingModal ?
          <LessonRecordingModal activeRecording={activeRecording!}
                                handleClose={() => setLessonRecordingModal(false)} /> : <></>}
      </div>
      {dropdownVisible &&
        <div
          className={`container-dropdown completed-lessons-list__item dropdown-content ${dropdownVisible ? 'show-dropdown' : ''}`}
        >

          {isLoading ? <BeatLoader size={10} color='#7e6cf2' /> : null}
          {recordings?.map((recording) => {

            return (

              <div
                className='p-3 lesson-row'>
                <div
                  className='mr-2'>{recordings?.length > 1 ? recording.videoTitle : recording.meetingTitle}</div>
                <PiPlayBold
                  className='completed-booking-pointer primary-color'
                  size={20}
                  data-tip='Click to view invoice'
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
