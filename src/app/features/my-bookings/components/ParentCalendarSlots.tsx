import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { isEqual } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useGetTutorLevelsQuery } from '../../../../services/levelService';
import { useLazyGetTutorSubjectsByTutorLevelQuery } from '../../../../services/subjectService';
import { useLazyGetChildQuery, useLazyGetUserQuery } from '../../../../services/userService';
import { RoleOptions } from '../../../../slices/roleSlice';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import MyTimePicker from '../../../components/form/MyTimePicker';
import TextField from '../../../components/form/TextField';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { useLazyGetCustomerByIdQuery } from '../../my-profile/services/stripeService';
import { useCreatebookingMutation } from '../services/bookingService';

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
    const { start, end, handleClose, positionClass } = props;
    const { tutorId } = useParams();

    const [getChildOptions, { data: childOptions }] = useLazyGetChildQuery();
    const [getUser] = useLazyGetCustomerByIdQuery();
    const [getSubjectOptionsByLevel, { data: subjectsData, isSuccess: isSuccessSubjects }] = useLazyGetTutorSubjectsByTutorLevelQuery();
    const [createBooking, { isSuccess: createBookingSuccess }] = useCreatebookingMutation();
    const [isCreateBookingLoading, setIsCreateBookingLoading] = useState<boolean>(false); // isLoading from Mutation is too slow;
    const { data: levelOptions } = useGetTutorLevelsQuery(tutorId);

    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
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

    const generateValidationSchema = () => {
        const validationSchema: any = {
            level: Yup.string().required('Level is required'),
            subject: Yup.string().required('Subject is required'),
        };

        if (userRole === RoleOptions.Parent) {
            validationSchema['child'] = Yup.string().required('Child is required');
            return validationSchema;
        }

        return validationSchema;
    };

    const handleSubmit = async (values: any) => {
        setIsCreateBookingLoading(true);

        //if user didn't added credit card before adding a booking, show the message and redirect button
        if (stripeCustomerId) {
            //if user has stripe account but don't have default payment method
            const res = await getUser(userId!).unwrap();
            const defaultSource = res.invoice_settings.default_payment_method;
            if (!defaultSource) {
                toastService.creditCard(t('ERROR_HANDLING.DEFAULT_CARD_MISSING'));
                return;
            }
        } else {
            toastService.creditCard(t('ERROR_HANDLING.CREDIT_CARD_MISSING'));
            return;
        }

        const splitString = values.timeFrom.split(':');
        props.setSidebarOpen(false);
        if (userRole === RoleOptions.Parent) {
            await createBooking({
                startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
                subjectId: values.subject,
                studentId: values.child,
                tutorId: tutorId,
            });
            props.clearEmptyBookings();
        } else {
            await createBooking({
                startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
                subjectId: values.subject,
                tutorId: tutorId,
            });
            props.clearEmptyBookings();
        }
        
        setIsCreateBookingLoading(false);
    };

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

    useEffect(() => {
        if (subjectsData && isSuccessSubjects && formik.values.level !== '') {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData]);

    useEffect(() => {
        if (formik.values.subject) {
            formik.setFieldValue('subject', '');
        }
        if (formik.values.level !== '') {
            getSubjectOptionsByLevel({
                tutorId: tutorId,
                levelId: formik.values.level,
            });
        }
    }, [formik.values.level]);

    useEffect(() => {
        if (userRole === RoleOptions.Parent) {
            getChildOptions();
        }
    }, []);

    useEffect(() => {
        formik.setFieldValue('timeFrom', moment(start).format('HH:mm'));
    }, [start]);

    useEffect(() => {
        if (createBookingSuccess) {
            toastService.success('Booking created');
            handleClose ? handleClose(false) : false;
        }
    }, [createBookingSuccess]);

    return (
        <div className={`modal--parent modal--parent--${positionClass}`}>
            <div className="modal--parent__header">
                <div className="flex flex--primary">
                    <div>
                        <div className="type--wgt--bold type--md mb-1">{t('BOOK.TITLE')}</div>
                        <div className="type--color--secondary">
                            { moment(start).format('DD/MM/YYYY, HH:mm')} - {end}
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
                                {t('BOOK.FORM.LEVEL')}*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('level')}
                                form={formik}
                                meta={formik.getFieldMeta('level')}
                                classNamePrefix="onboarding-select"
                                isMulti={false}
                                options={levelOptions ? levelOptions : []}
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
                                options={subjectsData}
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
                    <button 
                    className="btn btn--base btn--primary type--wgt--extra-bold mb-1" onClick={() => handleSubmitForm()}
                    >
                        {t('BOOK.FORM.SUBMIT')}
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
                </div> ) : (
                    <div className="flex flex--jc--center flex--primary--center mb-6">
                            <LoaderPrimary small />
                    </div>
                )}
        </div>
    );
};

export default ParentCalendarSlots;
