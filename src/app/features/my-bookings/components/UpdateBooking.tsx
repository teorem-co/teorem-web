import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useLazyGetChildQuery } from '../../../store/services/userService';
import { RoleOptions } from '../../../store/slices/roleSlice';
import Select from '@mui/material/Select';
import { useAppSelector } from '../../../store/hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import {
    IGetStudentAvailablePeriodsParams,
    IGetTutorAvailablePeriodsParams,
    useDeleteBookingMutation,
    useLazyGetStudentAvailablePeriodsQuery,
    useLazyGetTutorAvailablePeriodsQuery,
    useUpdateBookingMutation,
} from '../services/bookingService';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, InputLabel, MenuItem, OutlinedInput } from '@mui/material';
import { useLazyGetTutorUnavailableDaysQuery } from '../../../store/services/tutorService';
import { TeoremConstants } from '../../../constants/TeoremConstants';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

interface IProps {
    start?: string;
    end?: string;
    handleClose?: (close: boolean) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    positionClass: string;
    clearEmptyBookings: () => void;
    booking: IBooking | null;
    tutorId: string;
    topOffset?: number;
    fetchDataInParent?: () => void;
}

interface Values {
    level: string;
    subject: string;
    child: string;
    selectedTime: string;
    selectedDate: string;
}

const UpdateBooking: React.FC<IProps> = (props) => {
    const {
        topOffset,
        start,
        end,
        handleClose,
        positionClass,
        setSidebarOpen,
        clearEmptyBookings,
        booking,
        fetchDataInParent,
    } = props;

    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);

    const [deleteBooking] = useDeleteBookingMutation();
    const [getUnavailableDays, { data: unavailableDays, isLoading: unavailableDaysIsLoading }] =
        useLazyGetTutorUnavailableDaysQuery();
    const [getTutorAvailablePeriods, { data: tutorAvailablePeriods }] = useLazyGetTutorAvailablePeriodsQuery();
    const [getStudentAvailablePeriods, { data: studentAvailablePeriods }] = useLazyGetStudentAvailablePeriodsQuery();
    const [getChildOptions] = useLazyGetChildQuery();
    const [updateBooking, { isSuccess: updateBookingSuccess }] = useUpdateBookingMutation();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const isMobile = window.innerWidth < 776;
    const mobileStyles = isMobile ? { top: `${topOffset}px` } : {};

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleDeleteBooking = () => {
        if (booking) {
            deleteBooking(booking.id);
            handleClose ? handleClose(false) : false;
        }
    };

    const [initialValues, setInitialValues] = useState<Values>({
        level: '',
        subject: '',
        child: '',
        selectedTime: '',
        selectedDate: moment(booking?.startTime).format('YYYY-MM-DD'),
    });

    const handleSubmit = useCallback((values: Values) => {
        props.setSidebarOpen(false);

        const momentDate = moment(values.selectedDate)
            .set('hours', Number(values.selectedTime))
            .set('minutes', Number(values.selectedTime));
        const dateTime = `${values.selectedDate} ${values.selectedTime}`;
        const momentObj = moment(dateTime, 'YYYY-MM-DD HH:mm');

        // Convert to UTC and format
        const utcString = momentObj.utc().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';

        updateBooking({
            startTime: utcString,
            bookingId: booking ? booking.id : '',
        });
        // }
    }, []);

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object(),
    });

    useEffect(() => {
        if (userRole === RoleOptions.Parent && userId) getChildOptions(userId);
    }, []);

    useEffect(() => {
        if (updateBookingSuccess) {
            if (fetchDataInParent) {
                fetchDataInParent();
            }
            toastService.success('Rezervacija ažurirana');
            handleClose ? handleClose(false) : false;
        }
    }, [updateBookingSuccess]);

    useEffect(() => {
        if (booking) {
            const values: Values = {
                level: booking.Level.id,
                subject: booking.subjectId,
                child: booking.User.id,
                selectedTime: '',
                selectedDate: moment(booking.startTime).format('YYYY-MM-DD'),
            };
            // formik.setValues(values, false);
            setInitialValues(values);
        }
    }, [booking]);

    function dismissCancelBooking() {
        setShowConfirmModal(false);
    }

    async function fetchData() {
        if (booking?.tutorId) await getUnavailableDays(booking?.tutorId).unwrap().then();
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [availableDates, setAvailableDates] = useState<string[]>([]);

    useEffect(() => {
        if (booking) {
            if (userRole === RoleOptions.Tutor) {
                const params: IGetStudentAvailablePeriodsParams = {
                    studentId: booking?.studentId,
                    date: formik.values.selectedDate,
                    bookingId: booking.id,
                };

                getStudentAvailablePeriods(params)
                    .unwrap()
                    .then((res) => {
                        setAvailableDates(res);
                        formik.setFieldValue(formik.getFieldProps('selectedTime').name, moment(res[0]).format('HH:mm'));
                        //formik.values.selectedTime = (moment(res[0]).format('HH:mm'));
                    });
            } else {
                const params: IGetTutorAvailablePeriodsParams = {
                    tutorId: booking?.tutorId,
                    date: formik.values.selectedDate,
                    bookingId: booking.id,
                    timeZone: 'Europe/Zagreb', //moment.tz.guess(), //TODO: get from user using dropdown or  get using api
                };

                getTutorAvailablePeriods(params)
                    .unwrap()
                    .then((res) => {
                        setAvailableDates(res);
                        formik.setFieldValue(formik.getFieldProps('selectedTime').name, moment(res[0]).format('HH:mm'));
                    });
            }
        }
    }, [formik.values.selectedDate]);

    function disableUnavailableDays(day: Dayjs): boolean {
        if (!unavailableDays) return false;

        const dayString = day.format('dddd').toUpperCase();
        return unavailableDays.includes(dayString);
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={mobileStyles} className={`modal--parent  modal--parent--${isMobile ? '' : positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">{t('BOOK.RESCHEDULE_TITLE')}</div>
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
                            {userRole !== RoleOptions.Tutor && (
                                <div className="flex flex--center mb-4">
                                    <i className="icon icon--base icon--tutor icon--grey mr-4"></i>
                                    <div className="type--color--secondary">{booking?.User.firstName}</div>
                                </div>
                            )}

                            <div className="flex flex--center mb-4">
                                <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                                <div className="type--color--secondary w--100">
                                    {t(
                                        `SUBJECTS.${booking?.Subject.abrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`
                                    )}
                                    &nbsp;-&nbsp;
                                    {t(
                                        `LEVELS.${booking?.Level.name.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`
                                    )}
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
                                    <div className="flex flex--jc--space-between flex--row w--100 mr-6 mt-5">
                                        {
                                            <>
                                                <DatePicker
                                                    name={'selectedTime'}
                                                    // id={'selectedDate'}
                                                    className={'w--45'}
                                                    label={t('BOOK.FORM.DATE_OF_BOOKING')}
                                                    value={dayjs(formik.values.selectedDate, 'YYYY-MM-DD')}
                                                    format="DD/MM/YYYY"
                                                    shouldDisableDate={disableUnavailableDays}
                                                    disablePast
                                                    sx={{ backgroundColor: 'white' }}
                                                    onChange={(newValue) =>
                                                        formik.setFieldValue(
                                                            formik.getFieldProps('selectedDate').name,
                                                            newValue?.format('YYYY-MM-DD')
                                                        )
                                                    }
                                                />

                                                <FormControl className={'w--45'}>
                                                    <InputLabel id="selectedTime">
                                                        {t('BOOK.FORM.TIME_OF_BOOKING')}
                                                    </InputLabel>
                                                    <Select
                                                        label={'labela'}
                                                        id="selectedTime"
                                                        name="selectedTime"
                                                        value={formik.values.selectedTime}
                                                        onChange={(newValue) =>
                                                            formik.setFieldValue(
                                                                formik.getFieldProps('selectedTime').name,
                                                                newValue.target.value
                                                            )
                                                        }
                                                        input={<OutlinedInput label={t('BOOK.FORM.TIME_OF_BOOKING')} />}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {availableDates.map((availableDate) => (
                                                            <MenuItem
                                                                key={availableDate}
                                                                value={moment(availableDate).format('HH:mm')}
                                                            >
                                                                {moment(availableDate).format('HH:mm')}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </>
                                        }
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="modal--parent__footer">
                        <ButtonPrimaryGradient
                            // form="updateBookingForm"
                            type="submit"
                            className="btn btn--base type--wgt--extra-bold mb-1"
                            onClick={() => formik.handleSubmit()}
                            //moment(start, 'HH:mm').isSame(moment(formik.values.selectedTime, 'HH:mm')) maybe add to disable
                            disabled={booking?.inReschedule}
                        >
                            {!booking?.inReschedule ? t('BOOK.FORM.UPDATE') : t('BOOK.FORM.ALREADY_IN_RESCHEDULE')}
                        </ButtonPrimaryGradient>
                        <button
                            disabled={
                                userRole !== RoleOptions.Tutor &&
                                booking?.isAccepted &&
                                moment(booking?.startTime).isBefore(
                                    moment().add(TeoremConstants.MIN_HOURS_BEFORE_CANCEL, 'hour')
                                )
                            }
                            className="btn btn--base type--wgt--extra-bold btn--clear type--color--error"
                            onClick={() => {
                                props.clearEmptyBookings();
                                setShowConfirmModal(true);
                            }}
                        >
                            {!booking?.isAccepted && userRole === RoleOptions.Tutor
                                ? t('MY_BOOKINGS.MODAL.DENY')
                                : t('BOOK.FORM.CANCEL_BOOKING')}
                        </button>
                    </div>
                </div>
                {showConfirmModal && (
                    <ConfirmationModal
                        title={t('MY_BOOKINGS.MODAL.CONFIRM_CANCEL_TITLE')}
                        description={
                            userRole === RoleOptions.Tutor
                                ? t('MY_BOOKINGS.CANCEL.MODAL.TUTOR_DESCRIPTION')
                                : t('MY_BOOKINGS.CANCEL.MODAL.STUDENT_DESCRIPTION')
                        }
                        confirmButtonTitle={t('BOOK.FORM.CANCEL_BOOKING')}
                        cancelButtonTitle={t('BOOK.FORM.DISMISS')}
                        onConfirm={handleDeleteBooking}
                        onCancel={dismissCancelBooking}
                    />
                )}
            </LocalizationProvider>
        </>
    );
};

export default UpdateBooking;
