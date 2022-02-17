import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { initial, isEqual } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import {
    useGetLevelOptionsQuery,
    useGetTutorLevelsQuery,
} from '../../../../services/levelService';
import {
    useLazyGetSubjectOptionsByLevelQuery,
    useLazyGetTutorSubjectsByTutorLevelQuery,
} from '../../../../services/subjectService';
import { useGetChildQuery } from '../../../../services/userService';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import { useCreatebookingMutation } from '../services/bookingService';

interface IProps {
    start?: string;
    end?: string;
    handleClose?: (close: boolean) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    positionClass: string;
    clearEmptyBookings: () => void;
    booking: IBooking | null;
}

interface Values {
    level: string;
    subject: string;
    child: string;
    timeFrom: string;
}
const ParentCalendarSlots: React.FC<IProps> = (props) => {
    const { tutorId } = useParams();
    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const {
        start,
        end,
        handleClose,
        positionClass,
        setSidebarOpen,
        clearEmptyBookings,
        booking,
    } = props;
    const { data: levelOptions, isLoading: isLoadingLevels } =
        useGetTutorLevelsQuery(tutorId);

    const { data: childOptions, isLoading: isLoadingChildren } =
        useGetChildQuery();

    const [
        getSubjectOptionsByLevel,
        {
            data: subjectsData,
            isLoading: isLoadingSubjects,
            isSuccess: isSuccessSubjects,
        },
    ] = useLazyGetTutorSubjectsByTutorLevelQuery();

    const filteredSubjects = subjectsData?.find(
        (x) => x.value === props.booking?.subjectId
    );
    console.log(filteredSubjects?.value);

    const [createBooking, { isSuccess: createBookingSuccess }] =
        useCreatebookingMutation();

    const timeOptions = [
        {
            value: '0:00',
            label: '00:00',
        },
        {
            value: '1:00',
            label: '01:00',
        },
        {
            value: '2:00',
            label: '02:00',
        },
        {
            value: '3:00',
            label: '03:00',
        },
        {
            value: '4:00',
            label: '04:00',
        },
        {
            value: '5:00',
            label: '05:00',
        },
        {
            value: '6:00',
            label: '06:00',
        },
        {
            value: '7:00',
            label: '07:00',
        },
        {
            value: '8:00',
            label: '08:00',
        },
        {
            value: '9:00',
            label: '09:00',
        },
        {
            value: '10:00',
            label: '10:00',
        },
        {
            value: '11:00',
            label: '11:00',
        },
        {
            value: '12:00',
            label: '12:00',
        },
        {
            value: '13:00',
            label: '13:00',
        },
        {
            value: '14:00',
            label: '14:00',
        },
        {
            value: '15:00',
            label: '15:00',
        },
        {
            value: '16:00',
            label: '16:00',
        },
        {
            value: '17:00',
            label: '17:00',
        },
        {
            value: '18:00',
            label: '18:00',
        },
        {
            value: '19:00',
            label: '19:00',
        },
        {
            value: '20:00',
            label: '20:00',
        },
        {
            value: '21:00',
            label: '21:00',
        },
        {
            value: '22:00',
            label: '22:00',
        },
        {
            value: '23:00',
            label: '23:00',
        },
    ];

    // const x = 10; //minutes interval
    // const times = []; // time array
    // let tt = 0; // start time

    // //loop to increment the time and push results in array
    // for (let i = 0; tt < 24 * 60; i++) {
    //     const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    //     const mm = tt % 60; // getting minutes of the hour in 0-55 format
    //     times[i] = ('0' + (hh % 12)).slice(-2) + ':' + ('0' + mm).slice(-2);
    //     tt = tt + x;
    // }

    // console.log(times);

    const [initialValues, setInitialValues] = useState<Values>({
        level: '',
        subject: '',
        child: '',
        timeFrom: start ? moment(start).format('HH:mm') : '',
    });

    console.log(props.booking);

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object(),
    });

    const handleSubmit = (values: any) => {
        props.setSidebarOpen(false);
        createBooking({
            startTime: moment(start).toISOString(),
            subjectId: values.subject,
            studentId: values.child,
            tutorId: tutorId,
        });
    };

    useEffect(() => {
        if (!isEqual(formik.values.level, initialValues.level)) {
            formik.setFieldValue('subject', '');
        }
        if (formik.values.level !== '') {
            getSubjectOptionsByLevel({
                tutorId: tutorId,
                levelId: formik.values.level,
            });
        }
    }, [formik.values.level]);

    // const escFunction = useCallback((event) => {
    //     if (event.keyCode === 27) {
    //         //Close modal on esc keydown
    //         handleClose ? handleClose(false) : null;
    //     }
    // }, []);

    // useEffect(() => {
    //     document.addEventListener('keydown', escFunction, false);

    //     return () => {
    //         document.removeEventListener('keydown', escFunction, false);
    //     };
    // }, []);

    useEffect(() => {
        if (subjectsData && isSuccessSubjects && formik.values.level !== '') {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData]);

    const handleChange = (e: any) => {
        setSelectedTime(e);
    };
    const handleSubmitForm = () => {
        formik.handleSubmit();

        props.setSidebarOpen(false);
    };

    useEffect(() => {
        if (createBookingSuccess) {
            toastService.success('Booking created');
            handleClose ? handleClose(false) : false;
        }
    }, [createBookingSuccess]);

    useEffect(() => {
        if (booking) {
            const values: Values = {
                level: booking.Level.id,
                subject: booking.subjectId,
                child: booking.User.id,
                timeFrom: moment(booking.startTime).format('H:mm'),
            };
            setInitialValues(values);
        }
    }, [booking]);
    const levelDisabled = !levelOptions || isLoadingLevels;

    return (
        <div className={`modal--parent modal--parent--${positionClass}`}>
            <div className="modal--parent__header">
                <div className="flex flex--primary">
                    <div>
                        <div className="type--wgt--bold type--md mb-1">
                            Book a Slot
                        </div>
                        <div className="type--color--secondary">
                            {start} - {end}
                        </div>
                    </div>
                    <i
                        className="icon icon--base icon--grey icon--close mb-6"
                        onClick={() => {
                            handleClose ? handleClose(false) : false;
                            props.clearEmptyBookings();
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
                                Level*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('level')}
                                form={formik}
                                meta={formik.getFieldMeta('level')}
                                classNamePrefix="onboarding-select"
                                isMulti={false}
                                options={levelOptions ? levelOptions : []}
                                isDisabled={booking?.id ? true : false}
                                placeholder="Select Level"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="subject" className="field__label">
                                Subject*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('subject')}
                                form={formik}
                                meta={formik.getFieldMeta('subject')}
                                isMulti={false}
                                options={subjectsData}
                                classNamePrefix="onboarding-select"
                                isDisabled={booking?.id ? true : false}
                                noOptionsMessage={() =>
                                    t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')
                                }
                                placeholder={t(
                                    'SEARCH_TUTORS.PLACEHOLDER.SUBJECT'
                                )}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="child" className="field__label">
                                Child*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('child')}
                                form={formik}
                                meta={formik.getFieldMeta('child')}
                                classNamePrefix="onboarding-select"
                                isMulti={false}
                                options={childOptions ? childOptions : []}
                                isDisabled={booking?.id ? true : false}
                                placeholder="Select Child"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="timeFrom" className="field__label">
                                Time* (Session length is 50min)
                            </label>
                            <div className="flex">
                                <div className="field w--100 mr-6">
                                    <MySelect
                                        onChangeCustom={(e) =>
                                            handleChange(
                                                moment(e, 'HH:mm').format(
                                                    'HH:mm'
                                                )
                                            )
                                        }
                                        field={formik.getFieldProps('timeFrom')}
                                        form={formik}
                                        meta={formik.getFieldMeta('timeFrom')}
                                        classNamePrefix="onboarding-select"
                                        isMulti={false}
                                        options={timeOptions ? timeOptions : []}
                                        // isDisabled={levelDisabled}
                                        placeholder="Select time"
                                    />
                                </div>
                                <div className="field w--100">
                                    <TextField
                                        // isDisabled={levelDisabled}
                                        placeholder="Time"
                                        name="time"
                                        id="time"
                                        disabled={true}
                                        value={
                                            selectedTime
                                                ? moment(selectedTime, 'HH:mm')
                                                      .add(1, 'hours')
                                                      .format('HH:mm')
                                                : booking
                                                ? moment(booking.startTime)
                                                      .add(1, 'hours')
                                                      .format('HH:mm')
                                                : 'Time'
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
            <div className="modal--parent__footer">
                <button
                    className="btn btn--base btn--primary mb-1"
                    onClick={() => handleSubmitForm()}
                >
                    Book
                </button>
                <button
                    className="btn btn--base btn--clear"
                    onClick={() => {
                        handleClose ? handleClose(false) : false;
                        props.clearEmptyBookings();
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ParentCalendarSlots;
