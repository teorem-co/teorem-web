import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import MyDatePicker from '../../../components/form/MyDatePicker';

interface Props {
    handleClose?: (close: boolean) => void;
    positionClass: string;
    event: Date | null;
}

const UnavailabilityModal: React.FC<Props> = (props) => {
    const { handleClose, positionClass, event } = props;

    const initialValues = {
        date: '',
        timeStart: '',
        timeEnd: '',
        wholeDay: false,
    };

    const handleSubmit = () => {
        console.log('submit');
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: () => handleSubmit(),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            date: Yup.string().required('required'),
        }),
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
                            <Form>
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
                                        <div>checkbox</div>
                                    </div>
                                    <div className="col col-6">timepicker</div>
                                    <div className="col col-6">timepicker</div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="modal--parent__footer mt-6">
                        <button className="btn btn--base btn--primary w--100">Set unavailability</button>
                        <button className="btn btn--base btn--clear">Cancel</button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default UnavailabilityModal;
