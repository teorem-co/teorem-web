import { Form, FormikProvider, useFormik } from 'formik';
import { forwardRef, LegacyRef, useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Select, { components } from 'react-select';
import * as Yup from 'yup';

import TextField from '../../../components/form/TextField';
import MySelect from '../../../components/MySelectField';
import TextArea from '../../../components/MyTextArea';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

interface ISelection {
    numberPre: string;
    number: string;
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

    const levels = [
        {
            value: 1,
            label: 'All levels',
        },
        {
            value: 2,
            label: 'A Level',
        },
        {
            value: 3,
            label: 'GSCE',
        },
        {
            value: 4,
            label: 'IB',
        },
        {
            value: 5,
            label: 'KS2',
        },
        {
            value: 6,
            label: 'KS3',
        },
    ];

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRepeat: '',
    };

    const handleSubmit = (values: any) => {
        console.log(values);
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            country: Yup.string()
                // .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                // .min(2, t('FORM_VALIDATION.TOO_SHORT'))
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

    const customMultiInput = (props: any) => {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option">
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        );
    };

    const customMultiDropdown = (props: any) => {
        const { innerProps } = props;
        return (
            <components.Option {...innerProps} {...props}>
                {' '}
                <div className="input-select">
                    <div className="input-select__option flex flex--center">
                        {/* Checkbox */}
                        <div
                            className="field"
                            onClick={(e) => e.preventDefault()}
                        >
                            <input
                                type="checkbox"
                                className="input input--checkbox"
                                id="input-check"
                            />
                            <label
                                className="input--checkbox__label"
                                htmlFor="input-check"
                            >
                                {props.data.label}
                            </label>
                        </div>
                    </div>
                </div>
            </components.Option>
        );
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };
    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    return (
        <>
            <FormikProvider value={formik}>
                <Form>
                    <div className="field">
                        {step === 1 ? (
                            <>
                                <label
                                    htmlFor="country"
                                    className="field__label"
                                >
                                    Country*
                                </label>

                                <MySelect
                                    form={formik}
                                    field={formik.getFieldProps('country')}
                                    meta={formik.getFieldMeta('country')}
                                    isMulti={false}
                                    classNamePrefix="onboarding-select"
                                    options={options}
                                    placeholder="Choose your country"
                                    customInputField={countryInput}
                                    customOption={countryOption}
                                />
                            </>
                        ) : step === 2 ? (
                            <>
                                <label
                                    htmlFor="occupation"
                                    className="field__label"
                                >
                                    Your current occupation*
                                </label>
                                <TextField
                                    name="occupation"
                                    id="occupation"
                                    placeholder="What's your current occupation"
                                    // disabled={isLoading}
                                />
                            </>
                        ) : (
                            <>
                                <label
                                    htmlFor="firstName"
                                    className="field__label"
                                >
                                    First Name*
                                </label>
                                <TextField
                                    name="firstName"
                                    id="firstName"
                                    placeholder="Enter First Name"
                                    // disabled={isLoading}
                                />
                            </>
                        )}
                    </div>
                    <div className="field">
                        {step === 1 ? (
                            <>
                                <label
                                    htmlFor="phoneNumber"
                                    className="field__label"
                                >
                                    Phone Number*
                                </label>
                                <MySelect
                                    form={formik}
                                    field={formik.getFieldProps('phoneNumber')}
                                    meta={formik.getFieldMeta('phoneNumber')}
                                    isMulti={false}
                                    classNamePrefix="onboarding-select"
                                    options={phoneOptions}
                                    placeholder="Enter your phone number"
                                    customInputField={phoneNumberInput}
                                    customOption={phoneNumberOption}
                                />
                            </>
                        ) : step === 2 ? (
                            <>
                                <label
                                    htmlFor="yearsOfExperience"
                                    className="field__label"
                                >
                                    Years of professional experience (optional)
                                </label>
                                <TextField
                                    name="yearsOfExperience"
                                    id="yearsOfExperience"
                                    placeholder="How many years of professional experience you have"
                                    // disabled={isLoading}
                                />
                            </>
                        ) : (
                            <>
                                <label
                                    htmlFor="lastName"
                                    className="field__label"
                                >
                                    Last Name*
                                </label>
                                <TextField
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    // disabled={isLoading}
                                />
                            </>
                        )}
                    </div>
                    <div className="field">
                        {step === 1 ? (
                            <>
                                <label
                                    className="field__label"
                                    htmlFor="dateOfBirth"
                                >
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
                            </>
                        ) : step === 2 ? (
                            <>
                                <label
                                    className="field__label"
                                    htmlFor="dateOfBirth"
                                >
                                    Select level that you're able to teach*
                                </label>
                                <Select
                                    classNamePrefix="onboarding-select"
                                    options={levels}
                                    isSearchable={true}
                                    placeholder="Select"
                                    isMulti={true}
                                    components={{
                                        SingleValue: customMultiInput,
                                        Option: customMultiDropdown,
                                    }}
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                />
                            </>
                        ) : (
                            <>
                                <label
                                    htmlFor="cardNumber"
                                    className="field__label"
                                >
                                    Card Number*
                                </label>
                                <TextField
                                    type="number"
                                    name="cardNumber"
                                    id="cardNumber"
                                    placeholder="**** **** **** ****"
                                    // disabled={isLoading}
                                />
                            </>
                        )}
                    </div>
                    <div className="field field__file">
                        {step === 1 ? (
                            <>
                                <label
                                    className="field__label"
                                    htmlFor="profileImage"
                                >
                                    Profile Image*
                                </label>

                                <div className="field__file__wrap">
                                    <input
                                        type="file"
                                        className="input__file"
                                    />
                                    <i className="icon icon--upload icon--base icon--grey"></i>
                                    <div className="type--color--tertiary type--wgt--regular">
                                        Drag and drop to upload
                                    </div>
                                </div>
                            </>
                        ) : step === 2 ? (
                            <>
                                <label
                                    className="field__label"
                                    htmlFor="profileImage"
                                >
                                    Select subjects you teach*
                                </label>

                                <Select
                                    classNamePrefix="onboarding-select"
                                    options={phoneOptions}
                                    isSearchable={true}
                                    placeholder="Select"
                                />
                            </>
                        ) : (
                            <div className="flex">
                                <div className="field w--100 mr-6">
                                    <label
                                        htmlFor="expiryDate"
                                        className="field__label"
                                    >
                                        Expirty date*
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
                                    <label
                                        htmlFor="cvv"
                                        className="field__label"
                                    >
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
                        )}
                    </div>

                    <div className="field">
                        {step < 3 ? (
                            <></>
                        ) : (
                            <>
                                <label
                                    htmlFor="zipCode"
                                    className="field__label"
                                >
                                    ZIP / Postal Code*
                                </label>
                                <TextField
                                    type="number"
                                    name="zipCode"
                                    id="zipCode"
                                    placeholder="Enter ZIP / Postal Code"
                                    // disabled={isLoading}
                                />
                            </>
                        )}
                    </div>
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                        onClick={() => handleNextStep()}
                    >
                        {step < 3 ? 'Next' : 'Finish'}
                    </button>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        {step === 1
                            ? 'Back to register'
                            : step === 2
                            ? 'Back to step 1'
                            : 'Back to step 2'}
                    </div>
                </Form>
            </FormikProvider>
        </>
    );
};

export default TutorOnboarding;
