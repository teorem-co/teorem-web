import 'moment/locale/en-gb';

import i18n, { t, use } from 'i18next';
import moment from 'moment';
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  SlotInfo, View,
  Views,
} from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import LoaderSecondary from '../../components/skeleton-loaders/LoaderSecondary';
import languageOptions from '../../constants/languageOptions';
import { useAppSelector } from '../../hooks';
import { calcModalPosition } from '../../utils/calcModalPosition';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import OpenTutorCalendarModal from './components/OpenTutorCalendarModal';
import TutorEventModal from './components/TutorEventModal';
import UnavailabilityEditModal from './components/UnavailabilityEditModal';
import UnavailabilityModal from './components/UnavailabilityModal';
import UpcomingLessons from './components/UpcomingLessons';
import {
  useLazyGetBookingByIdQuery,
  useLazyGetBookingsQuery,
  useLazyGetNotificationForLessonsQuery,
  useLazyGetUpcomingLessonsQuery,
} from './services/bookingService';
import {
  useLazyGetUnavailableBookingsQuery,
} from './services/unavailabilityService';
import {
  useLazyGetTutorAvailabilityQuery
} from '../my-profile/services/tutorAvailabilityService';
import { v4 as uuidv4 } from 'uuid';
import ParentEventModal from './components/ParentEventModal';
import UpdateBooking from './components/UpdateBooking';
import { InformationCard } from '../../components/InformationCard';
import { ToolbarProps } from '@mui/material';
import { CustomToolbar } from './CustomToolbar';
import { divide } from 'lodash';

i18n.language !== 'en' && Array.from(languageOptions.map((l) => l.path)).includes(i18n.language) && require(`moment/locale/${i18n.language}.js`);

interface ICoords {
  x: number;
  y: number;
}

export interface IBookingTransformed {
  id: string;
  label: string;
  start: Date;
  end: Date;
  allDay: boolean;
  // tutorId?: string;
}

const MyBookings: React.FC = (props: any) => {

  const [getTutorAvailability, { data: tutorAvailability, isLoading: tutorAvailabilityLoading }] = useLazyGetTutorAvailabilityQuery();

  const userId = useAppSelector((state) => state.auth.user?.id);
  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
  const [getBookings, { data: bookings, isLoading: bookingsLoading }] = useLazyGetBookingsQuery();
  const [getNotificationForLessons, { data: lessonsCount }] = useLazyGetNotificationForLessonsQuery();
  const [getBookingById, { data: booking, isLoading: bookingIsLoading, isFetching:bookingIsFetching }] = useLazyGetBookingByIdQuery();
  const [getUpcomingLessons, { data: upcomingLessons }] = useLazyGetUpcomingLessonsQuery();
  const [getTutorUnavailableBookings, { data: unavailableBookings, isLoading: unavailableBookingsLoading }] = useLazyGetUnavailableBookingsQuery();

  const [openUnavailabilityModal, setOpenUnavailabilityModal] = useState(false);
  const [openUnavailabilityEditModal, setOpenUnavailabilityEditModal] = useState(false);
  const [unavailableCurrentEvent, setUnavailableCurrentEvent] = useState<IBookingTransformed[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedStart, setSelectedStart] = useState<string>('');
  const [selectedEnd, setSelectedEnd] = useState<string>('');
  const [selectedUnavailability, setSelectedUnavailability] = useState<string>('');
  const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
  const [openTutorCalendarModal, setOpenTutorCalendarModal] = useState<boolean>(false);
  const location = useLocation();
  const [value, onChange] = useState(location.state ? new Date(location.state.value) : new Date());
  const [calChange, setCalChange] = useState<boolean>(false);
  const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
  const [currentlyActiveBooking, setCurentlyActiveBooking] = useState<string>('');
  const [highlightCoords, setHighlightCoords] = useState<ICoords>({
    x: 0,
    y: 0,
  });
  const [scrollTopOffset, setScrollTopOffset] = useState<number>(0);
  const scrollState = useAppSelector((state) => state.scroll);
  const {topOffset} = scrollState;
  const history = useHistory();
  const localizer = momentLocalizer(moment);
  const positionClass = moment(selectedStart).format('dddd');
  const unavailablePositionClass = moment(selectedSlot).format('dddd');
  const defaultScrollTime = new Date(new Date().setHours(7, 0, 0));
  const highlightRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const tileElement = tileRef.current as HTMLDivElement;

  const arrayDataToUnavailabilityObjects = (arrayData: any, startMonday: Date): IBookingTransformed[] => {

    startMonday = moment(startMonday).startOf('week').toDate();
    const unavailabilityObjects: IBookingTransformed[] = [];

    // for each day of the week
    for (let col = 1; col < arrayData[0].length; col++) {
      let previousObj: IBookingTransformed | null = null;

      // skip the first row (header) of arrayData
      for (let row = 1; row < arrayData.length; row++) {
        const timeslot = arrayData[row];
        const isAvailable = timeslot[col] as boolean;

        // we only need objects where the value is false (unavailable)
        if (!isAvailable) {
          const dayOfWeek = timeslot[0] as string; // e.g. 'Pre 12 pm', '12 - 5 pm', 'After 5 pm'
          let start: Date;
          let end: Date;

          // calculate start and end based on the dayOfWeek
          if (dayOfWeek === 'Pre 12 pm') {
            start = new Date(startMonday);
            end = new Date(startMonday);
            start.setDate(start.getDate() + (col - 1));
            end.setDate(end.getDate() + (col - 1));
            start.setHours(0, 0, 0, 0);
            end.setHours(11, 59, 59, 999);
          } else if (dayOfWeek === '12 - 5 pm') {
            start = new Date(startMonday);
            end = new Date(startMonday);
            start.setDate(start.getDate() + (col - 1));
            end.setDate(end.getDate() + (col - 1));
            start.setHours(12, 0, 0, 0);
            end.setHours(16, 59, 59, 999);
          } else { // 'After 5 pm'
            start = new Date(startMonday);
            end = new Date(startMonday);
            start.setDate(start.getDate() + (col - 1));
            end.setDate(end.getDate() + (col - 1));
            start.setHours(17, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
          }

          if (previousObj) {
            // If current unavailability is continuous with the previous one, update the end of the previous unavailability
            previousObj.end = end;
          } else {
            // create the unavailability object and add it to the array
            const obj: IBookingTransformed = {
              start: start,
              end: end,
              id: uuidv4(),
              label: 'unavailableInTable',
              allDay: false
            };
            unavailabilityObjects.push(obj);
            previousObj = obj;
          }
        } else {
          previousObj = null; // Reset for non-continuous unavailability
        }
      }
    }

    return unavailabilityObjects;
  };
  const [firstDayOfSelectedWeek, setFirstDayOfSelectedWeek] = useState<Date>(new Date());
  const allBookings =
    bookings?.concat(unavailableBookings ? unavailableBookings : [])
      .concat(tutorAvailability ? arrayDataToUnavailabilityObjects(tutorAvailability, firstDayOfSelectedWeek) : []);
  const isLoading = bookingsLoading || unavailableBookingsLoading;

  const calculateFirstDayOfWeek = (date: Date): number => {
    return moment(date).startOf('week').date();
  };

  const setSelectedDateFirstDayOfWeek = (date:Date) =>{
    if(calculateFirstDayOfWeek(firstDayOfSelectedWeek) != calculateFirstDayOfWeek(date))
      setFirstDayOfSelectedWeek(date);
  };

  const CustomHeader = (date: any) => {
    setCalChange(true);
    return (
      <>
        <div className="type--capitalize mb-2">{moment(date.date).format(isMobile ? 'ddd' : 'dddd')}</div>
        <div className="type--color--tertiary type--capitalize">{moment(date.date).format('DD.M')}</div>
      </>
    );
  };

  const CustomEvent = (event: any) => {
    if (userRole === RoleOptions.Tutor) {
      if (event.event.isAccepted === false) {
        return (
          <div className="event">
            {/* <div className="mb-2">{moment(event.event.start).format('HH:mm')}</div> */}
            <div className="type--wgt--bold">{event.event.label}</div>
          </div>
        );
      } else if(event.event.label === 'unavailableCustom'){
        return (
          <>
            <div className="event--unavailable-custom" >
              <div className="type--color--primary type--wgt--bold">{t('MY_BOOKINGS.UNAVAILABLE')}</div>
            </div>
          </>
        );

      }else if (event.event.id === 'currentUnavailableItem'
        || event.event.label === 'unavailableInTable'
        || event.event.label === 'unavailable'
        || (unavailableBookings && unavailableBookings.find((x) => x.id === event.event.id))) {
        return (
          <>
            <div className="event--unavailable">
              <div className="type--color--primary type--wgt--bold"></div>
            </div>
          </>
        );
      }else {
        return (
          <>
            {/*TODO: do calculation when can tutor delete booking*/}
            <div className={`event event--pending ${moment(event.event.end).isBefore(moment()) ?  'event-passed' : ''}`}>
              <div className="type--wgt--bold">{event.event.label}</div>
            </div>
          </>
        );
      }
    } else {
      if (event.event.isAccepted === false) {
        // TODO: do calculation when can student delete booking
        return (
          <div className={`event ${moment(event.event.end).isBefore(moment()) ?  'event-passed' : ''}`}>
            <div className="type--wgt--bold">{event.event.label}</div>
          </div>
        );
      } else {
        return (
          <div className={`event event--pending ${moment(event.event.end).isBefore(moment()) ? 'event-passed' : ''}`}>
            <div className="type--wgt--bold">{event.event.label}</div>
          </div>
        );
      }
    }
  };

  const PrevIcon = () => {
    return <i className="icon icon--base icon--chevron-left"></i>;
  };

  const NextIcon = () => {
    return <i className="icon icon--base icon--chevron-right"></i>;
  };

  const handleSelectedEvent = (e: IBookingTransformed) => {
    setCurentlyActiveBooking(e.id);
    setScrollTopOffset(topOffset + 150); // add 150px so its closer because I dont get information where user clicked


    if (userRole === RoleOptions.Tutor) {
      if(e.id ==='currentUnavailableItem') return;

      if (unavailableCurrentEvent.length > 0) {
        //close createNewUnavailability
        setOpenUnavailabilityModal(false);
        setUnavailableCurrentEvent([]);
        if (e.label === 'unavailableCustom') {
          //open unavailability modal
          setOpenUnavailabilityEditModal(true);
          setSelectedUnavailability(e.id);
          setSelectedSlot(e.start);
          setOpenEventDetails(false);
        } else if(e.label != 'unavailableInTable') {
          setOpenUnavailabilityEditModal(false);
          getBookingById(e.id);
          setOpenEventDetails(true);
          setSelectedStart(moment(e.start).format(t('DATE_FORMAT') +', HH:mm'));
        }
        //return;
      } else {
        if (e.label === 'unavailableCustom') {
          //close createNewUnavailability
          setOpenUnavailabilityModal(false);
          setUnavailableCurrentEvent([]);
          //open unavailability modal
          setOpenUnavailabilityEditModal(true);
          setSelectedUnavailability(e.id);
          setSelectedSlot(e.start);
          setOpenEventDetails(false);
        } else if(e.label !== 'unavailableInTable'){
          setOpenUnavailabilityEditModal(false);
          getBookingById(e.id);
          setOpenEventDetails(true);
          setSelectedStart(moment(e.start).format(t('DATE_FORMAT') +', HH:mm'));
        }
      }
    } else if (userRole === RoleOptions.Parent || userRole === RoleOptions.Student || userRole === RoleOptions.Child) {
      if (e.label !== 'Unavailable') {
        getBookingById(e.id);
        setOpenTutorCalendarModal(true);
        setSelectedStart(moment(e.start).format(t('DATE_FORMAT') + ', HH:mm'));
        setSelectedEnd(moment(e.end).add(1, 'minute').format('HH:mm'));
      }
    }
  };

  const goToTutorCalendar = () => {
    history.push(`${t('PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS').replace(':tutorSlug', booking?.Tutor.slug || '')}`);
  };

  const handleSelectedSlot = (e: SlotInfo) => {

    if (userRole === RoleOptions.Tutor) {
      if(e.bounds?.bottom){
        const boundsTop = e.bounds?.top <= 300 ? e.bounds?.top + 500 : e.bounds?.top;
        setScrollTopOffset(topOffset + boundsTop  - 350);
      }

      setOpenEventDetails(false);
      setOpenUnavailabilityEditModal(false);
      setUnavailableCurrentEvent([
        {
          id: 'currentUnavailableItem',
          label: 'unavailable',
          start: moment(e.start).toDate(),
          end: moment(e.start).add(1, 'hours').toDate(),
          allDay: false,
        },
      ]);
      setSelectedSlot(moment(e.start).toDate());
      setOpenUnavailabilityModal(true);
    }
  };

  const getDayName = (date: Date | null): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if(date !== null) {
      return days[date?.getDay()];
    }
    return days[3];
  };

  const calcPosition = () => {
    const childElement = document.querySelector('.react-calendar__tile--active');
    const rectParent = highlightRef.current && highlightRef.current.getBoundingClientRect();
    const rectChild = childElement && childElement.getBoundingClientRect();

    if (rectParent && rectChild) {
      const finalX = rectParent.x - rectChild.x;
      const finalY = rectChild.y - rectParent.y;
      setHighlightCoords({ x: finalX, y: finalY });
    }
  };


  const hideShowHighlight = (date: Date) => {
    if (tileElement) {
      if (moment(date).isSame(value, 'month')) {
        tileElement.style.display = 'block';
      } else {
        tileElement.style.display = 'none';
      }
    }
  };

  const getCurrentUnavailability = () => {
    const currentUnavailability = (allBookings && allBookings.find((x) => x.id === selectedUnavailability)) || null;

    if (currentUnavailability) {
      return {
        startTime: currentUnavailability.start,
        endTime: currentUnavailability.end,
        id: currentUnavailability.id,
      };
    }
    return null;
  };

  const fetchData = async () => {
    if (userId) {
      await getUpcomingLessons(userId).unwrap();
      if (userRole === RoleOptions.Tutor) {
        await getTutorUnavailableBookings({
          tutorId: userId,
          dateFrom: moment(value).startOf('isoWeek').toISOString(),
          dateTo: moment(value).endOf('isoWeek').toISOString(),
        }).unwrap();
        await getTutorAvailability(userId).unwrap();
      }
    }
  };

  useEffect(() => {
    calcPosition();
    hideShowHighlight(value);
    setSelectedDateFirstDayOfWeek(value);
  }, [value]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      getBookings({
        dateFrom: moment(value).startOf('isoWeek').toISOString(),
        dateTo: moment(value).endOf('isoWeek').toISOString(),
      });
      getNotificationForLessons({
        userId: userId,
        date: moment().set({ hour: 23, minute: 59, second: 59 }).toISOString(),
      });
      if (userRole === RoleOptions.Tutor) {
        getTutorUnavailableBookings({
          tutorId: userId,
          dateFrom: moment(value).startOf('isoWeek').toISOString(),
          dateTo: moment(value).endOf('isoWeek').toISOString(),
        }).unwrap();
      }
    }
  }, [value, userId]);

  useEffect(() => {
    const indicator: any = document.getElementsByClassName('rbc-current-time-indicator');
    indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));

    const interval = setInterval(() => {
      indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));
    }, 60000);
    return () => clearInterval(interval);
  }, [calChange]);

  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

  function setSidebarOpen(e: any) {
    return;
  }

  function setEmptyBookings(param: any[]) {
    return;
  }

  const handleUpdateModal = (isOpen: boolean) => {
    setOpenUpdateModal(isOpen);
    setOpenEventDetails(false);
    setOpenTutorCalendarModal(false);
  };

  const isMobile = window.innerWidth < 767;
  const [view, setView] = useState<View>('week');

  function onChangeDate(date: Date){
    onChange(date);
    setCalChange(!calChange);
  }

  return (
    <MainWrapper>
      <div className="layout--primary">
        {isLoading ? <LoaderSecondary /> : <></>}
        <div>
          <div className="card--calendar">
            <div className="flex--primary p-6">
              <h2 className="type--lg">{t('MY_BOOKINGS.TITLE')}</h2>
              <div className="type--wgt--bold type--color--brand">
                {t('MY_BOOKINGS.NOTIFICATION_PART_1')}&nbsp;
                {lessonsCount ?? 0}
                &nbsp;{t('MY_BOOKINGS.NOTIFICATION_PART_2')}
              </div>
            </div>

            <BigCalendar
                // min={minTime}
                // max={maxTime}
                onSelecting={() => true}
                localizer={localizer}
               formats={{
                 timeGutterFormat: 'HH:mm',
               }}
               events={allBookings ? allBookings.concat(unavailableCurrentEvent) : []}
               toolbar={true}
               date={value}
               view= {isMobile ? "day" : "week"}
               style={{ height: 'calc(100% - 84px)'}}
               startAccessor="start"
               endAccessor="end"
               components={{
                 header: (date) => CustomHeader(date),
                 event: (event) => CustomEvent(event),
                 toolbar: () =>
                   (isMobile ? <CustomToolbar
                     value={value}
                     onChangeDate={onChangeDate} /> : null)
               }}
               scrollToTime={defaultScrollTime}
               showMultiDayTimes={true}
               step={15}
               longPressThreshold={50}
               selectable={true}
               timeslots={4}
               onSelectSlot={(e) => handleSelectedSlot(e)}
               onSelectEvent={(e) => handleSelectedEvent(e)}
            />
            {openEventDetails ? (
              <TutorEventModal
                event={booking ? booking : null}
                handleClose={(e) => setOpenEventDetails(e)}
                positionClass={calcModalPosition(positionClass)}
                openLearnCube={() => setLearnCubeModal(true)}
                topOffset={scrollTopOffset}
                openEditModal={(isOpen) => handleUpdateModal(isOpen)}
              />
            ) : (
              openUpdateModal && booking ?
                <UpdateBooking
                  booking={booking ? booking : null}
                  clearEmptyBookings={() => setEmptyBookings([])}
                  setSidebarOpen={(e: any) => setSidebarOpen(e)}
                  start={`${selectedStart}`}
                  end={`${booking.endTime}`}
                  handleClose={(e: any) => setOpenUpdateModal(e)}
                  positionClass={calcModalPosition(positionClass)}
                  tutorId={booking?.tutorId}
                  topOffset={scrollTopOffset}
                />
                : <></>
            )}
            {openTutorCalendarModal && booking ? (
              // TODO: here should be ParentEventModal
              // <OpenTutorCalendarModal
              //   goToTutorCalendar={() => goToTutorCalendar()}
              //   event={booking ? booking : null}
              //   handleClose={(e) => setOpenTutorCalendarModal(e)}
              //   positionClass={calcModalPosition(positionClass)}
              //   openLearnCube={() => setLearnCubeModal(true)}
              // />
              !bookingIsLoading && !bookingIsFetching && <ParentEventModal
                eventIsAccepted={booking ? booking.isAccepted : false}
                bookingStart={booking ? booking.startTime : ''}
                event={booking ? booking : null}
                handleClose={(e) => setOpenTutorCalendarModal(e)}
                positionClass={calcModalPosition(positionClass)}
                openLearnCube={() => setLearnCubeModal(true)}

                openEditModal={(isOpen) => handleUpdateModal(isOpen)}
                tutorName={booking.User.firstName && booking.User.lastName ? booking.User.firstName + ' ' + booking.User.lastName : ''}
                // tutorName={booking.User ? booking.User.firstName : ''}
                topOffset={scrollTopOffset}
              />
            ) : openUpdateModal && booking ? (
              <UpdateBooking
                booking={booking ? booking : null}
                clearEmptyBookings={() => setEmptyBookings([])}
                setSidebarOpen={(e: any) => setSidebarOpen(e)}
                start={`${selectedStart}`}
                end={`${selectedEnd}`}
                handleClose={(e: any) => setOpenUpdateModal(e)}
                positionClass={calcModalPosition(positionClass)}
                tutorId={booking?.tutorId}
                topOffset={scrollTopOffset}
              />
            ):(
              <></>
            )}
            {openUnavailabilityModal && (
              <UnavailabilityModal
                key={selectedSlot ? selectedSlot.toString() : ''}
                event={selectedSlot}
                handleClose={() => {
                  setOpenUnavailabilityModal(false);
                  setUnavailableCurrentEvent([]);
                }}
                positionClass={getDayName(selectedSlot).toLowerCase()}
                topOffset={scrollTopOffset}
              />
            )}
            {openUnavailabilityEditModal && (
              <UnavailabilityEditModal
                event={getCurrentUnavailability()}
                handleClose={() => {
                  setOpenUnavailabilityEditModal(false);
                  setSelectedUnavailability('');
                }}
                positionClass={calcModalPosition(unavailablePositionClass)}
                topOffset={scrollTopOffset}
              />
            )}
          </div>
        </div>
        <div>
          <p className="upcoming-lessons__title">{t('MY_BOOKINGS.CALENDAR.TITLE')}</p>
          <div ref={highlightRef} className="card card--mini-calendar mb-4 pos--rel">
            <Calendar
              locale={i18n.language}
              onActiveStartDateChange={(e) => {
                hideShowHighlight(e.activeStartDate);
              }}
              onChange={(e: Date) => {
                onChange(e);
                setCalChange(!calChange);
                setOpenEventDetails(false);
                setOpenTutorCalendarModal(false);
              }}
              value={value}
              prevLabel={<PrevIcon />}
              nextLabel={<NextIcon />}
              formatMonthYear={(locale: any, date: any) => {
                return moment(date).format('MMM YYYY')[0].toUpperCase() + moment(date).format('MMM YYYY').slice(1).replace('.', '');
              }}
              formatDay={(locale: any, date: any) => {
                return moment(date).format('D');
              }}
            />
            <div
              ref={tileRef}
              style={{
                top: `${highlightCoords.y}px`,
                left: `${highlightCoords.x}px`,
              }}
              className="tile--row"
            ></div>
          </div>
          <div className="upcoming-lessons">
            <InformationCard title={t('MY_BOOKINGS.INFORMATION.CARD1.TITLE')} desc={t('MY_BOOKINGS.INFORMATION.CARD1.DESC')}/>
            <InformationCard title={t('MY_BOOKINGS.INFORMATION.CARD2.TITLE')} desc={t('MY_BOOKINGS.INFORMATION.CARD2.DESC')}/>
           {/*<UpcomingLessons upcomingLessons={upcomingLessons ? upcomingLessons : []} />*/}
          </div>
          {learnCubeModal && <LearnCubeModal bookingId={currentlyActiveBooking} handleClose={() =>{
            setLearnCubeModal(false);
          }} />}
        </div>
      </div>
    </MainWrapper>
  );
};

export default MyBookings;
