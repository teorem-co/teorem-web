import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import * as Yup from 'yup';

import MySelect from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';

interface Values {
    country: string;
    phoneNumber: string;
    dateOfBirth: string;
    profileImage: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

const TutorOnboarding: React.FC<IProps> = ({
    handleGoBack,
    handleNextStep,
    step,
}) => {
    const [date, setDate] = useState<Date>();
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

    const initialValues: Values = {
        country: '',
        phoneNumber: '',
        dateOfBirth: '',
        profileImage: '',
    };

    const formikStepOne = useFormik({
        initialValues: initialValues,
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

    const formikStepTwo = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string()
                // .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            lastName: Yup.string()
                // .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            cardNumber: Yup.string()
                .min(16, t('FORM_VALIDATION.TOO_SHORT'))
                .max(16, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cvv: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: any) => {
        handleNextStep();
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
                    <div className="field field__file">
                        <label className="field__label" htmlFor="profileImage">
                            Profile Image*
                        </label>

                        <div className="field__file__wrap">
                            <input type="file" className="input__file" />
                            <i className="icon icon--upload icon--base icon--grey"></i>
                            <div className="type--color--tertiary type--wgt--regular">
                                Drag and drop to upload
                            </div>
                        </div>
                    </div>
                    {/* <UploadFile
                        setFieldValue={formikStepOne.setFieldValue}
                        uploadedFile={(file: any) => {
                            formikStepOne.setFieldValue('imageFood', file);
                            dispatch(setImagePreview(''));
                        }}
                        id="imageFood"
                        name="imageFood"
                        imagePreview={imagePreview}
                        disabled={isSubmitting}
                        clearImagePreview={clearImagePreview}
                    /> */}

                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
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

    const stepTwo = () => {
        return (
            <FormikProvider value={formikStepTwo}>
                <Form>
                    <div className="field">
                        <label htmlFor="firstName" className="field__label">
                            First Name*
                        </label>
                        <TextField
                            name="firstName"
                            id="firstName"
                            placeholder="Enter First Name"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="lastName" className="field__label">
                            Last Name*
                        </label>
                        <TextField
                            name="lastName"
                            id="lastName"
                            placeholder="Enter Last Name"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="cardNumber" className="field__label">
                            Card Number*
                        </label>
                        <TextField
                            type="number"
                            name="cardNumber"
                            id="cardNumber"
                            placeholder="**** **** **** ****"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field field__file">
                        <div className="flex">
                            <div className="field w--100 mr-6">
                                <label
                                    htmlFor="expiryDate"
                                    className="field__label"
                                >
                                    Expiry date*
                                </label>
                                <TextField
                                    type="number"
                                    name="expiryDate"
                                    id="expiryDate"
                                    placeholder="MM / YY"
                                    // disabled={isLoading}
                                />
                            </div>

                            <div className="field w--100">
                                <label htmlFor="cvv" className="field__label">
                                    CVV*
                                </label>
                                <TextField
                                    max={999}
                                    maxLength={999}
                                    type="number"
                                    name="cvv"
                                    id="cvv"
                                    placeholder="***"
                                    // disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="zipCode" className="field__label">
                            ZIP / Postal Code*
                        </label>
                        <TextField
                            type="number"
                            name="zipCode"
                            id="zipCode"
                            placeholder="Enter ZIP / Postal Code"
                            // disabled={isLoading}
                        />
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
                        Back to step 2
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    return <>{step === 1 ? stepOne() : step === 2 ? stepTwo() : <></>}</>;
};

export default TutorOnboarding;
