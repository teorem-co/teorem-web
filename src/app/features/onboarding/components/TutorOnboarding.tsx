import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import * as Yup from 'yup';

import {
    resetTutorRegister,
    setStepOne,
    setStepTwo,
} from '../../../../slices/tutorRegisterSlice';
import MyCountrySelect from '../../../components/form/MyCountrySelect';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneSelect from '../../../components/form/MyPhoneSelect';
import MySelect from '../../../components/form/MySelectField';
import UploadFile from '../../../components/form/MyUploadField';
import TextField from '../../../components/form/TextField';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useRegisterTutorMutation } from '../../../services/authService';
import { useLazyGetCountriesQuery } from '../services/countryService';

interface StepOneValues {
    countryId: string;
    prefix: string;
    phoneNumber: string;
    dateOfBirth: string;
    profileImage: string;
}

interface StepTwoValues {
    cardFirstName: string;
    cardLastName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
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
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.tutorRegister);
    const {
        firstName,
        lastName,
        email,
        password,
        passwordRepeat,
        countryId,
        prefix,
        phoneNumber,
        dateOfBirth,
    } = state;
    const roleAbrv = useAppSelector((state) => state.role.selectedRole);
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
    const [registerTutor, { isSuccess, isLoading }] =
        useRegisterTutorMutation();
    const profileImage = useAppSelector(
        (state) => state.tutorRegister.profileImage
    );
    const { t } = useTranslation();

    useEffect(() => {
        getCountries();
    }, []);

    const initialValuesOne: StepOneValues = {
        countryId: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
        profileImage: '',
    };

    const initialValuesTwo: StepTwoValues = {
        cardFirstName: '',
        cardLastName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipCode: '',
    };

    const formikStepOne = useFormik({
        initialValues: initialValuesOne,
        onSubmit: (values) => handleSubmitStepOne(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            profileImage: Yup.string(),
        }),
    });

    const formikStepTwo = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => handleSubmitStepTwo(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string(),
            // .min(2, t('FORM_VALIDATION.TOO_SHORT'))
            // .max(100, t('FORM_VALIDATION.TOO_LONG'))
            // .required(t('FORM_VALIDATION.REQUIRED')),
            // lastName: Yup.string()
            // .min(2, t('FORM_VALIDATION.TOO_SHORT'))
            // .max(100, t('FORM_VALIDATION.TOO_LONG'))
            // // .required(t('FORM_VALIDATION.REQUIRED')),
            // cardNumber: Yup.string()
            // .min(16, t('FORM_VALIDATION.TOO_SHORT'))
            // .max(16, t('FORM_VALIDATION.TOO_LONG'))
            // // .required(t('FORM_VALIDATION.REQUIRED')),
            // // expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            // // cvv: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            // // zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmitStepOne = (values: StepOneValues) => {
        const test = {
            countryId: values.countryId,
            prefix: values.prefix,
            phoneNumber: values.phoneNumber,
            dateOfBirth: values.dateOfBirth,
            profileImage: values.profileImage,
        };
        dispatch(
            setStepOne({
                countryId: values.countryId,
                prefix: values.prefix,
                phoneNumber: values.phoneNumber,
                dateOfBirth: values.dateOfBirth,
                profileImage: values.profileImage,
            })
        );
        handleNextStep();
    };

    const handleSubmitStepTwo = (values: StepTwoValues) => {
        dispatch(
            setStepTwo({
                cardFirstName: values.cardFirstName,
                cardLastName: values.cardLastName,
                cardNumber: values.cardNumber,
                expiryDate: values.expiryDate,
                cvv: values.cvv,
                zipCode: values.zipCode,
            })
        );
        registerTutor({
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: passwordRepeat,
            roleAbrv: roleAbrv ? roleAbrv : '',
            countryId: countryId,
            phonePrefix: prefix,
            phoneNumber: phoneNumber,
            dateOfBirth: moment(dateOfBirth).toISOString(),
            email: email,
            profileImage: profileImage,
        });
    };

    useEffect(() => {
        if (isSuccess) {
            resetTutorRegister();
            handleNextStep();
        }
    }, [isSuccess]);

    const countryInput = (props: any) => {
        if (props.data.icon) {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        {/* <span className="input-select__icon mr-2">
                            {props.data.icon}
                        </span> */}
                        <span>{props.data.name}</span>
                    </div>
                </components.SingleValue>
            );
        } else {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span>{props.data.name}</span>
                    </div>
                </components.SingleValue>
            );
        }
    };

    const phoneNumberInput = (props: any) => {
        if (props.data.icon) {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option flex flex--center">
                        <div
                            style={{
                                width: '20px',
                                height: '10px',
                                backgroundColor: 'blue',
                            }}
                            className="mr-2"
                        ></div>
                        <span>{props.data.phonePrefix}</span>
                    </div>
                </components.SingleValue>
            );
        } else {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option flex flex--center">
                        <div
                            style={{
                                width: '20px',
                                height: '10px',
                                backgroundColor: 'blue',
                            }}
                            className="mr-2"
                        ></div>
                        <span>{props.data.phonePrefix}</span>
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
                        {/* <span className="mr-2">{props.data.icon}</span> */}
                        <span>{props.data.name}</span>
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
                        {/* <span className="mr-2">{props.data.icon}</span> */}
                        {/* </span> */}
                        <div
                            style={{
                                width: '20px',
                                height: '10px',
                                backgroundColor: 'blue',
                            }}
                            className="mr-2"
                        ></div>
                        <span className="mr-6" style={{ width: '40px' }}>
                            {props.data.phonePrefix}
                        </span>
                        <span>{props.data.name}</span>
                    </div>
                </div>
            </components.Option>
        );
    };
    // console.log(firstName, lastName, email, password, passwordRepeat);

    const stepOne = () => {
        return (
            <FormikProvider value={formikStepOne}>
                <Form>
                    {/* <div>{JSON.stringify(formikStepOne.values, null, 2)}</div> */}
                    <div className="field">
                        <label htmlFor="countryId" className="field__label">
                            Country*
                        </label>

                        <MyCountrySelect
                            form={formikStepOne}
                            field={formikStepOne.getFieldProps('countryId')}
                            meta={formikStepOne.getFieldMeta('countryId')}
                            isMulti={false}
                            classNamePrefix="onboarding-select"
                            options={countries}
                            placeholder="Choose your country"
                            customInputField={countryInput}
                            customOption={countryOption}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                            Phone Number*
                        </label>
                        <div className="flex flex--center pos--rel">
                            <MyPhoneSelect
                                form={formikStepOne}
                                field={formikStepOne.getFieldProps('prefix')}
                                meta={formikStepOne.getFieldMeta('prefix')}
                                isMulti={false}
                                classNamePrefix="prefix-select"
                                className="phoneNumber-select"
                                options={countries}
                                placeholder="Select pre"
                                customInputField={phoneNumberInput}
                                customOption={phoneNumberOption}
                                isSearchable={false}
                            />
                            <TextField
                                wrapperClassName="flex--grow"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                className="input input--base input--phone-number pl-0"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                            Date of Birth*
                        </label>
                        <MyDatePicker
                            form={formikStepOne}
                            field={formikStepOne.getFieldProps('dateOfBirth')}
                            meta={formikStepOne.getFieldMeta('dateOfBirth')}
                        />
                    </div>
                    <div className="field field__file">
                        <label className="field__label" htmlFor="profileImage">
                            Profile Image*
                        </label>
                        <UploadFile
                            setFieldValue={formikStepOne.setFieldValue}
                            uploadedFile={(file: any) => {
                                formikStepOne.setFieldValue(
                                    'profileImage',
                                    file
                                );
                            }}
                            id="profileImage"
                            name="profileImage"
                            imagePreview={profileImage}
                        />
                    </div>

                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
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
                    {/* <div>{JSON.stringify(formikStepTwo.values, null, 2)}</div> */}
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
