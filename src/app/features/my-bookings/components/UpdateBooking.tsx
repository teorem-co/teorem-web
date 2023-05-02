import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { isEqual } from 'lodash';
import moment from 'moment';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useGetTutorLevelsQuery } from '../../../../services/levelService';
import { useLazyGetTutorSubjectsByTutorLevelQuery } from '../../../../services/subjectService';
import { useLazyGetChildQuery } from '../../../../services/userService';
import { RoleOptions } from '../../../../slices/roleSlice';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import MyTimePicker from '../../../components/form/MyTimePicker';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import { useUpdateBookingMutation } from '../services/bookingService';

interface IProps {
  start?: string;
  end?: string;
  handleClose?: (close: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  positionClass: string;
  clearEmptyBookings: () => void;
  booking: IBooking | null;
  tutorId: string;
}

interface Values {
  level: string;
  subject: string;
  child: string;
  timeFrom: string;
}
const UpdateBooking: React.FC<IProps> = (props) => {
  const { start, end, handleClose, positionClass, setSidebarOpen, clearEmptyBookings, booking } = props;
  const tutorId = props.tutorId;
  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);

  const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Values>({
    level: '',
    subject: '',
    child: '',
    timeFrom: moment(start).format('HH:mm'),
  });

  const [getChildOptions, { data: childOptions }] = useLazyGetChildQuery();
  const [getSubjectOptionsByLevel, { data: subjectsData, isSuccess: isSuccessSubjects }] = useLazyGetTutorSubjectsByTutorLevelQuery();
  const [updateBooking, { isSuccess: updateBookingSuccess }] = useUpdateBookingMutation();
  const { data: levelOptions } = useGetTutorLevelsQuery(tutorId);

  const handleSubmit = (values: any) => {
    props.setSidebarOpen(false);
    const splitString = values.timeFrom.split(':');

    if (!isEqual(values.timeFrom, initialValues.timeFrom)) {
      updateBooking({
        startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
        bookingId: booking ? booking.id : '',
      });
    }
  };

  const handleChange = (e: any) => {
    setSelectedTime(e);
    formik.setFieldValue('timeFrom', e);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object(),
  });

  useEffect(() => {
    if (userRole === RoleOptions.Parent) {
      getChildOptions();
    }
  }, []);

  useEffect(() => {
    if (formik.values.level !== '') {
      getSubjectOptionsByLevel({
        tutorId: tutorId,
        levelId: formik.values.level,
      });
    }
  }, [formik.values.level]);

  useEffect(() => {
    if (subjectsData && isSuccessSubjects && formik.values.level !== '') {
      setSubjectOptions(subjectsData);
    }
  }, [subjectsData]);

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

  return (
    <div className={`modal--parent modal--parent--${positionClass}`}>
      <div className="modal--parent__header">
        <div className="flex flex--primary">
          <div>
            <div className="type--wgt--bold type--md mb-1">{t('BOOK.TITLE')}</div>
            <div className="type--color--secondary">
              {start} - {end}
            </div>
          </div>
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

      <div className="modal--parent__line"></div>

      <div className="modal--parent__body">
        <FormikProvider value={formik}>
          <Form id="updateBookingForm">
            <div className="field">
              <label htmlFor="level" className="field__label">
                {t('BOOK.FORM.LEVEL')}*
              </label>

              <MySelect
                field={formik.getFieldProps('level')}
                form={formik}
                meta={formik.getFieldMeta('level')}
                classNamePrefix="onboarding-select"
                isMulti={false}
                options={levelOptions ? levelOptions : []}
                isDisabled={booking?.id ? true : false}
                placeholder={t('BOOK.FORM.LEVEL_PLACEHOLDER')}
              />
            </div>
            <div className="field">
              <label htmlFor="subject" className="field__label">
                {t('BOOK.FORM.SUBJECT')}*
              </label>

              <MySelect
                field={formik.getFieldProps('subject')}
                form={formik}
                meta={formik.getFieldMeta('subject')}
                isMulti={false}
                options={subjectsData}
                classNamePrefix="onboarding-select"
                isDisabled={booking?.id ? true : false}
                noOptionsMessage={() => t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')}
                placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
              />
            </div>
            {userRole === RoleOptions.Parent ? (
              <div className="field">
                <label htmlFor="child" className="field__label">
                  {t('BOOK.FORM.CHILD')}*
                </label>

                <MySelect
                  field={formik.getFieldProps('child')}
                  form={formik}
                  meta={formik.getFieldMeta('child')}
                  classNamePrefix="onboarding-select"
                  isMulti={false}
                  options={childOptions ? childOptions : []}
                  placeholder={t('BOOK.FORM.CHILD_PLACEHOLDER')}
                  isDisabled={true}
                />
              </div>
            ) : (
              <></>
            )}
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
                  <TextField
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
        <button form="updateBookingForm" className="btn btn--base type--wgt--extra-bold btn--primary mb-1">
          {t('BOOK.FORM.UPDATE')}
        </button>
        <button
          className="btn btn--base type--wgt--extra-bold btn--clear"
          onClick={() => {
            handleClose ? handleClose(false) : false;
            props.clearEmptyBookings();
          }}
        >
          {t('BOOK.FORM.CANCEL')}
        </button>
      </div>
    </div>
  );
};

export default UpdateBooking;
