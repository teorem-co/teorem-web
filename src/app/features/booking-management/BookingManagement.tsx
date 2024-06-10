import {
  IStudentBookingDetails,
  useLazyGetAllBookingsForTutorManagementQuery,
} from '../my-bookings/services/bookingService';
import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import moment from 'moment/moment';
import MainWrapper from '../../components/MainWrapper';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PATHS } from '../../routes';
import { useHistory } from 'react-router';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { OptionsItem } from '../dashboard/upcoming-lessons/UpcomingLessonItem';
import IParams from '../../../interfaces/IParams';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

export const BookingManagement = () => {
  const history = useHistory();

  const [getBookingsForBookingManagement, { data: bookings }] = useLazyGetAllBookingsForTutorManagementQuery();
  const [studentBookings, setStudentBookings] = useState<IStudentBookingDetails[]>([]);
  const [params, setParams] = useState<IParams>({
    rpp: 20,
    page: 0,
    sort: 'startTime,desc',
  });

  const [sortOrder, setSortOrder] = useState('');
  const [sortField, setSortField] = useState('');
  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => {
      return prevSortOrder === 'startTime,asc' ? 'startTime,desc' : 'startTime,asc';
    });
  };

  const toggleSortField = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
    } else {
      toggleSortOrder();
    }
  };

  useEffect(() => {
    setSortOrder(prevSortOrder => {
      return prevSortOrder.split(',')[1] === 'asc' ? `${sortField},desc` : `${sortField},asc`;
    });

  }, [sortField]);

  useEffect(() => {
    console.log('changed sortOrder', sortOrder);
    setStudentBookings([]);
    setParams({
      ...params,
      page: 0,
      sort: sortOrder,
    });

  }, [sortOrder]);

  useEffect(() => {
    fetchData();
  }, [params]);

  async function fetchData() {
    const response = await getBookingsForBookingManagement(params).unwrap();
    setStudentBookings((prevItems) => [...prevItems, ...response.content]);
  }

  function handleLoadMore() {
    setParams({
      ...params,
      page: params.page + 1,
    });
  }

  function getStateOfBooking(booking: IStudentBookingDetails) {
    if (booking.deleted) {
      return <span
        className='tag tag--primary tag--color--red'>CANCELLED</span>;
    } else if (moment(booking.startTime).add(1, 'h').isBefore(moment()) && booking.accepted) {
      return <span
        className='tag tag--primary tag--color--dark-green'>COMPLETED</span>;
    } else if (booking.accepted && !booking.deleted && !booking.inReschedule) {
      return <span
        className='tag tag--primary tag--color--light-green'>ACCEPTED</span>;
    } else if (booking.inReschedule) {
      return <span
        className='tag tag--primary tag--color--orange'>RESCHEDULE</span>;
    } else if (moment(booking.startTime).isAfter(moment()) && !booking.accepted && !booking.deleted && !booking.inReschedule) {
      return <span
        className='tag tag--primary tag--color--light-yellow'>REQUEST SENT</span>;
    }
  }

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
        //TODO: implement
        handleClose();
      },
    },
    {
      id: 'cancel',
      icon: 'icon--close icon--red',
      name: 'MY_BOOKINGS.CANCEL.BUTTON',
      onClick: () => {
        //TODO: implement
        handleClose();
      },
      textClass: 'type--color--error type--wgt--regular',
    },
  ];
  return (
    <MainWrapper>
      {/*<div className={'flex flex--col'} style={{ height: '100%' }}>*/}

      <table className='bookings-table mt-2'>
        <thead className={'type--md'}>
        <tr className={'text-align--center type--normal'}>
          {/*<td width={20}>{'RBR'}</td>*/}
          <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.STUDENT')}</td>
          <td width={80}>{t('STUDENT_MANAGEMENT.TABLE.LEVEL')}</td>
          <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.SUBJECT')}</td>
          <td width={170}>{t('STUDENT_MANAGEMENT.TABLE.TUTOR')}</td>
          <td width={80}>{t('STUDENT_MANAGEMENT.TABLE.PRICE')}</td>
          <td width={100}
              onClick={() => toggleSortField('createdAt')}>{t('STUDENT_MANAGEMENT.TABLE.CREATED_AT')}
            {sortField === 'createdAt' && (sortOrder.split(',')[1] === 'asc' ?
              <ArrowUpward /> : <ArrowDownward />)}
          </td>
          <td width={100}
              onClick={() => toggleSortField('startTime')}>{t('STUDENT_MANAGEMENT.TABLE.START_TIME')}
            {sortField === 'startTime' && (sortOrder.split(',')[1] === 'asc' ?
              <ArrowUpward /> : <ArrowDownward />)}
          </td>
          <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.STATE')}</td>
          <td width={50}></td>
        </tr>
        </thead>

        <tbody className='d--b'>
        {bookings &&
          <InfiniteScroll
            dataLength={studentBookings.length} //This is important field to render the next data
            next={handleLoadMore}
            height={'90vh'}
            hasMore={!bookings.last}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>End</b>
              </p>
            }
          >
            {studentBookings.map((booking) => (
              <tr key={booking.bookingId} className={'text-align--center'}>
                {/*<td width={20}>{booking.ordinalNumber}</td>*/}
                <td width={100}>{booking.studentName}</td>
                <td width={80}>
                      <span
                        className={'d--b'}>{t(`LEVELS.${booking.level.replaceAll('-', '')}`)}</span>
                </td>
                <td width={100} className={''}>
                      <span
                        className={'d--b'}>{t(`SUBJECTS.${booking.subject.replaceAll('-', '')}`)}</span>
                </td>
                <td
                  onClick={() => {
                    history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', booking.tutorSlug));
                  }}
                  width={170}
                >{booking.tutorFirstName + ' ' + booking.tutorLastName}</td>
                <td width={80}>{booking.price}</td>
                <td
                  width={100}>{moment(booking.createdAt).format('DD/MM/YYYY' + ', HH:mm')}</td>
                <td
                  width={100}>{moment(booking.startTime).format('DD/MM/YYYY' + ', HH:mm')}</td>
                <td width={100}>{getStateOfBooking(booking)}</td>
                <td width={50}>
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
                        width: '20ch',
                      },
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={option.onClick}
                        selected={option.name === 'reschedule'}
                      >
                        <i
                          className={`icon icon--sm ${option.icon} mr-1`}></i>
                        <span
                          className={`${option.textClass}`}>{t(option.name)}</span>
                      </MenuItem>
                    ))}
                  </Menu>
                </td>
              </tr>
            ))}
          </InfiniteScroll>}
        </tbody>
      </table>
      {/*</div>*/}
    </MainWrapper>
  );
};
