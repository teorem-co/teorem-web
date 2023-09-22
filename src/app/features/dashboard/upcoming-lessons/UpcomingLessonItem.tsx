import { t } from 'i18next';
import moment from 'moment/moment';
import { PATHS } from '../../../routes';
import React from 'react';
import { useHistory } from 'react-router';

interface Props{
  id: string,
  firstName: string,
  lastName: string,
  levelAbrv: string,
  subjectAbrv: string,
  startTime: string,
  endTime: string,

}

export const UpcomingLessonItem = ({ firstName, id, lastName, levelAbrv, subjectAbrv, startTime, endTime }: Props) => {
  const history = useHistory();

  return (
    <>
      {/*<div className="dashboard__list__item" key={id}>*/}
      {/*  <div>*/}
      {/*    {firstName}&nbsp;{lastName}*/}
      {/*  </div>*/}
      {/*  <div>{t(`LEVELS.${levelAbrv.toLowerCase().replace("-", "")}`)}</div>*/}
      {/*  <div>*/}
      {/*    <span className="tag tag--primary">{t(`SUBJECTS.${subjectAbrv.replace('-', '')}`)}</span>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    {moment(startTime).format('HH:mm')} -{' '}*/}
      {/*    {moment(endTime).add(1, 'minute').format('HH:mm')}*/}
      {/*  </div>*/}
      {/*  <div*/}
      {/*    onClick={() => {*/}
      {/*      history.push({*/}
      {/*        pathname: t(PATHS.MY_BOOKINGS),*/}
      {/*        state: { value: new Date(startTime).toString() }*/}
      {/*      });*/}
      {/*    }*/}
      {/*    }>*/}
      {/*    <i className="icon icon--base icon--chevron-right icon--primary"></i>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="dashboard-upcoming-item" key={id}>
        <div className="flex flex--row flex--ai--center flex--jc--space-between">
          <div className='flex flex--col'>
            <span className="mb-2 ml-1"> {firstName}&nbsp;{lastName}</span>
            <span
              style={{margin:0, padding:'0 5px', width:'fit-content'}}
              className="tag tag--primary text-align--start ">{t(`SUBJECTS.${subjectAbrv.replace('-', '')}`)}</span>
          </div>

          <div className='flex flex--col'>
            <div className='flex flex--row flex--ai--center mb-1'>
              <p> {moment(startTime).format('HH:mm')} -{' '}
                {moment(endTime).add(1, 'minute').format('HH:mm')}</p>

            </div>
            <p>{t(`LEVELS.${levelAbrv.toLowerCase().replace("-", "")}`)}</p>
          </div>

          <div className='flex flex--col flex--ai--center'
               onClick={() => {
                 history.push({
                   pathname: t(PATHS.MY_BOOKINGS),
                   state: { value: new Date(startTime).toString() }
                 });
               }}
          >
            <i className="icon icon--base icon--chevron-right icon--primary"></i>
          </div>
        </div>
      </div>
    </>
  );
};
