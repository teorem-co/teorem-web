import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { cloneDeep, initial, isEqual } from 'lodash';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useGetLevelOptionsQuery, useGetTutorLevelsQuery } from '../../../../services/levelService';
import { useLazyGetSubjectOptionsByLevelQuery, useLazyGetTutorSubjectsByTutorLevelQuery } from '../../../../services/subjectService';
import { useGetChildQuery, useLazyGetChildQuery } from '../../../../services/userService';
import { RoleOptions } from '../../../../slices/roleSlice';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import MyTimePicker from '../../../components/form/MyTimePicker';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import IBooking from '../interfaces/IBooking';
import { useCreatebookingMutation, useUpdateBookingMutation } from '../services/bookingService';

interface IProps {
    start?: string;
    end?: string;
    handleClose?: (close: boolean) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    positionClass: string;
    clearEmptyBookings: () => void;
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
    const { start, end, handleClose, positionClass, setSidebarOpen, clearEmptyBookings } = props;
    const { data: levelOptions, isLoading: isLoadingLevels } = useGetTutorLevelsQuery(tutorId);
    const initialValues: Values = {
        level: '',
        subject: '',
        child: '',
        timeFrom: moment(start).format('HH:mm'),
    };

    const [getChildOptions, { data: childOptions, isLoading: isLoadingChildren }] = useLazyGetChildQuery();

    const [getSubjectOptionsByLevel, { data: subjectsData, isLoading: isLoadingSubjects, isSuccess: isSuccessSubjects }] =
        useLazyGetTutorSubjectsByTutorLevelQuery();

    const [createBooking, { isSuccess: createBookingSuccess }] = useCreatebookingMutation();

    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);

    useEffect(() => {
        if (userRole === RoleOptions.Parent) {
            getChildOptions();
        }
    }, []);
    useEffect(() => {
        formik.setFieldValue('timeFrom', moment(start).format('HH:mm'));
    }, [start]);

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object(),
    });

    const handleSubmit = (values: any) => {
        const splitString = values.timeFrom.split(':');
        props.setSidebarOpen(false);
        if (userRole === RoleOptions.Parent) {
            createBooking({
                startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
                subjectId: values.subject,
                studentId: values.child,
                tutorId: tutorId,
            });
            props.clearEmptyBookings();
        } else {
            createBooking({
                startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
                subjectId: values.subject,
                tutorId: tutorId,
            });
            props.clearEmptyBookings();
        }
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

    // const levelDisabled = !levelOptions || isLoadingLevels;

    return (
        <div className={`modal--parent modal--parent--${positionClass}`}>
            <div className="modal--parent__header">
                <div className="flex flex--primary">
                    <div>
                        <div className="type--wgt--bold type--md mb-1">Book a Slot</div>
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
                                noOptionsMessage={() => t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')}
                                placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
                            />
                        </div>
                        {userRole === RoleOptions.Parent ? (
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
                                    placeholder="Select Child"
                                />
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className="field">
                            <label htmlFor="timeFrom" className="field__label">
                                Time* (Session length is 50min)
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
                                        placeholder="Time"
                                        name="time"
                                        id="time"
                                        disabled={true}
                                        value={
                                            formik.values.timeFrom
                                                ? moment(formik.values.timeFrom, 'HH:mm').add(1, 'hours').format('HH:mm')
                                                : start
                                                ? moment(start).add(1, 'hours').format('HH:mm')
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
                <button className="btn btn--base btn--primary mb-1" onClick={() => handleSubmitForm()}>
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
