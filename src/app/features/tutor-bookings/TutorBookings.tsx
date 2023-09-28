import { Form, FormikProvider, useFormik } from 'formik';
import i18n, { t } from 'i18next';
import { debounce, uniqBy } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

import {
  useLazyGetTutorBookingsQuery, useLazyGetTutorByTutorSlugQuery,
} from '../../../services/tutorService';
import { addStripeId } from '../../../slices/authSlice';
import { RoleOptions } from '../../../slices/roleSlice';
import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import Sidebar from '../../components/Sidebar';
import LoaderSecondary from '../../components/skeleton-loaders/LoaderSecondary';
import { useAppDispatch, useAppSelector } from '../../hooks';
import toastService from '../../services/toastService';
import { calcModalPosition } from '../../utils/calcModalPosition';
import ParentCalendarSlots from '../my-bookings/components/ParentCalendarSlots';
import ParentEventModal from '../my-bookings/components/ParentEventModal';
import UpdateBooking from '../my-bookings/components/UpdateBooking';
import {
  useLazyGetBookingByIdQuery,
  useLazyGetBookingsQuery,
} from '../my-bookings/services/bookingService';
import {
  useLazyGetUnavailableBookingsQuery,
} from '../my-bookings/services/unavailabilityService';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import IAddCustomerPost from '../my-profile/interfaces/IAddCustomerPost';
import ICardPost from '../my-profile/interfaces/ICardPost';
import {
  useAddCustomerMutation,
  useAddCustomerSourceMutation,
  useLazyGetCreditCardsQuery,
  useSetDefaultCreditCardMutation,
} from '../my-profile/services/stripeService';
import {
  useLazyGetTutorAvailabilityQuery,
} from '../my-profile/services/tutorAvailabilityService';
import { InformationCard } from '../../components/InformationCard';
import { CustomToolbar } from '../my-bookings/CustomToolbar';
import ScrollContext from '../../components/ScrollContext';

interface IBookingTransformed {
  id: string;
  label: string;
  start: Date;
  end: Date;
  allDay: boolean;
  userId?: string;
}

// interface IEvent {
//     id?: string;
//     label: string;
//     start: string;
//     end: string;
//     allDay: boolean;
// }

interface ICoords {
  x: number;
  y: number;
}

const TutorBookings = () => {
  const [scrollTopOffset, setScrollTopOffset] = useState<number>(0);
  const [getTutorBookings, { data: tutorBookings, isLoading: isLoadingTutorBookings }] = useLazyGetTutorBookingsQuery();
  const [getTutorUnavailableBookings, { data: unavailableBookings, isLoading: isLoadingUnavailableBookings }] = useLazyGetUnavailableBookingsQuery();
  const [getTutorData, { data: tutorData }] = useLazyGetTutorByTutorSlugQuery({
    selectFromResult: ({ data, isSuccess, isLoading }) => ({
      data: {
        firstName: data?.User.firstName,
        lastName: data?.User.lastName,
        disabled: data?.disabled
      },
      isSuccess,
      isLoading,
    }),
  });
  const [getTutorAvailability, { data: tutorAvailability, isLoading: tutorAvailabilityLoading }] = useLazyGetTutorAvailabilityQuery();

  const [getBookingById, { data: booking, isLoading: bookingIsLoading, isFetching:bookingIsFetching }] = useLazyGetBookingByIdQuery();
  const [addCustomerSource] = useAddCustomerSourceMutation();
  const [addStripeCustomer, { data: dataStripeCustomer, isSuccess: isSuccessDataStripeCustomer, isError: isErrorDataStripeCustomer }] =
    useAddCustomerMutation();
  const [getCreditCards, { data: creditCards, isLoading: creditCardLoading, isUninitialized: creditCardUninitialized }] =
    useLazyGetCreditCardsQuery();
  const [setDefaultCreditCard, { isSuccess: isSuccessSetDefaultCreditCard }] = useSetDefaultCreditCardMutation();
  const dispatch = useAppDispatch();

  const [selectedStart, setSelectedStart] = useState<string>('');
  const [selectedEnd, setSelectedEnd] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [emptyBookings, setEmptyBookings] = useState<IBookingTransformed[]>([]);
  const [openSlot, setOpenSlot] = useState<boolean>(false);
  //const [eventDetails, setEventDetails] = useState<IEvent>();
  const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [calChange, setCalChange] = useState<boolean>(false);
  const [value, onChange] = useState(new Date());
  const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
  const [currentlyActiveBooking, setCurentlyActiveBooking] = useState<string>('');
  const [highlightCoords, setHighlightCoords] = useState<ICoords>({
    x: 0,
    y: 0,
  });

  const localizer = momentLocalizer(moment);
  const history = useHistory();
  const positionClass = moment(selectedStart).format('dddd');
  const userRole = useAppSelector((state) => state.auth.user?.Role?.abrv);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const stripeCustomerId = useAppSelector((state) => state.auth.user?.stripeCustomerId);
  const userInfo = useAppSelector((state) => state.auth.user);

  const [tutorId, setTutorId] = useState('');
  const { tutorSlug } = useParams();
  const [minimumUnavailability, setminimumUnavailability] = useState<IBookingTransformed>();
  const [pastUnavailability, setPastUnavailability] = useState<IBookingTransformed>();


  useEffect(() => {
    getTutorData(tutorSlug)
      .unwrap()
      .then((tutorIdObj: any) => {
        setTutorId(tutorIdObj.userId);
      });
  }, []);

  useEffect(() => {
    if (tutorId) {
      fetchData();
    }
  }, [tutorId]);

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
              label: 'unavailable',
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
  const { t } = useTranslation();
  const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));
  const highlightRef = useRef<HTMLDivElement>(null);
  const allBookings =
    tutorBookings &&
    tutorBookings
      .concat(emptyBookings, unavailableBookings ? unavailableBookings : [])
      .concat(tutorAvailability ? arrayDataToUnavailabilityObjects(tutorAvailability, firstDayOfSelectedWeek) : [])
      .concat(minimumUnavailability ? minimumUnavailability : []);
  const [allBookings2, setAllBookings2] = useState<IBookingTransformed[]>(mergeOverlappingEvents(allBookings ? allBookings : []));
  const existingBookings = tutorBookings && tutorBookings.concat(unavailableBookings ? unavailableBookings : []).concat(tutorAvailability ? arrayDataToUnavailabilityObjects(tutorAvailability, firstDayOfSelectedWeek) : []);
  const totalBookings = allBookings2 && allBookings2.concat([]); //allBookings && allBookings.concat(bookings ? bookings : []) &&
  const filteredBookings = uniqBy(totalBookings, 'id');
  const tileRef = useRef<HTMLDivElement>(null);
  const tileElement = tileRef.current as HTMLDivElement;

  interface Values {
    cardFirstName: string;
    cardLastName: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
  }
  const initialValues: Values = {
    cardFirstName: '',
    cardLastName: '',
    city: '',
    country: '',
    line1: '',
    line2: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    zipCode: '',
  };

  const isLoading = isLoadingTutorBookings || isLoadingUnavailableBookings || tutorAvailabilityLoading;

  const CustomHeader = (date: any) => {
    setCalChange(true);
    return (
      <>
        <div className="mb-2">{moment(date.date).format('dddd')}</div>
        <div className="type--color--tertiary">{moment(date.date).format('DD MMM')}</div>
      </>
    );
  };

  const CustomEvent = (event: any) => {
    if (event.event?.userId !== userId) {
      return (
        <>
          {event.event.label !== 'unavailableHoursBefore' ?
            <div className="event--unavailable">
              <div className="type--color--primary type--wgt--extra-bold" style={{fontSize: 'small', textAlign: 'center'}}>
                {event.event.label === 'unavailableHoursBefore' ?
                  t('BOOKING.CANT_BOOK_MESSAGE')
                  :
                  null
                }

              </div>
            </div>

            :

            <div className="event--unavailable-min-time">
              <div className="type--color--primary type--wgt--extra-bold" style={{fontSize: 'small', textAlign: 'center'}}>
                {(event.event.label === 'unavailableHoursBefore' ) ?
                  t('BOOKING.CANT_BOOK_MESSAGE')
                  :
                  null
                }

              </div>
            </div>
          }

        </>
      );
    } else {
      if (event.event?.isAccepted === false) {
        return (
          <div className="event">
            <div className="type--wgt--bold">{event.event.label}</div>
          </div>
        );
      } else {
        return (
          <div className="event event--pending">
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

  const state = useAppSelector((state) => state.scroll);
  const {topOffset} = state;

  const slotSelect = (e: SlotInfo) => {
    if(e.bounds?.bottom){
        console.log('WINDOW:', topOffset);
        setScrollTopOffset(e.bounds?.bottom + topOffset);
    }

    const existingBooking =
      existingBookings && existingBookings.filter((date) => moment(date.start).format('YYYY/MM/DD') === moment(e.start).format('YYYY/MM/DD'));

    let isAvailableBooking = false;

    const endDat = moment(e.end).toDate();

    tutorAvailability &&
      tutorAvailability.forEach((index, item) => {
        if (item > 0) {
          index.forEach((day, dayOfWeek) => {
            if (dayOfWeek >= 0 && endDat.getDay() == dayOfWeek && day) {
              switch (index[0]) {
                case 'Pre 12 pm':
                  if (endDat.getHours() <= 12){
                    isAvailableBooking = true;
                  }
                  break;
                case '12 - 5 pm':
                  if (endDat.getHours() >= 12 && endDat.getHours() <= 17) isAvailableBooking = true;
                  break;
                case 'After 5 pm':
                  if (endDat.getHours() >= 17) isAvailableBooking = true;
                  break;
                default:
                  break;
              }
            }
          });
        }
      });

    const flagArr = [];
    if (existingBooking) {
      const checkHours = !moment(e.start).isBefore(moment().add(3, 'hours'));
      existingBooking.forEach((booking) => {
        const isBetweenStart = moment(e.start).isBetween(moment(booking.start), moment(booking.end));
        const isBetweenEnd = moment(e.start).add(1, 'hours').isBetween(moment(booking.start), moment(booking.end));

        const currentFlag = checkHours && isBetweenStart === false && isBetweenEnd === false;
        if (currentFlag) {
          flagArr.push(true);
        }
      });
    }

    console.log("FIRST: ",flagArr.length === existingBooking?.length);
    console.log("SECOND: ", !moment(e.start).isBefore(moment().add(3, 'hours')));
    console.log("THIRD: ", isAvailableBooking);

    const firstCheck = flagArr.length === existingBooking?.length;

    if (firstCheck && !moment(e.start).isBefore(moment().add(3, 'hours')) && isAvailableBooking) {
      // setSelectedStart(moment(e.start).format('t('DATE_FORMAT'), HH:mm'));     MMMM format doesn't work with different languages!
      setSelectedStart(moment(e.start).format());
      setSelectedEnd(moment(e.start).add(1, 'hours').format('HH:mm'));
      setOpenSlot(true);
      setOpenUpdateModal(false);
      setOpenEventDetails(false);

      setEmptyBookings([
        {
          id: '',
          start: moment(e.start).toDate(),
          end: moment(e.start).add(1, 'hours').toDate(),
          label: 'Book event',
          allDay: false,
          userId: userId ? userId : '',
        },
      ]);
      // return CustomEvent(e.slots);
    } else {
      setOpenSlot(false);
      setEmptyBookings([]);

      toastService.info(`${t('BOOKING.TOAST_CANT_BOOK')}`);
    }
  };

  const handleSelectedEvent = (e: IBookingTransformed) => {
    setCurentlyActiveBooking(e.id);
    // check whole date not only hours this is a bug

    if (e.userId === userId) {
      if (moment(e.start).isBefore(moment()) || emptyBookings.length > 0) {
        return;
      } else {
        setOpenSlot(false);
        setOpenEventDetails(true);
        getBookingById(e.id);
        // setEventDetails({
        //     start: moment(e.start).format('t('DATE_FORMAT'), HH:mm'),
        //     end: moment(e.end).format('HH:mm'),
        //     allDay: e.allDay,
        //     label: e.label,
        // });
        setSelectedStart(moment(e.start).format(t('DATE_FORMAT') + ', HH:mm'));
        setSelectedEnd(moment(e.end).add(1,'minute').format('HH:mm')); // one minute is added because in DATABASE we have like e.q HH:59:59
        // if (booking && booking.id) {
        //     setOpenSlot(true);
        // }
      }
    } else {
      return;
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      cardFirstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      cardLastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      city: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      country: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      line1: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      line2: Yup.string(),
      cardNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      cvv: Yup.string().max(3, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
    }),
  });

  //use for creadit card information sidebar
  const handleSubmit = async (values: any) => {
    setSidebarOpen(false);
    if (!stripeCustomerId) {
      //If user has not added any card to the stripe yet
      //    - add user to stripe
      //    - add stripeID to redux
      //    - set Added credit card to be default
      const toSend: IAddCustomerPost = {
        userId: userInfo!.id,
        customer: {
          address: {
            city: values.city,
            country: values.country,
            line1: values.line1,
            line2: values.line2,
            postal_code: Number(values.zipCode),
            state: values.city,
          },
          description: ' ',
          email: userInfo!.email,
          name: values.cardFirstName + ' ' + values.cardLastName,
          phone: userInfo!.phoneNumber,
        },
      };
      await addStripeCustomer(toSend).unwrap();
    }

    const toSend: ICardPost = {
      object: 'card',
      number: values.cardNumber.toString(),
      exp_month: Number(values.expiryDate.split('/')[0]),
      exp_year: Number('20' + values.expiryDate.split('/')[1]),
      cvc: Number(values.cvv),
      name: 'creditCard',
      address_line1: values.line1,
      address_city: values.city,
      address_zip: values.zipCode,
      address_country: values.country,
    };

    const toSendCustomerSource = {
      userId: userInfo!.id,
      card: toSend,
    };

    addCustomerSource(toSendCustomerSource)
      .unwrap()
      .then(() => {
        fetchData();
        setSidebarOpen(false);
      });
  };

  useEffect(() => {
    if (isSuccessDataStripeCustomer) {
      dispatch(addStripeId(dataStripeCustomer.id));
      const waitForCreditCard = async () => {
        setTimeout(() => {
          getCreditCards(dataStripeCustomer.id)
            .unwrap()
            .then(() => {
              setDefaultCreditCard({
                userId: userInfo!.id,
                sourceId: dataStripeCustomer.id,
              });
            });
        }, 1000);
      };
    } else if (isErrorDataStripeCustomer) {
      toastService.success(t('PROFILE_ACCOUNT.STRIPE_DEFAULT_PAYMENT_METHOD_UPDATED'));
    }
  }, [isSuccessDataStripeCustomer, isErrorDataStripeCustomer]);

  const handleUpdateModal = (isOpen: boolean) => {
    setOpenUpdateModal(isOpen);
    setOpenEventDetails(false);
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

  const fetchData = async () => {
    if (tutorId) {
      await getTutorUnavailableBookings({
        tutorId: tutorId,
        dateFrom: moment(value).startOf('isoWeek').toISOString(),
        dateTo: moment(value).endOf('isoWeek').toISOString(),
      }).unwrap();

      await getTutorAvailability(tutorId).unwrap();
    }
  };

  /*useEffect(() => {
        fetchData();
    }, []);*/

  let unavailability: IBookingTransformed | null = null;
  let pastUnava: IBookingTransformed | null = null;
  const [hasRunThisMinute, setHasRunThisMinute] = useState(false);
  const [hasRunThisMinutePastUnavailability, sethasRunThisMinutePastUnavailability] = useState(false);

  function calculateAndSetMinimumUnavailability() {
    if (!hasRunThisMinute) {
      const currentDate = new Date();


      if (unavailability) {
        // Update start time to the current time
        unavailability.start = new Date(currentDate);
        // Update end time to 3 hours after the start time
        unavailability.end = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);

        // Call the function to set the time (I'm assuming you have this function defined elsewhere)
        setminimumUnavailability(unavailability);
      } else {
        // Create the initial unavailability object if it doesn't exist

        unavailability = {
          start: new Date(currentDate),
          end: new Date(currentDate.getTime() + 3 * 60 * 60 * 1000),
          id: uuidv4(),
          label: 'unavailableHoursBefore',
          allDay: false,
        };

        setminimumUnavailability(unavailability);
      }

      // FOR GRAYING OUT PAST TIME
      const start = moment(currentDate).startOf('week').toDate();
      if (pastUnava) {
        // Update start time to the current time
        pastUnava.start = new Date(start);

        // Update end time to 3 hours after the start time
        pastUnava.end = new Date(currentDate.getTime());

        // Call the function to set the time (I'm assuming you have this function defined elsewhere)
        setPastUnavailability(pastUnava);
      } else {
        // Create the initial unavailability object if it doesn't exist
        pastUnava = {
          start: new Date(start),
          end: currentDate,
          id: uuidv4(),
          label: 'unavailablePrevious',
          allDay: false,
        };

        setPastUnavailability(pastUnava);
      }

      setHasRunThisMinute(true);

      setTimeout(() => {
        setHasRunThisMinute(false);
      }, 60000);
    }
  }


  function mergeOverlappingEvents(events: IBookingTransformed[]): IBookingTransformed[] {
    events.sort((a, b) => a.start.getTime() - b.start.getTime());

    const mergedEvents: IBookingTransformed[] = [];

    let currentEvent = {...events[0]};  // Create a new object rather than referencing the original one
    for(let i = 1; i < events.length; i++) {
      const nextEvent = {...events[i]}; // Create a new object rather than referencing the original one
      if(
        currentEvent.end.getTime() >= nextEvent.start.getTime() && (currentEvent.label !== 'Book event' && nextEvent.label !== 'Book event')
      ) {

          if(nextEvent.label === 'unavailableHoursBefore' ){
            const nextNextEvent = {...events[i +1]};

            if(i == events.length-1 && !(currentEvent.end.getTime() > nextEvent.start.getTime())){
              mergedEvents.push(nextEvent);
              continue;
            }

            if(
              nextNextEvent
              &&
              (
                !moment(nextEvent.end).isSame(moment(nextNextEvent.start), 'day')
                || moment(nextEvent.end).isBefore(moment(nextNextEvent.start))
              )
              &&
              !(currentEvent.end.getTime() > nextEvent.start.getTime())
            ){

              mergedEvents.push(nextEvent);
              continue;
            }
          }

        currentEvent = {...currentEvent, label: 'unavailable', end: new Date(Math.max(currentEvent.end.getTime(), nextEvent.end.getTime()))};

      } else {
        mergedEvents.push(currentEvent);
        currentEvent = nextEvent;
      }
    }

    mergedEvents.push(currentEvent);

    return mergedEvents;
  }

  useEffect(() => {
    if(!hasRunThisMinute){
      calculateAndSetMinimumUnavailability();
    }
  });


  useEffect(() =>{
    const tutBookings = tutorBookings &&  tutorBookings
      .concat(emptyBookings, unavailableBookings ? unavailableBookings : [])
      .concat(tutorAvailability ? arrayDataToUnavailabilityObjects(tutorAvailability, firstDayOfSelectedWeek) : [])
      .concat(minimumUnavailability ? minimumUnavailability : [])
      .concat(pastUnavailability ? pastUnavailability : [])
    ;

    let transformedBookings;
    if(tutBookings){
      transformedBookings = mergeOverlappingEvents(tutBookings);
      setAllBookings2(transformedBookings ? transformedBookings : []);
    }

  }, [tutorBookings, minimumUnavailability, tutorAvailability, emptyBookings, pastUnavailability]);



  useEffect(() => {
    calcPosition();
    hideShowHighlight(value);
    setSelectedDateFirstDayOfWeek(value);
  }, [value]);

  useEffect(() => {
    const indicator: any = document.getElementsByClassName('rbc-current-time-indicator');
    indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));

    const interval = setInterval(() => {
      indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));
    }, 60000);
    return () => clearInterval(interval);
  }, [calChange]);

  useEffect(() => {
    if (tutorId) {
      getTutorBookings({
        dateFrom: moment(value).startOf('isoWeek').toISOString(),
        dateTo: moment(value).endOf('isoWeek').toISOString(),
        tutorId: tutorId,
      });
    }
  }, [value, tutorId]);

  const setSelectedDateFirstDayOfWeek = (date:Date) =>{
    if(calculateFirstDayOfWeek(firstDayOfSelectedWeek) != calculateFirstDayOfWeek(date))
      setFirstDayOfSelectedWeek(date);
  };

  const calculateFirstDayOfWeek = (date: Date): number => {
    return moment(date).startOf('week').date();
  };

  const isMobile = window.innerWidth < 767;
  function onChangeDate(date: Date){
    onChange(date);
    setCalChange(!calChange);
  }


  return (
    <MainWrapper>
      <div className="layout--primary">
        {isLoading ? <LoaderSecondary /> : <></>}
        <div>
          {/* {(isLoading && <LoaderPrimary />) || ( */}
          <div className="card--calendar">
            <div className="flex flex--center p-6">
              {/* <Link to={PATHS.SEARCH_TUTORS}>
                            <div>
                                <i className="icon icon--base icon--arrow-left icon--black"></i>
                            </div>
                        </Link> */}
              <div onClick={() => history.goBack()}>
                <div>
                  <i className="icon icon--base icon--arrow-left icon--black"></i>
                </div>
              </div>
              <h2 className="type--lg  ml-6">
                {`${t('MY_BOOKINGS.TITLE')} - ${tutorData.firstName ? tutorData.firstName : ''} ${tutorData.lastName ? tutorData.lastName : ''}`}
              </h2>
            </div>
            <BigCalendar
              localizer={localizer}
              formats={{
                timeGutterFormat: 'HH:mm',
              }}
              events={filteredBookings ? filteredBookings : []}
              toolbar={true}
              date={value}
              onSelecting={() => true}
              view={isMobile ? "day" : "week"}
              style={{ height: 'calc(100% - 84px)' }}
              startAccessor="start"
              endAccessor="end"
              components={{
                week: {
                  header: (date) => CustomHeader(date),
                },
                event: (event) => CustomEvent(event),
                toolbar: () =>
                  (isMobile ? <CustomToolbar
                    value={value}
                    onChangeDate={onChangeDate} /> : null)
              }}
              scrollToTime={defaultScrollTime}
              showMultiDayTimes={true}
              step={15}
              timeslots={4}
              selectable={true}
              longPressThreshold={50}
              onSelectSlot={(e) => (userRole === RoleOptions.Parent || userRole === RoleOptions.Student ? slotSelect(e) : null)}
              onSelectEvent={(e) => (userRole === RoleOptions.Parent || userRole === RoleOptions.Student ? handleSelectedEvent(e) : null)}
            />
            {openSlot ? (
              //creating new booking
              <ParentCalendarSlots
                clearEmptyBookings={() => setEmptyBookings([])}
                setSidebarOpen={(e) => setSidebarOpen(e)}
                start={`${selectedStart}`}
                end={`${selectedEnd}`}
                handleClose={(e) => setOpenSlot(e)}
                positionClass={calcModalPosition(positionClass)}
                tutorId={tutorId}
                tutorDisabled={tutorData.disabled}
                topOffset={scrollTopOffset}
              />
            ) : openEventDetails ? (
              //opening booking details
                !bookingIsLoading && !bookingIsFetching && <ParentEventModal
                eventIsAccepted={booking ? booking.isAccepted : false}
                bookingStart={booking ? booking.startTime : ''}
                openEditModal={(isOpen) => handleUpdateModal(isOpen)}
                tutorName={tutorData.firstName && tutorData.lastName ? tutorData.firstName + ' ' + tutorData.lastName : ''}
                event={booking ? booking : null}
                handleClose={(e) => setOpenEventDetails(e)}
                positionClass={calcModalPosition(positionClass)}
                openLearnCube={() => setLearnCubeModal(true)}
              />
            ) : openUpdateModal ? (
              <UpdateBooking
                booking={booking ? booking : null}
                clearEmptyBookings={() => setEmptyBookings([])}
                setSidebarOpen={(e: any) => setSidebarOpen(e)}
                start={`${selectedStart}`}
                end={`${selectedEnd}`}
                handleClose={(e: any) => setOpenUpdateModal(e)}
                positionClass={calcModalPosition(positionClass)}
                tutorId={tutorId}
              />
            ) : (
              <></>
            )}
          </div>
          {/* )} */}
        </div>
        <div>
          <div ref={highlightRef} className="card card--mini-calendar mb-4 pos--rel">
            <Calendar
              locale={i18n.language}
              onActiveStartDateChange={(e) => {
                hideShowHighlight(e.activeStartDate);
              }}
              onChange={(e: Date) => {
                onChange(e);
                setCalChange(!calChange);
              }}
              value={value}
              prevLabel={<PrevIcon />}
              nextLabel={<NextIcon />}
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
            <p className="upcoming-lessons__title">{t('MY_BOOKINGS.INFORMATION.TITLE')}</p>
            <InformationCard title={t('MY_BOOKINGS.INFORMATION.CARD1.TITLE')} desc={t('MY_BOOKINGS.INFORMATION.CARD1.DESC')}/>
            <InformationCard title={t('MY_BOOKINGS.INFORMATION.CARD2.TITLE')} desc={t('MY_BOOKINGS.INFORMATION.CARD2.DESC')}/>
          </div>

          {/* needs to be in this place because layout have nth-child selector */}
          {sidebarOpen ? (
            <Sidebar
              sideBarIsOpen={sidebarOpen}
              title="ADD NEW CARD"
              onSubmit={formik.handleSubmit}
              closeSidebar={() => setSidebarOpen(false)}
              cancelLabel="Cancel"
              submitLabel="Add New Card"
              children={
                <FormikProvider value={formik}>
                  <Form>
                    <div className="field">
                      <label htmlFor="cardFirstName" className="field__label">
                        {t('ACCOUNT.NEW_CARD.NAME')}
                      </label>
                      <TextField name="cardFirstName" id="cardFirstName" placeholder={t('ACCOUNT.NEW_CARD.NAME_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="cardLastName" className="field__label">
                        {t('ACCOUNT.NEW_CARD.SURNAME')}
                      </label>
                      <TextField name="cardLastName" id="cardLastName" placeholder={t('ACCOUNT.NEW_CARD.SURNAME_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="city" className="field__label">
                        {t('ACCOUNT.NEW_CARD.CITY')}
                      </label>
                      <TextField name="city" id="city" placeholder={t('ACCOUNT.NEW_CARD.CITY_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="country" className="field__label">
                        {t('ACCOUNT.NEW_CARD.COUNTRY')}
                      </label>
                      <TextField name="country" id="country" placeholder={t('ACCOUNT.NEW_CARD.COUNTRY_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="line1" className="field__label">
                        {t('ACCOUNT.NEW_CARD.ADDRESS1')}
                      </label>
                      <TextField
                        name="line1"
                        id="line1"
                        placeholder={t('ACCOUNT.NEW_CARD.ADDRESS1_PLACEHOLDER')}
                        withoutErr={formik.errors.line1 && formik.touched.line1 ? false : true}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="line2" className="field__label">
                        {t('ACCOUNT.NEW_CARD.ADDRESS2')}
                      </label>
                      <TextField name="line2" id="line2" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS2_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="cardNumber" className="field__label">
                        {t('ACCOUNT.NEW_CARD.CARD_NUMBER')}
                      </label>
                      <TextField type="number" name="cardNumber" id="cardNumber" placeholder={t('ACCOUNT.NEW_CARD.CARD_NUMBER_PLACEHOLDER')} />
                    </div>
                    <div className="field field__file">
                      <div className="flex">
                        <div className="field w--100 mr-6">
                          <label htmlFor="expiryDate" className="field__label">
                            {t('ACCOUNT.NEW_CARD.EXPIRY')}
                          </label>
                          <TextField
                            type="text"
                            name="expiryDate"
                            id="expiryDate"
                            placeholder={t('ACCOUNT.NEW_CARD.EXPIRY_PLACEHOLDER')}
                            mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                          />
                        </div>

                        <div className="field w--100">
                          <label htmlFor="cvv" className="field__label">
                            {t('ACCOUNT.NEW_CARD.CVV')}
                          </label>
                          <TextField max={3} maxLength={3} type="number" name="cvv" id="cvv" placeholder={t('ACCOUNT.NEW_CARD.CVV_PLACEHOLDER')} />
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="zipCode" className="field__label">
                        {t('ACCOUNT.NEW_CARD.ZIP')}
                      </label>
                      <TextField type="number" name="zipCode" id="zipCode" placeholder={t('ACCOUNT.NEW_CARD.ZIP_PLACEHOLDER')} />
                    </div>
                  </Form>
                </FormikProvider>
              }
            />
          ) : (
            <></>
          )}
          {learnCubeModal && <LearnCubeModal bookingId={currentlyActiveBooking} handleClose={() => setLearnCubeModal(false)} />}
        </div>
      </div>
    </MainWrapper>
  );
};

export default TutorBookings;
