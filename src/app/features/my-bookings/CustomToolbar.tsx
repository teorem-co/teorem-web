import moment from 'moment';

import { ToolbarProps } from '@mui/material';
import { t } from 'i18next';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

interface Props {
  value: Date,
  onChangeDate: (date: Date) => void,
}

// interface Props {
//   onBack: () => void,
//   onNext: () => void,
//   onToday: () => void,
//   date: Date
// }

export const CustomToolbar = (props: Props) => {
  // const {onBack, onNext, onToday, date} = props;
  const {value, onChangeDate} = props;

  function onBack() {
    const prevDate = new Date(value);
    prevDate.setDate(value.getDate() - 1);
    onChangeDate(prevDate);
  }

  function onNext() {
    const nextDate = new Date(value);
    nextDate.setDate(value.getDate() + 1);
    onChangeDate(nextDate);
  }

  function onToday(){
    onChangeDate(new Date());
  }

  const label = () => {
    const selectedDate = moment(value);
    return (
      <div className="text-align--center flex flex--col">
        <span className="type--capitalize">{selectedDate.format('dddd')}</span>
        <b>{selectedDate.format(t('DATE_FORMAT'))}</b>
      </div>
    );
  };

  return (
    <div className={'flex flex--col flex--ai--center'}>


      <div className={'flex flex--row'}>
        <button className={'btn m-1 btn--sm flex flex--ai--center'} onClick={onBack}>
          <AiOutlineLeft/>
        </button>
        <button className={'btn m-1 btn--sm'} onClick={onToday}>{t('MY_BOOKINGS.CALENDAR.TODAY')}</button>
        <button className={'btn m-1 btn--sm flex flex--ai--center'} onClick={onNext}>
          <AiOutlineRight/>
        </button>
      </div>

      <label className={'mt-2 mb-3'}>{label()}</label>
    </div >
  );
};
