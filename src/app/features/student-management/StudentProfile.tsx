import {
  IStudentBookingDetails,
  IStudentBookingParams,
  useLazyGetStudentBookingDetailsQuery,
} from '../my-bookings/services/bookingService';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { t } from 'i18next';
import moment from 'moment/moment';
import MainWrapper from '../../components/MainWrapper';

interface Props {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  numberOfCompletedLessons: number;
  creditsAmount: number;
}

export const StudentProfile = (props: Props) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    phone,
    role,
    numberOfCompletedLessons,
    creditsAmount,
  } = props;

  const [getStudentBookingDetails, { data: bookingDetails }] = useLazyGetStudentBookingDetailsQuery();
  const [studentBookings, setStudentBookings] = useState<IStudentBookingDetails[]>([]);
  const [params, setParams] = useState<IStudentBookingParams>({
    rpp: 20,
    page: 0,
    studentId: userId,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {

    const params: IStudentBookingParams = {
      studentId: userId,
      rpp: 20,
      page: 0, // TODO: add pagination
    };

    const response = await getStudentBookingDetails(params).unwrap();
    setStudentBookings((prevItems) => [...prevItems, ...response.content]);
  }

  const debouncedScrollHandler = debounce((e) => handleScroll(e), 300);

  const handleScroll = async (e: HTMLDivElement) => {
    if (bookingDetails && studentBookings.length != bookingDetails.totalElements) {
      const innerHeight = e.scrollHeight;
      const scrollPosition = e.scrollTop + e.clientHeight;

      const roundedInnerHeight = Math.floor(innerHeight);
      const roundedScrollPosition = Math.floor(scrollPosition);

      // if (roundedInnerHeight === roundedScrollPosition) {
      if (roundedScrollPosition / roundedInnerHeight > 0.8) {
        // handleLoadMore();
        if (!bookingDetails.last) {
          const tutorResponse = await getStudentBookingDetails({
            ...params,
            page: bookingDetails.number + 1,
          }).unwrap();
          setStudentBookings((prevItems) => [...prevItems, ...tutorResponse.content]);
        }
      }
    }
  };

  type GroupedBookings = {
    [date: string]: IStudentBookingDetails[];
  };

  function groupBookingsByDate(bookings: IStudentBookingDetails[]): GroupedBookings {
    return bookings.reduce((groupedBookings: GroupedBookings, booking) => {
      const date = moment(booking.startTime).format('DD.MM.YYYY');
      if (!groupedBookings[date]) {
        groupedBookings[date] = [];
      }
      groupedBookings[date].push(booking);
      return groupedBookings;
    }, {});
  }

  const groupedBookings = groupBookingsByDate(studentBookings);

  return (
    <MainWrapper>
      <div className={'flex flex--col'}>

        <div className='flex flex-row flex--gap-10'>
          <div className={'flex flex--col '}>
            <span className={'type--lg'}>{firstName}</span>
            <span className={'type--lg'}>{lastName}</span>
            <span className={'type--md'}>{email}</span>
            <span className={'type--md'}>{phone}</span>
          </div>
          <div className={'flex flex--col type--md'}>
            <span>Role: {role}</span>
            <span>CompletedLessons: {numberOfCompletedLessons}</span>
            <span>Credits: {creditsAmount}</span>
          </div>
        </div>

        <div onScroll={(e) => debouncedScrollHandler(e.target)}
             className={'student-bookings outline-purple '}> {/*TODO: here should be fixed height maybe*/}


          <table className='tutors-table'>
            <thead>
            <tr className={'text-align--center type--normal'}>
              <td width={120}>student</td>
              <td>subject</td>
              <td width={170}>tutor</td>
              <td width={250}>tutor email</td>
              <td>tutor phone</td>
              <td>start time</td>
              <td>created at</td>
              <td width={100}>price</td>
              <td width={100}>accepted</td>
              <td width={100}>deleted</td>
              <td width={100}>reschedule</td>
            </tr>
            </thead>

            <tbody className='student-table-scrollable-tbody'>
            {Object.entries(groupedBookings).map(([date, bookings]) => (
              <React.Fragment key={date}>
                <tr>
                  <td colSpan={10}
                      className='text-align--center type--md'>{date}</td>
                </tr>
                {bookings.map((booking) => (
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
              </React.Fragment>
            ))}
            </tbody>
          </table>

        </div>

      </div>
    </MainWrapper>
  );
};
