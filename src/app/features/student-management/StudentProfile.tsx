import {
  IStudentBookingDetails,
  IStudentBookingParams,
  useLazyGetStudentBookingDetailsQuery,
} from '../my-bookings/services/bookingService';
import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import moment from 'moment/moment';
import MainWrapper from '../../components/MainWrapper';
import { useParams } from 'react-router-dom';
import {
  ITutorStudentSearch,
  useLazyGetStudentDetailsQuery,
} from '../../../services/userService';
import InfiniteScroll from 'react-infinite-scroll-component';

export const StudentProfile = () => {
  const { userId } = useParams();

  const [getStudentBookingDetails, { data: bookingDetails }] = useLazyGetStudentBookingDetailsQuery();
  const [getStudentDetails, { data: studentDetails }] = useLazyGetStudentDetailsQuery();
  const [studentBookings, setStudentBookings] = useState<IStudentBookingDetails[]>([]);
  const [studentDetailsState, setStudentDetailsState] = useState<ITutorStudentSearch>();
  const [params, setParams] = useState<IStudentBookingParams>({
    rpp: 20,
    page: 0,
    studentId: userId,
  });

  async function fetchStudentDetails() {
    const detailsResponse = await getStudentDetails(userId).unwrap();
    setStudentDetailsState(detailsResponse);
  }

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    fetchData();
  }, [params]);

  async function fetchData() {
    const response = await getStudentBookingDetails(params).unwrap();
    setStudentBookings((prevItems) => [...prevItems, ...response.content]);
  }

  function handleLoadMore() {
    setParams({
      ...params,
      page: params.page + 1,
    });
  }

  return (
    <MainWrapper>
      <div className={'flex flex--col'} style={{ height: '100%' }}>

        {studentDetailsState &&
          <div className='h--200'>
            <div className={'flex flex--col '}>
              <span
                className={'type--lg'}>{studentDetailsState.firstName}</span>
              <span className={'type--lg'}>{studentDetailsState.lastName}</span>
              <span className={'type--md'}>{studentDetailsState.email}</span>
              <span className={'type--md'}>{studentDetailsState.phone}</span>
            </div>
            <div className={'flex flex--col type--md'}>
              <span>Role: {studentDetailsState.role}</span>
              <span>CompletedLessons: {studentDetailsState.numberOfCompletedLessons}</span>
              <span>Credits: {studentDetailsState.creditsAmount}</span>
            </div>
          </div>
        }
        <div className={'flex--grow'}>

          <table className='tutors-table'>
            <thead className={'type--md'}>
            <tr className={'text-align--center type--normal'}>
              <td width={120}>{t('STUDENT_MANAGEMENT.TABLE.STUDENT')}</td>
              <td>{t('STUDENT_MANAGEMENT.TABLE.SUBJECT')}</td>
              <td width={170}>{t('STUDENT_MANAGEMENT.TABLE.TUTOR')}</td>
              <td width={250}>{t('STUDENT_MANAGEMENT.TABLE.TUTOR_EMAIL')}</td>
              <td>{t('STUDENT_MANAGEMENT.TABLE.TUTOR_PHONE')}</td>
              <td>{t('STUDENT_MANAGEMENT.TABLE.START_TIME')}</td>
              <td>{t('STUDENT_MANAGEMENT.TABLE.CREATED_AT')}</td>
              <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.PRICE')}</td>
              <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.ACCEPTED')}</td>
              <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.DELETED')}</td>
              <td width={100}>{t('STUDENT_MANAGEMENT.TABLE.RESCHEDULE')}</td>
            </tr>
            </thead>

            <tbody className='d--b'>

            {bookingDetails &&
              <InfiniteScroll
                dataLength={studentBookings.length} //This is important field to render the next data
                next={handleLoadMore}
                height={'80vh'}
                hasMore={!bookingDetails.last}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {studentBookings.map((booking) => (
                  <tr key={booking.bookingId} className={'text-align--center'}>
                    <td width={120}>{booking.studentName}</td>
                    <td className={''}>
                      <span
                        className={'d--b'}>{t(`SUBJECTS.${booking.subject.replaceAll('-', '')}`)}</span>
                      <span
                        className={'d--b'}>{t(`LEVELS.${booking.level.replaceAll('-', '')}`)}</span>
                    </td>
                    <td
                      width={170}>{booking.tutorFirstName + ' ' + booking.tutorLastName}</td>
                    <td width={250}>{booking.tutorEmail}</td>
                    <td>{booking.tutorPhone}</td>
                    <td>{moment(booking.startTime).format(t('DATE_FORMAT') + ', HH:mm')}</td>
                    <td>{moment(booking.createdAt).format(t('DATE_FORMAT') + ', HH:mm')}</td>
                    <td width={100}>{booking.price}</td>
                    <td width={100}>{booking.accepted ? 'YES' : 'NO'}</td>
                    <td width={100}>{booking.deleted ? 'YES' : 'NO'}</td>
                    <td width={100}>{booking.inReschedule ? 'YES' : 'NO'}</td>
                  </tr>
                ))}
              </InfiniteScroll>}
            </tbody>
          </table>
        </div>
      </div>
    </MainWrapper>
  );
};
