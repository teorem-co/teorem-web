import { t } from 'i18next';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import UpdateBooking from '../../my-bookings/components/UpdateBooking';
import IBooking from '../../my-bookings/interfaces/IBooking';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  useDeleteBookingMutation,
} from '../../my-bookings/services/bookingService';
import { useAppSelector } from '../../../store/hooks';
import { RoleOptions } from '../../../store/slices/roleSlice';

export interface OptionsItem {
  id: string;
  icon: string;
  name: string;
  onClick?: () => void;
  textClass?: string;
}

interface Props {
  id: string;
  firstName: string;
  lastName: string;
  levelAbrv: string;
  subjectAbrv: string;
  startTime: string;
  endTime: string;
  lastUserThatSuggestedUpdate?: string;
  isInReschedule?: boolean;
  booking?: IBooking;
  fetchData: () => void;
}

const MIN_HOURS_BEFORE_RESCHEDULE = 24;
const MIN_HOURS_BEFORE_CANCEL = 24;

export const UpcomingLessonItem = ({
                                     firstName,
                                     id,
                                     lastName,
                                     levelAbrv,
                                     subjectAbrv,
                                     startTime,
                                     endTime,
                                     isInReschedule,
                                     lastUserThatSuggestedUpdate,
                                     fetchData,
                                     booking,
                                   }: Props) => {
  const history = useHistory();
  const isMobile = window.innerWidth < 1200;
  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);

  const [showModal, setShowModal] = useState(false);
  const [showDateSelectModal, setShowDateSelectModal] = useState(false);
  const [deleteBooking] = useDeleteBookingMutation();

  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const options: OptionsItem[] = [
    {
      id: 'reschedule',
      icon: 'icon--reschedule',
      name: 'MY_BOOKINGS.RESCHEDULE.BUTTON',
      onClick: () => {
        handleClose();
        setShowModal(true);
        fetchData();
      },
    },
    {
      id: 'cancel',
      icon: 'icon--close icon--red',
      name: 'MY_BOOKINGS.CANCEL.BUTTON',
      onClick: () => {
        handleClose();
        setShowConfirmDeleteBooking(true);
      },
      textClass: 'type--color--error type--wgt--regular',
    },
  ];

  const [showConfirmDeleteBooking, setShowConfirmDeleteBooking] = useState(false);

  const handleDeleteBooking = async () => {
    if (booking) {
      setShowConfirmDeleteBooking(false);
      await deleteBooking(booking.id);
      fetchData();
    }
  };

  function dismissCancelBooking() {
    setShowConfirmDeleteBooking(false);
  }

  return (
    <>
      {!isMobile ? (
        <div className='dashboard__list__item flex--ai--center' key={id}>
          <div>
            {firstName}&nbsp;{lastName}
          </div>

          <div>{t(`LEVELS.${levelAbrv.toLowerCase().replace('-', '')}`)}</div>

          <div>
            <span
              className='tag tag--primary'>{t(`SUBJECTS.${subjectAbrv.replaceAll('-', '')}`)}</span>
          </div>

          <div className='flex flex--ai--center'>
            {moment(startTime).format('HH:mm')} - {moment(endTime).add(1, 'minute').format('HH:mm')}
          </div>

          {isInReschedule ? (
            <div>
              <i className='icon icon--base icon--reschedule cur--default'></i>
            </div>
          ) : (
            <div></div>
          )}

          <div>
            <IconButton
              aria-label='more'
              id='long-button'
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='true'
              color={'primary'}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='long-menu'
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.id}
                  onClick={option.onClick}
                  selected={option.name === 'reschedule'}
                  disabled={
                    option.id === 'reschedule'
                      ? booking?.inReschedule
                      : option.id === 'cancel'
                        ? userRole !== RoleOptions.Tutor &&
                        moment(booking?.startTime).isBefore(moment().add(MIN_HOURS_BEFORE_CANCEL, 'hour'))
                        : false
                  }
                >
                  <i className={`icon icon--sm ${option.icon} mr-1`}></i>
                  <span
                    className={`${option.textClass}`}>{t(option.name)}</span>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      ) : (
        // MOBILE
        <div className='dashboard-upcoming-item' key={id}>
          <div
            className='flex flex--row flex--ai--center flex--jc--space-between'>
            <div className='flex flex--col'>
                            <span className='mb-2 ml-1'>
                                {' '}
                              {firstName}&nbsp;{lastName}
                            </span>
              <span
                style={{
                  margin: 0,
                  padding: '0 5px',
                  width: 'fit-content',
                }}
                className='tag tag--primary text-align--start '
              >
                                {t(`SUBJECTS.${subjectAbrv.replaceAll('-', '')}`)}
                            </span>
            </div>

            <div className='flex flex--col'>
              <div className='flex flex--row flex--ai--center mb-2'>
                <p>
                  {' '}
                  {moment(startTime).format('HH:mm')} - {moment(endTime).add(1, 'minute').format('HH:mm')}
                </p>
              </div>
              <p>{t(`LEVELS.${levelAbrv.toLowerCase().replaceAll('-', '')}`)}</p>
            </div>

            {isInReschedule && <i
              className='icon icon--md icon--pending icon--primary ml-2'></i>}

            <div>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                color={'primary'}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id='long-menu'
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={option.onClick}
                    selected={option.name === 'reschedule'}
                    disabled={
                      option.id === 'reschedule'
                        ? booking?.inReschedule
                        : option.id === 'cancel'
                          ? userRole !== RoleOptions.Tutor &&
                          moment(booking?.startTime).isBefore(moment().add(MIN_HOURS_BEFORE_CANCEL, 'hour'))
                          : false
                    }
                  >
                    <i className={`icon icon--sm ${option.icon} mr-1`}></i>
                    <span
                      className={`${option.textClass}`}>{t(option.name)}</span>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          title={t('MY_BOOKINGS.RESCHEDULE.MODAL.TITLE')}
          description={t('MY_BOOKINGS.RESCHEDULE.MODAL.DESCRIPTION')}
          confirmButtonTitle={'Nastavi'}
          cancelButtonTitle={'Odustani'}
          onConfirm={() => {
            setShowModal(false);
            setShowDateSelectModal(true);
          }}
          onCancel={() => {
            setShowModal(false);
          }}
        />
      )}

      {showDateSelectModal && booking && (
        <div className='modal__overlay'>
          <UpdateBooking
            booking={booking}
            tutorId={booking.tutorId}
            start={moment(booking.startTime).format(t('DATE_FORMAT') + ', HH:mm')}
            end={moment(booking.endTime).add(1, 'minute').format('HH:mm')}
            handleClose={() => {
              setShowDateSelectModal(false);
              fetchData();
            }}
            clearEmptyBookings={() => {
              console.log('clearEmptyBookings');
            }}
            positionClass={'modal--center'}
            setSidebarOpen={() => {
              console.log('setSidebarOpen');
            }}
          />
        </div>
      )}

      {showConfirmDeleteBooking && (
        <ConfirmationModal
          title={t('MY_BOOKINGS.CANCEL.MODAL.TITLE')}
          description={
            userRole === RoleOptions.Tutor
              ? t('MY_BOOKINGS.CANCEL.MODAL.TUTOR_DESCRIPTION')
              : t('MY_BOOKINGS.CANCEL.MODAL.STUDENT_DESCRIPTION')
          }
          confirmButtonTitle={t('MY_BOOKINGS.CANCEL.MODAL.CONFIRM')}
          cancelButtonTitle={t('MY_BOOKINGS.CANCEL.MODAL.DISMISS')}
          onConfirm={handleDeleteBooking}
          onCancel={dismissCancelBooking}
        />
      )}
    </>
  );
};
