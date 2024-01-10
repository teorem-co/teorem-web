import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useLazyGetChildQuery } from '../../../../services/userService';
import { RoleOptions } from '../../../../slices/roleSlice';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import MyTimePicker from '../../../components/form/MyTimePicker';
import MyTextField from '../../../components/form/MyTextField';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import {
  useDeleteBookingMutation,
  useUpdateBookingMutation,
} from '../services/bookingService';
import { ConfirmationModal } from '../../../components/ConfirmationModal';

interface IProps {
  start?: string;
  end?: string;
  handleClose?: (close: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  positionClass: string;
  clearEmptyBookings: () => void;
  booking: IBooking | null;
  tutorId: string;
  topOffset?:number;
}

interface Values {
  level: string;
  subject: string;
  child: string;
  timeFrom: string;
}
const UpdateBooking: React.FC<IProps> = (props) => {
  const [deleteBooking] = useDeleteBookingMutation();

  const {topOffset, start, end, handleClose, positionClass, setSidebarOpen, clearEmptyBookings, booking } = props;
  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
  const userId = useAppSelector((state) => state.auth.user?.id);

  const handleDeleteBooking = () => {
    if (booking) {
      deleteBooking(booking.id);
      handleClose ? handleClose(false) : false;
    }
  };

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Values>({
    level: '',
    subject: '',
    child: '',
    timeFrom: moment(booking?.startTime).format('HH:mm'),
  });

  const [getChildOptions] = useLazyGetChildQuery();
  const [updateBooking, { isSuccess: updateBookingSuccess }] = useUpdateBookingMutation();

  const handleSubmit = (values: any) => {
    console.log('Handling submit....');
    props.setSidebarOpen(false);
    const splitString = selectedTime.split(':');

    console.log('selected time: ', selectedTime);
    console.log('Initial values: ', initialValues.timeFrom);
    if (!isEqual(selectedTime, initialValues.timeFrom)) {
      console.log('Inside if, should send request to BE');
      updateBooking({
        startTime: moment(booking?.startTime).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
        bookingId: booking ? booking.id : '',
      });
    }
  };

  const handleChange = (e: any) => {
    console.log('Handling change...');
    setSelectedTime(e);
    formik.setFieldValue('timeFrom', e);
  };


  useEffect(() => {
console.log('In effect, selected time: ', selectedTime);
  }, [selectedTime]);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object(),
  });

  useEffect(() => {

    if (userRole === RoleOptions.Parent && userId) {
      getChildOptions(userId);
    }

  }, []);


  useEffect(() => {
    if (updateBookingSuccess) {
      toastService.success('Booking updated');
      handleClose ? handleClose(false) : false;
    }
  }, [updateBookingSuccess]);

  useEffect(() => {
    if (booking) {
      const values: Values = {
        level: booking.Level.id,
        subject: booking.subjectId,
        child: booking.User.id,
        timeFrom: moment(booking.startTime).format('HH:mm'),
      };
      setInitialValues(values);
    }
  }, [booking]);


  const [showConfirmModal, setShowConfirmModal] = useState(false);

  function dismissCancelBooking(){
    setShowConfirmModal(false);
  }

  const isMobile = window.innerWidth < 776;
  const mobileStyles = isMobile? { top: `${topOffset}px` } : {};

  return (
    <>
    <div  style={mobileStyles}  className={`modal--parent  modal--parent--${isMobile ? '' : positionClass}`}>
      <div className="modal--parent__header">
        <div className="flex flex--primary">
          <div>
            <div className="type--wgt--bold type--md mb-1">{t('BOOK.TITLE')}</div>
            <div className="type--color--secondary">
              {start} - {end}
            </div>
          </div>
          <div>
            <i
              className="icon icon--base icon--grey icon--close mb-6"
              onClick={() => {
                handleClose ? handleClose(false) : false;
                props.clearEmptyBookings();
                formik.setFieldValue('level', '');
                formik.setFieldValue('subject', '');
                formik.setFieldValue('child', '');
              }}
            ></i>
          </div>
        </div>
      </div>

      <div className="modal--parent__line"></div>

      <div className="modal--parent__body">
        <div className="mb-4">
          { userRole !== RoleOptions.Tutor && <div className="flex flex--center mb-4">
            <i className="icon icon--base icon--tutor icon--grey mr-4"></i>
            <div className="type--color--secondary">{booking?.User.firstName}</div>
          </div>}

          <div className="flex flex--center mb-4">
            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
            <div className="type--color--secondary w--100">
              {t(`SUBJECTS.${booking?.Subject.abrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`)}&nbsp;-&nbsp;
              {t(`LEVELS.${booking?.Level.name.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
            </div>
          </div>

          {userRole === RoleOptions.Student ? (
            <></>
          ) : (
            <div className="flex flex--center">
              <i className="icon icon--base icon--child icon--grey mr-4"></i>
              <div className="type--color--secondary w--100">{booking?.userFullName}</div>
            </div>
          )}
        </div>
        <FormikProvider value={formik}>
          <Form id="updateBookingForm">
            <div className="field">
              <label htmlFor="timeFrom" className="field__label">
                {t('BOOK.FORM.TIME')}
              </label>
              <div className="flex">
                <div className="field w--100 mr-6">
                  <MyTimePicker
                    field={formik.getFieldProps('timeFrom')}
                    form={formik}
                    meta={formik.getFieldMeta('timeFrom')}
                    defaultValue={moment(formik.values.timeFrom, 'HH:mm')}
                    onChangeCustom={(e) => handleChange(moment(e, 'HH:mm').format('HH:mm'))}
                  />
                </div>
                <div className="field w--100">
                  <MyTextField
                    // isDisabled={levelDisabled}
                    placeholder={t('BOOK.FORM.TIME_PLACEHOLDER')}
                    name="time"
                    id="time"
                    disabled={true}
                    value={moment(formik.values.timeFrom, 'HH:mm').add(1, 'hour').format('HH:mm')}
                  />
                </div>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </div>
      <div className="modal--parent__footer">
        {/* <button className="btn btn--base type--wgt--extra-bold btn--primary mb-1" onClick={() => handleSubmitForm()}> */}
        <button form="updateBookingForm"
                className="btn btn--base type--wgt--extra-bold btn--primary mb-1"
                disabled={moment(start, 'HH:mm').isSame(moment(formik.values.timeFrom, 'HH:mm')) }>
          {t('BOOK.FORM.UPDATE')}
        </button>
        <button
          className="btn btn--base type--wgt--extra-bold btn--clear type--color--error"
          onClick={() => {
            props.clearEmptyBookings();
            setShowConfirmModal(true);
          }}
        >
          {!booking?.isAccepted && userRole === RoleOptions.Tutor ? t('MY_BOOKINGS.MODAL.DENY') : t('BOOK.FORM.CANCEL_BOOKING')}
        </button>
      </div>

    </div>
  {showConfirmModal &&
    <ConfirmationModal
    title={t('MY_BOOKINGS.MODAL.CONFIRM_CANCEL_TITLE')}
    confirmButtonTitle={t('BOOK.FORM.CANCEL_BOOKING')}
    cancelButtonTitle={t('BOOK.FORM.DISMISS')}
    onConfirm={handleDeleteBooking}
    onCancel={dismissCancelBooking}/>}
  </>
  );
};

export default UpdateBooking;
