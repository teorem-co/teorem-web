import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useState } from 'react';
import * as Yup from 'yup';

import MyDatePicker from '../../../components/form/MyDatePicker';
import MyTimePicker from '../../../components/form/MyTimePicker';

interface Props {
    handleClose?: (close: boolean) => void;
    positionClass: string;
    event: Date | null;
}

interface IValues {
    date: Date;
    timeStart: string;
    timeEnd: string;
}

const UnavailabilityModal: React.FC<Props> = (props) => {
    const { handleClose, positionClass, event } = props;

    const [wholeDayChecked, setWholeDayChecked] = useState(false);

    const initialValues: IValues = {
        date: moment(event).toDate(),
        timeStart: moment(event, 'HH:mm').format('HH:mm').toString(),
        timeEnd: moment(event, 'HH:mm').add(1, 'hour').format('HH:mm').toString(),
    };

    const handleSubmit = (values: IValues) => {
        let toSend: IValues;
        if (wholeDayChecked) {
            toSend = {
                date: values.date,
                timeStart: '00:00',
                timeEnd: '23:59',
            };
        } else {
            toSend = {
                date: values.date,
                timeStart: values.timeStart,
                timeEnd: values.timeEnd,
            };
        }
        alert('date: ' + moment(toSend.date).format('DD-MM-yy') + ' | start: ' + toSend.timeStart + ' | end: ' + toSend.timeEnd);
    };

    const generateValidationSchema = () => {
        if (wholeDayChecked) {
            return Yup.object().shape({
                date: Yup.string().required('required'),
            });
        } else {
            return Yup.object().shape({
                date: Yup.string().required('required'),
                timeStart: Yup.string()
                    .required('required')
                    .test('timeStart', 'Start time can`t be after end time', (value) => {
                        const startTime = moment(value, 'HH:mm');
                        const endTime = moment(formik.values.timeEnd, 'HH:mm');
                        const condition = moment(endTime).isBefore(startTime);

                        if (condition) {
                            return false;
                        }
                        return true;
                    }),
                timeEnd: Yup.string().required('required'),
            });
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: generateValidationSchema(),
    });

    return (
        <>
            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {/* {event.Subject.name} */}
                                    Unavailability
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event).format('DD/MMM/YYYY, HH:mm')} - {moment(event).add(1, 'hour').format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose ? handleClose(false) : false;
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <FormikProvider value={formik}>
                            <Form id="unavailability-form">
                                <div className="row">
                                    <div className="col col-12">
                                        <div className="field">
                                            <label className="field__label" htmlFor="date">
                                                Date
                                            </label>
                                            <MyDatePicker form={formik} field={formik.getFieldProps('date')} meta={formik.getFieldMeta('date')} />
                                        </div>
                                    </div>
                                    <div className="flex--primary w--100 pl-3 pr-3">
                                        <div>Time</div>
                                        <div className="mb-1">
                                            <div className="input--custom-check" onClick={() => setWholeDayChecked(!wholeDayChecked)}>
                                                <div className={`input--custom-check__input ${wholeDayChecked ? 'active' : ''}`}></div>
                                                <div className="input--custom-check__label">Whole day</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-6">
                                        <div className="field">
                                            <MyTimePicker
                                                field={formik.getFieldProps('timeStart')}
                                                form={formik}
                                                meta={formik.getFieldMeta('timeStart')}
                                                defaultValue={moment(event, 'HH:mm')}
                                                isDisabled={wholeDayChecked}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-6">
                                        <div className="field">
                                            <MyTimePicker
                                                field={formik.getFieldProps('timeEnd')}
                                                form={formik}
                                                meta={formik.getFieldMeta('timeEnd')}
                                                defaultValue={moment(event, 'HH:mm').add(1, 'hour')}
                                                isDisabled={wholeDayChecked}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="modal--parent__footer mt-6">
                        <button form="unavailability-form" className="btn btn--base btn--primary w--100">
                            Set unavailability
                        </button>
                        <button
                            className="btn btn--base btn--clear"
                            onClick={() => {
                                handleClose ? handleClose(false) : false;
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default UnavailabilityModal;
