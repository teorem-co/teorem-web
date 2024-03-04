import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment';
import { useState } from 'react';
import * as Yup from 'yup';

import MyDatePicker from '../../../components/form/MyDatePicker';
import MyTimePicker from '../../../components/form/MyTimePicker';
import toastService from '../../../services/toastService';
import { IPostUnavailability, useCreateTutorUnavailabilityMutation } from '../services/unavailabilityService';

interface Props {
    handleClose?: (close: boolean) => void;
    positionClass: string;
    event: Date | null;
    topOffset: number;
}

interface IValues {
    date: Date;
    timeStart: string;
    timeEnd: string;
}

const UnavailabilityModal: React.FC<Props> = (props) => {
    const { topOffset, handleClose, positionClass, event } = props;

    const [createTutorUnavailability] = useCreateTutorUnavailabilityMutation();

    const [wholeDayChecked, setWholeDayChecked] = useState(false);

    const initialValues: IValues = {
        date: moment(event).toDate(),
        timeStart: moment(event, 'HH:mm').format('HH:mm').toString(),
        timeEnd: moment(event, 'HH:mm').add(1, 'hour').format('HH:mm').toString(),
    };

    const handleSubmit = async (values: IValues) => {
        let toSend: IPostUnavailability;
        if (wholeDayChecked) {
            toSend = {
                startTime: moment(values.date)
                    .set({
                        hour: 0,
                        minute: 0,
                        second: 0,
                    })
                    .toDate(),
                endTime: moment(values.date)
                    .set({
                        hour: 23,
                        minute: 59,
                        second: 59,
                    })
                    .toDate(),
            };
        } else {
            toSend = {
                startTime: moment(values.date)
                    .set({
                        hour: Number(moment(values.timeStart, 'HH:mm').format('HH')),
                        minute: Number(moment(values.timeStart, 'HH:mm').format('mm')),
                    })
                    .toDate(),
                endTime: moment(values.date)
                    .set({
                        hour: Number(moment(values.timeEnd, 'HH:mm').format('HH')),
                        minute: Number(moment(values.timeEnd, 'HH:mm').format('mm')),
                    })
                    .toDate(),
            };
        }
        const condition = moment(toSend.startTime).isAfter(moment().add(3, 'hour'));
        if (condition) {
            await createTutorUnavailability(toSend).unwrap();
            handleClose && handleClose(false);
        } else {
            toastService.error(t('MY_BOOKINGS.UNABLE_MESSAGE'));
        }
    };

    const generateValidationSchema = () => {
        if (wholeDayChecked) {
            return Yup.object().shape({
                date: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            });
        } else {
            return Yup.object().shape({
                date: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
                timeStart: Yup.string()
                    .required(t('FORM_VALIDATION.REQUIRED'))
                    .test('timeStart', t('MY_BOOKINGS.TIME_AFTER'), (value) => {
                        const startTime = moment(value, 'HH:mm');
                        const endTime = moment(formik.values.timeEnd, 'HH:mm');
                        const condition = moment(endTime).isBefore(startTime);

                        if (condition) {
                            return false;
                        }
                        return true;
                    })
                    .test('timeStart', t('MY_BOOKINGS.TIME_SAME'), (value) => {
                        const startTime = moment(value, 'HH:mm');
                        const startTimeFormated = moment(startTime).format('HH:mm');
                        const endTime = moment(formik.values.timeEnd, 'HH:mm');
                        const endTimeFormated = moment(endTime).format('HH:mm');
                        const condition = startTimeFormated === endTimeFormated;

                        if (condition) {
                            return false;
                        }
                        return true;
                    }),
                timeEnd: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
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

    const isMobile = window.innerWidth < 776;
    const mobileStyles = isMobile ? { top: `${topOffset}px` } : {};

    return (
        <>
            {event ? (
                <div style={mobileStyles} className={`modal--parent  modal--parent--${isMobile ? '' : positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {/* {event.Subject.name} */}
                                    {t('MY_BOOKINGS.UNAVAILABILITY')}
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event).format(t('DATE_FORMAT') + ', HH:mm')} - {moment(event).add(1, 'hour').format('HH:mm')}
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
                                                {t('MY_BOOKINGS.MODAL.DATE')}
                                            </label>
                                            <MyDatePicker form={formik} field={formik.getFieldProps('date')} meta={formik.getFieldMeta('date')} />
                                        </div>
                                    </div>
                                    <div className="flex--primary w--100 pl-3 pr-3">
                                        <div>{t('MY_BOOKINGS.MODAL.TIME')}</div>
                                        <div className="mb-1">
                                            <div className="input--custom-check" onClick={() => setWholeDayChecked(!wholeDayChecked)}>
                                                <div className={`input--custom-check__input ${wholeDayChecked ? 'active' : ''}`}></div>
                                                <div className="input--custom-check__label">{t('MY_BOOKINGS.MODAL.WHOLE_DAY')}</div>
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
                                                onChangeCustom={(e) => {
                                                    formik.setFieldValue('timeStart', moment(e).format('HH:mm'));
                                                }}
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
                                                onChangeCustom={(e) => {
                                                    formik.setFieldValue('timeEnd', moment(e).format('HH:mm'));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="modal--parent__footer mt-6">
                        <button form="unavailability-form" className="btn btn--base btn--primary w--100">
                            {t('MY_BOOKINGS.MODAL.SET_UNAVAILABILITY')}
                        </button>
                        <button
                            className="btn btn--base btn--clear"
                            onClick={() => {
                                handleClose ? handleClose(false) : false;
                            }}
                        >
                            {t('MY_BOOKINGS.MODAL.CANCEL')}
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
