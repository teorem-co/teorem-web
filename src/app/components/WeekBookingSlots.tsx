import { TimeZoneSelect } from './TimeZoneSelect';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';
import moment from 'moment-timezone';
import {
  useLazyGetWeekPeriodsForTutorQuery,
} from '../features/my-bookings/services/bookingService';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

export interface TimeSlots {
  [date: string]: string[];
}


interface Period {
  startDate: string,
  endDate: string,
};

export const WeekBookingSlots = () => {
  const timeZoneState = useAppSelector((state) => state.timeZone);
  const [selectedZone, setSelectedZone] = useState(timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess());

  const [timeSlots, setTimeSlots] = useState<TimeSlots>();

  const [getTimeSlots] = useLazyGetWeekPeriodsForTutorQuery();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };


  const [period, setPeriod] = useState({
    startDate: '',
    endDate: '',
  });

  const setStartAndEndOfWeek = () => {
    if (period.endDate === '' || period.startDate === '') {
      const now = moment.tz(selectedZone);
      const start = now.clone().tz(selectedZone).toISOString();
      const end = now.clone().add(6, 'days').tz(selectedZone).toISOString();
      setPeriod({
        startDate: start,
        endDate: end,
      });
    } else {
      setPeriod({
        startDate: moment(period.startDate).tz(selectedZone).toISOString(),
        endDate: moment(period.endDate).tz(selectedZone).toISOString(),
      });
    }
  };

  function increaseWeek() {
    const startDate = moment(period.startDate).tz(selectedZone).add(1, 'week').toISOString();
    const endDate = moment(period.endDate).tz(selectedZone).add(1, 'week').toISOString();
    setPeriod({ startDate, endDate });
  }

  function decreaseWeek() {
    const startDate = moment(period.startDate).tz(selectedZone).subtract(1, 'week').toISOString();
    const endDate = moment(period.endDate).tz(selectedZone).subtract(1, 'week').toISOString();
    setPeriod({ startDate, endDate });
  }


  useEffect(() => {
    setStartAndEndOfWeek();
  }, [selectedZone]);

  async function fetchData() {
    if (!period.startDate || !period.endDate) return;

    const res = await getTimeSlots({
      tutorId: 'e3523194-444d-4cf0-b771-cc9ab782790c', //TODO: set tutorID
      startDate: moment(period.startDate).tz(selectedZone).format('YYYY-MM-DD'),
      endDate: moment(period.endDate).tz(selectedZone).format('YYYY-MM-DD'),
      timeZone: selectedZone,
    }).unwrap();

    setTimeSlots(res);
  }

  useEffect(() => {
    fetchData();
  }, [selectedZone, period]);

  return (
    <div className='w--800 align--center p-5'>
      <div>
        <div className={'flex flex--jc--space-between w--100'}>
          <div className={'flex flex-gap-2'}>
            <div className={'flex'}
                 style={{
                   height: '23px',
                   background: 'lightgray',
                   borderRadius: '4px',
                   padding: '1px',
                   boxSizing: 'content-box',
                 }}>

              <button
                onClick={decreaseWeek}
                className={'btn pr-2 pl-2 flex flex--center'}
                disabled={moment(period.startDate).tz(selectedZone).isSameOrBefore(moment().tz(selectedZone))}
                style={{ border: '1px solid lightgray', flex: 0 }}>

                <FaChevronLeft size={15} />
              </button>
              <button
                onClick={increaseWeek}
                className={'btn pr-2 pl-2 flex flex--center'}
                style={{ border: '1px solid lightgray', flex: 0 }}>
                <FaChevronRight size={15} />
              </button>
            </div>
            <span>{moment(period.startDate).tz(selectedZone).format('MMM D') + '-' + moment(period.endDate).tz(selectedZone).format('DD, YYYY')}</span>
          </div>
          <TimeZoneSelect
            className={'z-index-5'}
            defaultUserZone={timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess()}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
          />
        </div>
      </div>
      <div>
        {timeSlots &&
          <div className={'flex flex-gap-1 mt-4'}>
            {Object.keys(timeSlots).map(date => (
              <div key={date} className={'w--50'}>
                <div
                  className={`flex pt-1 pb-2 type--wgt--bold flex--col type--md type--center border-top-calendar${timeSlots[date].length > 0 ? '--primary' : '--secondary'}`}>
                  <span
                    className={'d--b type--base'}>{(moment(date).format('ddd').substring(0, 3)).charAt(0).toUpperCase() + (moment(date).format('ddd').substring(0, 3)).slice(1)}</span>
                  {/*className={'d--b type--base'}>{moment(date).format('ddd').substring(0, 3)}</span>*/}
                  <span
                    className={'d--b type--base'}>{moment(date).format('DD')}</span>
                </div>
                <div
                  className={`type--center timeslot-container ${isExpanded ? 'expanded' : ''}`}>

                  {timeSlots[date].map(timeSlot => (
                    <div className='mt-3 type--underline cur--pointer'
                         onClick={() => alert('selected time: ' + moment(timeSlot).toISOString())}
                         key={timeSlot}>{moment(timeSlot).format('HH:mm')}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
      </div>
      <div className='show-more-button' onClick={toggleExpand}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </div>
    </div>
  );
};
