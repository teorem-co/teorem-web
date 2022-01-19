import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import * as Yup from 'yup';

import gradientCircle from '../../../../assets/images/gradient-circle.svg';
import { setStepOne, setStepTwo } from '../../../../slices/parentRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MySelect from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { childListOptions } from '../../../constants/childListOptions';
import { roleSelectionOptions } from '../../../constants/roleSelectionOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';

interface StepOneValues {
    country: string;
    phoneNumber: string;
    prefix: string;
    dateOfBirth: string;
}

interface DetailsValues {
    childFirstName: string;
    childLastName: string;
    childDateOfBirth: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

const ParentOnboarding: React.FC<IProps> = ({
    handleGoBack,
    handleNextStep,
    step,
}) => {
    const [date, setDate] = useState<Date>();
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.parentRegister);
    const { childFirstName, childLastName, childDateOfBirth } = state;
    const { t } = useTranslation();

    const handleDateChange = (e: Date) => {
        setDate(e);
    };

    const options = [
        {
            value: 1,
            text: 'Poland',
            icon: <i className="icon icon--pl"></i>,
        },
        {
            value: 2,
            text: 'Afghanistan',
            icon: <i className="icon icon--af"></i>,
        },
        {
            value: 3,
            text: 'Canada',
            icon: <i className="icon icon--ca"></i>,
        },
    ];

    const phoneOptions = [
        {
            value: 1,
            number: '+98',
            country: 'Afghanistan',
            icon: <i className="icon icon--af"></i>,
        },
        {
            value: 2,
            number: '+355',
            country: 'Albania',
            icon: <i className="icon icon--al"></i>,
        },
        {
            value: 3,
            number: '+54',
            country: 'Argentina',
            icon: <i className="icon icon--ar"></i>,
        },
        {
            value: 4,
            number: '+61',
            country: 'Australia',
            icon: <i className="icon icon--au"></i>,
        },
        {
            value: 4,
            number: '+55',
            country: 'Brazil',
            icon: <i className="icon icon--br"></i>,
        },
        {
            value: 4,
            number: '+1',
            country: 'Canda',
            icon: <i className="icon icon--ca"></i>,
        },
    ];

    const initialValuesOne: StepOneValues = {
        country: '',
        phoneNumber: '',
        prefix: '',
        dateOfBirth: '',
    };
    const initialValuesTwo: DetailsValues = {
        childFirstName: '',
        childLastName: '',
        childDateOfBirth: '',
    };

    const handleSubmit = (values: any) => {
        console.log(values);
    };

    const formikStepOne = useFormik({
        initialValues: initialValuesOne,
        onSubmit: (values) => submitStepOne(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            country: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string()
                .email(t('FORM_VALIDATION.INVALID_EMAIL'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            profileImage: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                )
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const formikStepTwo = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            country: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            profileImage: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const formikStepThree = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => submitDetails(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            childFirstName: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
            childLastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            childDateOfBirth: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
        }),
    });

    const submitStepOne = (values: StepOneValues) => {
        dispatch(
            setStepOne({
                country: values.country,
                phoneNumber: values.phoneNumber,
                prefix: values.prefix,
                dateOfBirth: values.dateOfBirth,
            })
        );
    };

    const submitDetails = (values: DetailsValues) => {
        dispatch(
            setStepTwo({
                childFirstName: values.childFirstName,
                childLastName: values.childLastName,
                childDateOfBirth: values.childDateOfBirth,
            })
        );
        childListOptions.push({
            name: `${values.childFirstName} ${values.childLastName}`,
            description: 'Select to see details',
        });
        setDetailsOpen(false);
    };

    const countryInput = (props: any) => {
        if (props.data.icon) {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span className="input-select__icon mr-2">
                            {props.data.icon}
                        </span>
                        <span>{props.data.text}</span>
                    </div>
                </components.SingleValue>
            );
        } else {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span>{props.data.text}</span>
                    </div>
                </components.SingleValue>
            );
        }
    };

    const phoneNumberInput = (props: any) => {
        if (props.data.icon) {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span className="input-select__icon mr-2">
                            {props.data.icon}
                        </span>
                        <span>{props.data.number}</span>
                    </div>
                </components.SingleValue>
            );
        } else {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span>{props.data.number}</span>
                    </div>
                </components.SingleValue>
            );
        }
    };

    const countryOption = (props: any) => {
        const { innerProps } = props;
        return (
            <components.Option {...innerProps} {...props}>
                {' '}
                <div className="input-select">
                    <div className="input-select__option">
                        <span className="mr-2">{props.data.icon}</span>
                        <span>{props.data.text}</span>
                    </div>
                </div>
            </components.Option>
        );
    };

    const phoneNumberOption = (props: any) => {
        const { innerProps } = props;
        return (
            <components.Option {...innerProps} {...props}>
                {' '}
                <div className="input-select">
                    <div className="input-select__option flex flex--center">
                        {/* <span className="input-select__icon"> */}
                        <span className="mr-2">{props.data.icon}</span>
                        {/* </span> */}
                        <span className="mr-6" style={{ width: '40px' }}>
                            {props.data.number}
                        </span>
                        <span>{props.data.country}</span>
                    </div>
                </div>
            </components.Option>
        );
    };

    const stepOne = () => {
        return (
            <FormikProvider value={formikStepOne}>
                <Form>
                    <div className="field">
                        <label htmlFor="country" className="field__label">
                            Country*
                        </label>
                        <MySelect
                            form={formikStepOne}
                            field={formikStepOne.getFieldProps('country')}
                            meta={formikStepOne.getFieldMeta('country')}
                            isMulti={false}
                            classNamePrefix="onboarding-select"
                            options={options}
                            placeholder="Choose your country"
                            customInputField={countryInput}
                            customOption={countryOption}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                            Phone Number*
                        </label>
                        <MySelect
                            form={formikStepOne}
                            field={formikStepOne.getFieldProps('phoneNumber')}
                            meta={formikStepOne.getFieldMeta('phoneNumber')}
                            isMulti={false}
                            classNamePrefix="onboarding-select"
                            options={phoneOptions}
                            placeholder="Enter your phone number"
                            customInputField={phoneNumberInput}
                            customOption={phoneNumberOption}
                        />
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                            Date of Birth*
                        </label>
                        <DatePicker
                            onChange={(e: Date) => handleDateChange(e)}
                            value={date}
                            dayPlaceholder="DD"
                            monthPlaceholder="MM"
                            yearPlaceholder="YYYY"
                            calendarClassName={'onboarding-calendar'}
                            clearIcon={null}
                            disableCalendar
                        />
                    </div>
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                        onClick={() => handleNextStep()}
                    >
                        Next
                    </button>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        Back to register
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    const openChildDetails = () => {
        setDetailsOpen(true);
    };

    const stepTwo = () => {
        return (
            <FormikProvider value={formikStepTwo}>
                <Form>
                    <div className="role-selection__form w--100">
                        {childListOptions.map((x) => {
                            return (
                                <div
                                    className="role-selection__item"
                                    onClick={() => openChildDetails()}
                                >
                                    <img
                                        src={gradientCircle}
                                        alt="gradient circle"
                                    />
                                    <div className="flex--grow ml-4">
                                        <div className="mb-1">{x.name}</div>
                                        <div className="type--color--secondary">
                                            {x.description}
                                        </div>
                                    </div>
                                    <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                        onClick={() => handleNextStep()}
                    >
                        Finish
                    </button>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        Back to step 1
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    const childDetails = () => {
        return (
            <FormikProvider value={formikStepThree}>
                <Form>
                    <div className="field">
                        <label
                            htmlFor="childFirstName"
                            className="field__label"
                        >
                            Child's Name*
                        </label>
                        <TextField
                            name="childFirstName"
                            id="childFirstName"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="childLastName" className="field__label">
                            Child's Last Name*
                        </label>
                        <TextField
                            name="childLastName"
                            id="childLastName"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="field">
                        <label
                            className="field__label"
                            htmlFor="childDateOfBirth"
                        >
                            Child's Date of Birth*
                        </label>
                        <MyDatePicker
                            form={formikStepThree}
                            field={formikStepThree.getFieldProps(
                                'childDateOfBirth'
                            )}
                            meta={formikStepThree.getFieldMeta(
                                'childDateOfBirth'
                            )}
                        />
                    </div>
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                    >
                        Save
                    </button>
                    <div
                        onClick={() => setDetailsOpen(false)}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        Back to list
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    return (
        <>
            {step === 1 ? (
                stepOne()
            ) : step === 2 && detailsOpen === false ? (
                stepTwo()
            ) : detailsOpen && step === 2 ? (
                childDetails()
            ) : (
                <></>
            )}
        </>
    );
};

export default ParentOnboarding;
