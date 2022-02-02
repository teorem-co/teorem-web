import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useGetLevelOptionsQuery } from '../../../../services/levelService';
import { useLazyGetSubjectOptionsByLevelQuery } from '../../../../services/subjectService';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';

interface IProps {
    start?: string;
    end?: string;
    handleClose?: (close: boolean) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    positionClass: string;
}

const ParentCalendarSlots: React.FC<IProps> = (props) => {
    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const { start, end, handleClose, positionClass } = props;
    const { data: levelOptions, isLoading: isLoadingLevels } =
        useGetLevelOptionsQuery();

    const [
        getSubjectOptionsByLevel,
        {
            data: subjectsData,
            isLoading: isLoadingSubjects,
            isSuccess: isSuccessSubjects,
        },
    ] = useLazyGetSubjectOptionsByLevelQuery();

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

    const initialValues = {
        level: '',
        subject: '',
        child: '',
        time: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object(),
    });

    const handleSubmit = (values: any) => {
        props.setSidebarOpen(true);
    };

    useEffect(() => {
        formik.setFieldValue('subject', '');
        if (formik.values.level !== '') {
            getSubjectOptionsByLevel(formik.values.level);
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
        props.setSidebarOpen(true);
    };

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
                                // isDisabled={levelDisabled}
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
                                options={subjectOptions}
                                classNamePrefix="onboarding-select"
                                isDisabled={levelDisabled || isLoadingSubjects}
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
                                options={levelOptions ? levelOptions : []}
                                // isDisabled={levelDisabled}
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
                                        id="name"
                                        disabled={true}
                                        value={
                                            selectedTime === ''
                                                ? 'Time'
                                                : moment(selectedTime, 'HH:mm')
                                                      .add(1, 'hours')
                                                      .format('HH:mm')
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
                    onClick={() => (handleClose ? handleClose(false) : false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ParentCalendarSlots;
