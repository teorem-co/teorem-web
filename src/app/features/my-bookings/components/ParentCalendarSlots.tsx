import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';


import {
   useGetTutorSubjectLevelPairsQuery,
} from '../../../../services/subjectService';
import { useLazyGetChildQuery } from '../../../../services/userService';
import { RoleOptions } from '../../../../slices/roleSlice';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import MyTimePicker from '../../../components/form/MyTimePicker';
import TextField from '../../../components/form/TextField';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import {
  useLazyGetCustomerByIdQuery,
} from '../../my-profile/services/stripeService';
import {
  ICreateBookingDTO,
  useCreatebookingMutation,
  useCreateBookingMutation,
} from '../services/bookingService';
import { loadStripe } from '@stripe/stripe-js';
import { Tooltip } from 'react-tooltip';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

interface IProps {
  start?: string;
  end?: string;
  handleClose?: (close: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  positionClass: string;
  clearEmptyBookings: () => void;
  tutorId: string;
  tutorDisabled: boolean | undefined;
}

interface Values {
  level: string;
  subject: string;
  child: string;
  timeFrom: string;
}

const ParentCalendarSlots: React.FC<IProps> = (props) => {
  const { start, end, handleClose, positionClass, setSidebarOpen, tutorDisabled } = props;

  const tutorId = props.tutorId;

  const { data: subjectLevelPairs, isSuccess: isSuccessSubjectsLevelPairs } = useGetTutorSubjectLevelPairsQuery(tutorId);
  const [tutorLevelOptions, setTutorLevelOptions] = useState<OptionType[]>();
  const [tutorSubjectOptions, setTutorSubjectOptions] = useState<OptionType[]>();

  const [getChildOptions, { data: childOptions }] = useLazyGetChildQuery();
  const [getUser] = useLazyGetCustomerByIdQuery();
  const [createBooking, { isSuccess: createBookingSuccess }] = useCreatebookingMutation();
  const [createBookingMutation, { isSuccess: isCreateBookingSuccess }] = useCreateBookingMutation();
  const [isCreateBookingLoading, setIsCreateBookingLoading] = useState<boolean>(false); // isLoading from Mutation is too slow;

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Values>({
    level: '',
    subject: '',
    child: '',
    timeFrom: moment(start).format('HH:mm'),
  });

  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const stripeCustomerId = useAppSelector((state) => state.auth.user?.stripeCustomerId);

  const [stripe, setStripe] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);


  stripePromise.then((res) => setStripe(res));

  const generateValidationSchema = () => {
    const validationSchema: any = {
      level: Yup.string().required(t('FORM_VALIDATION.LEVEL_REQUIRED')),
      subject: Yup.string().required(t('FORM_VALIDATION.SUBJECT_REQUIRED')),
    };

    if (userRole === RoleOptions.Parent) {
      validationSchema['child'] = Yup.string().required(t('FORM_VALIDATION.CHILD_REQUIRED'));
      return validationSchema;
    }

    return validationSchema;
  };

  // let isCreateBookingSuccess = false;

  const handleSubmit = async (values: any) => {
    setIsCreateBookingLoading(true);
    //if user didn't added credit card before adding a booking, show the message and redirect button
    if (stripeCustomerId) {
      //if user has stripe account but don't have default payment method
      const res = await getUser(userId!).unwrap();
      const defaultSource = res.invoice_settings.default_payment_method;
      if (!defaultSource) {
        setSidebarOpen(true);
        setIsCreateBookingLoading(false);
        //toastService.creditCard(t('ERROR_HANDLING.DEFAULT_CARD_MISSING'));
        return;
      }
    } else {
      setSidebarOpen(true);
      setIsCreateBookingLoading(false);
      //toastService.creditCard(t('ERROR_HANDLING.CREDIT_CARD_MISSING'));
      return;
    }

    const splitString = values.timeFrom.split(':');
    props.setSidebarOpen(false);

    function handleResponseSuccess(success: any) {
      if (success) {
        toastService.success(t('BOOKING.SUCCESS'));
      } else {
        toastService.error(t('BOOKING.FAILURE'));
      }
    }

    const request: ICreateBookingDTO = userRole === RoleOptions.Parent ? {
      requesterId: userId,
      startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
      subjectId: values.subject,
      studentId: values.child,
      tutorId: tutorId,
      levelId: values.level
    } : {
      requesterId: userId,
      studentId: userId,
      startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
      subjectId: values.subject,
      tutorId: tutorId,
      levelId: values.level
    };


    const response: any = await createBooking(request);
    if (response.data.success) {
      handleResponseSuccess(true);
    } else if (response.data.actionNeeded) {
      const res = await stripe.confirmCardPayment(response.data.clientSecret);
      if (res.error != null) {
        const confirmationRes: any = await createBookingMutation({
          paymentIntentId: res.error.payment_intent.id,
          confirmationJobId: response.data.confirmationJobId,
        });
        handleResponseSuccess(confirmationRes.data.success);
      } else {
        const confirmationRes: any = await createBookingMutation({
          paymentIntentId: res.paymentIntent.id,
          confirmationJobId: response.data.confirmationJobId,
        });
        handleResponseSuccess(confirmationRes.data.success);
      }
    } else {
      handleResponseSuccess(false);
    }

    setIsCreateBookingLoading(false);
  };

  useEffect(() => {
    if (isCreateBookingSuccess) {
      // toastService.success(t('BOOKING.SUCCESS'));
      props.clearEmptyBookings();
      handleClose ? handleClose(false) : false;
    }
  }, [isCreateBookingSuccess]);

  useEffect(() => {
    if (createBookingSuccess) {
      // toastService.success(t('BOOKING.SUCCESS'));
      props.clearEmptyBookings();
      handleClose ? handleClose(false) : false;
    }
  }, [createBookingSuccess]);

  const handleChange = (e: any) => {
    setSelectedTime(e);
    formik.setFieldValue('timeFrom', e);
  };

  const handleSubmitForm = () => {
    formik.handleSubmit();

    props.setSidebarOpen(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape(generateValidationSchema()),
  });

  function filterSubjectsByLevelId(levelId: string) {
    if (subjectLevelPairs) {
      const subjectOptions: OptionType[] = subjectLevelPairs
        .filter(item => item.level.value === levelId)
        .map(item => item.subject);

      setTutorSubjectOptions(subjectOptions);
    }
  }

  // set level options
  useEffect(() => {
    if (subjectLevelPairs && isSuccessSubjectsLevelPairs) {
      const seen = new Set<string>();
      const levelOptions: OptionType[] = [];

      subjectLevelPairs.forEach(pair => {
        if (!seen.has(pair.level.value)) {
          seen.add(pair.level.value);
          levelOptions.push(pair.level);
        }
      });

      setTutorLevelOptions(levelOptions);
    }
  }, [subjectLevelPairs]);

  useEffect(() => {
    if (formik.values.subject) {
      formik.setFieldValue('subject', '');
    }
    if (formik.values.level !== '') {
      filterSubjectsByLevelId(formik.values.level);
    }
  }, [formik.values.level]);

  useEffect(() => {
    if (userRole === RoleOptions.Parent && userId) {
      getChildOptions(userId);
    }
  }, []);

  useEffect(() => {
    formik.setFieldValue('timeFrom', moment(start).format('HH:mm'));
  }, [start]);

  return (
    <div className={`modal--parent modal--parent--${positionClass}`}>
      <div className="modal--parent__header">
        <div className="flex flex--primary">
          <div>
            <div className="type--wgt--bold type--md mb-1">{t('BOOK.TITLE')}</div>
            <div className="type--color--secondary">
              {moment(start).format(t('DATE_FORMAT') + ', HH:mm')} - {end}
            </div>
          </div>
          {/*<i className="icon icon--base icon--grey icon--info mb-6"></i>*/}
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
          <Form>
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
                options={tutorLevelOptions ? tutorLevelOptions : []}
                placeholder={t('BOOK.FORM.LEVEL_PLACEHOLDER')}
              />
            </div>
            <div className="field">
              <label htmlFor="subject" className="field__label">
                {t('BOOK.FORM.SUBJECT')}*
              </label>
              <MySelect
                key={formik.values.subject}
                field={formik.getFieldProps('subject')}
                form={formik}
                meta={formik.getFieldMeta('subject')}
                isMulti={false}
                options={tutorSubjectOptions}
                classNamePrefix="onboarding-select"
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
                  noOptionsMessage={() => "childless"}
                  placeholder={t('BOOK.FORM.CHILD_PLACEHOLDER')}
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
                    key={formik.values.timeFrom}
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
      {!isCreateBookingLoading ? (
        <div className="modal--parent__footer">

          {tutorDisabled && <Tooltip
            id="bookAndPayButton"
            place={'top-end'}
            positionStrategy={'absolute'}
            float={true}
            delayShow={1000}
            style={{ backgroundColor: "rgba(70,70,70, 0.9)", color: 'white', fontSize:'smaller' }}
          />}

          <button
            data-tooltip-id='bookAndPayButton'
            data-tooltip-html={`${t('BOOK.FORM.TUTOR_DISABLED')}`}
            disabled={tutorDisabled}
            className="btn btn--base btn--primary type--wgt--extra-bold mb-1"
            onClick={() => handleSubmitForm()}>
            {tutorDisabled? t('BOOK.FORM.TUTOR_DISABLED') : t('BOOK.FORM.SUBMIT') }
          </button>
          <button
            className="btn btn--base type--wtg--extra-bold btn--clear"
            onClick={() => {
              handleClose ? handleClose(false) : false;
              props.clearEmptyBookings();
            }}
          >
            {t('BOOK.FORM.CANCEL')}
          </button>
        </div>
      ) : (
        <div className="flex flex--jc--center flex--primary--center mb-6">
          <LoaderPrimary small />
        </div>
      )}
    </div>
  );
};

export default ParentCalendarSlots;
