import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { resetParentRegister } from '../../../../slices/parentRegisterSlice';
import { resetStudentRegister } from '../../../../slices/studentRegisterSlice';
import {
    resetTutorRegister,
    setStepOne,
    setStepTwo,
} from '../../../../slices/tutorRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MySelect, {
    OptionType,
    PhoneOptionType,
} from '../../../components/form/MySelectField';
import UploadFile from '../../../components/form/MyUploadField';
import TextField from '../../../components/form/TextField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { phoneNumberInput } from '../../../constants/phoneNumberInput';
import { phoneNumberOption } from '../../../constants/phoneNumberOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useRegisterTutorMutation } from '../../../services/authService';
import toastService from '../../../services/toastService';
import { ICountry, useLazyGetCountriesQuery } from '../services/countryService';

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
    const [registerTutor, { isSuccess }] = useRegisterTutorMutation();
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [phoneOptions, setPhoneOptions] = useState<OptionType[]>([]);
    const profileImage = useAppSelector(
        (state) => state.tutorRegister.profileImage
    );
    const { t } = useTranslation();

    // step one
    const editStepOne = () => {
        const test = {
            countryId: countryId,
            prefix: prefix,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            profileImage: profileImage,
        };
        const test2 = countryId ? test : initialValuesOne;
        return test2;
    };

    const initialValuesOne: StepOneValues = {
        countryId: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
        profileImage: '',
    };

    const formikStepOne = useFormik({
        initialValues: editStepOne(),
        onSubmit: (values) => handleSubmitStepOne(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .matches(
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/gm,
                    'Invalid Phone Number'
                ),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            profileImage: Yup.string().required('Image Required'),
        }),
    });

    const handleSubmitStepOne = (values: StepOneValues) => {
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

    const stepOne = () => {
        return (
            <FormikProvider value={formikStepOne}>
                <Form>
                    {/* <div>{JSON.stringify(formikStepOne.values, null, 2)}</div> */}
                    <div className="field">
                        <label htmlFor="countryId" className="field__label">
                            {t('REGISTER.FORM.COUNTRY')}
                        </label>

                        <MySelect
                            form={formikStepOne}
                            field={formikStepOne.getFieldProps('countryId')}
                            meta={formikStepOne.getFieldMeta('countryId')}
                            isMulti={false}
                            classNamePrefix="onboarding-select"
                            options={countryOptions}
                            placeholder="Choose your country"
                            customInputField={countryInput}
                            customOption={countryOption}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                            {t('REGISTER.FORM.PHONE_NUMBER')}
                        </label>
                        <div className="flex flex--center pos--rel">
                            <MySelect
                                form={formikStepOne}
                                field={formikStepOne.getFieldProps('prefix')}
                                meta={formikStepOne.getFieldMeta('prefix')}
                                isMulti={false}
                                options={phoneOptions}
                                classNamePrefix="onboarding-select"
                                className="w--120"
                                placeholder="+00"
                                customInputField={phoneNumberInput}
                                customOption={phoneNumberOption}
                                isSearchable={false}
                                withoutErr={
                                    formikStepOne.errors.prefix &&
                                    formikStepOne.touched.prefix
                                        ? true
                                        : false
                                }
                            />
                            <div className="ml-4"></div>
                            <TextField
                                wrapperClassName="flex--grow"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                className="input input--base"
                                withoutErr={
                                    formikStepOne.errors.phoneNumber &&
                                    formikStepOne.touched.phoneNumber
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <div className="flex">
                            <div className="w--136">
                                {formikStepOne.errors.prefix &&
                                formikStepOne.touched.prefix ? (
                                    <div className="field__validation mr-4">
                                        {formikStepOne.errors.prefix
                                            ? formikStepOne.errors.prefix
                                            : ''}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                {formikStepOne.errors.phoneNumber &&
                                formikStepOne.touched.phoneNumber ? (
                                    <div className="field__validation">
                                        {formikStepOne.errors.phoneNumber
                                            ? formikStepOne.errors.phoneNumber
                                            : ''}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                            {t('REGISTER.FORM.DATE_OF_BIRTH')}
                        </label>
                        <MyDatePicker
                            form={formikStepOne}
                            field={formikStepOne.getFieldProps('dateOfBirth')}
                            meta={formikStepOne.getFieldMeta('dateOfBirth')}
                        />
                    </div>
                    <div className="field field__file">
                        <label className="field__label" htmlFor="profileImage">
                            {t('REGISTER.FORM.PROFILE_IMAGE')}
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

                    <div
                        className="btn btn--base btn--primary type--center w--100 mb-2 mt-6"
                        onClick={() => formikStepOne.handleSubmit()}
                    >
                        {t('REGISTER.NEXT_BUTTON')}
                    </div>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        {t('REGISTER.BACK_TO_REGISTER')}
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    // step two

    const initialValuesTwo: StepTwoValues = {
        cardFirstName: '',
        cardLastName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipCode: '',
    };

    const formikStepTwo = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => handleSubmitStepTwo(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            cardFirstName: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            cardLastName: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            cardNumber: Yup.number()
                .min(16, t('FORM_VALIDATION.TOO_SHORT'))
                .max(16, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cvv: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmitStepTwo = (values: StepTwoValues) => {
        debugger;
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

    const stepTwo = () => {
        return (
            <FormikProvider value={formikStepTwo}>
                <Form>
                    {/* <div>{JSON.stringify(formikStepTwo.values, null, 2)}</div> */}
                    <div className="field">
                        <label htmlFor="cardFirstName" className="field__label">
                            {t('REGISTER.CARD_DETAILS.FIRST_NAME')}
                        </label>
                        <TextField
                            name="cardFirstName"
                            id="cardFirstName"
                            placeholder="Enter First Name"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="cardLastName" className="field__label">
                            {t('REGISTER.CARD_DETAILS.LAST_NAME')}
                        </label>
                        <TextField
                            name="cardLastName"
                            id="cardLastName"
                            placeholder="Enter Last Name"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="cardNumber" className="field__label">
                            {t('REGISTER.CARD_DETAILS.CARD_NUMBER')}
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
                                    {t('REGISTER.CARD_DETAILS.EXPIRY_DATE')}
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
                                    {t('REGISTER.CARD_DETAILS.CVV')}
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
                            {t('REGISTER.CARD_DETAILS.ZIP_CODE')}
                        </label>
                        <TextField
                            type="number"
                            name="zipCode"
                            id="zipCode"
                            placeholder="Enter ZIP / Postal Code"
                            // disabled={isLoading}
                        />
                    </div>
                    <div
                        className="btn btn--base btn--primary type--center w--100 mb-2 mt-6"
                        onClick={() => formikStepTwo.handleSubmit()}
                    >
                        {t('REGISTER.FINISH')}
                    </div>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        {t('REGISTER.BACK_TO_STEP_TWO')}
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    // end of steps

    useEffect(() => {
        getCountries();
    }, []);

    useEffect(() => {
        const currentCountries: OptionType[] = countries
            ? countries.map((x: ICountry) => {
                  return {
                      label: x.name,
                      value: x.id,
                  };
              })
            : [];
        setCountryOptions(currentCountries);
        const currentPhone: PhoneOptionType[] = countries
            ? countries.map((x: ICountry) => {
                  return {
                      label: x.name,
                      prefix: x.phonePrefix,
                      value: x.phonePrefix,
                  };
              })
            : [];
        setPhoneOptions(currentPhone);
    }, [countries]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetTutorRegister());
            dispatch(resetParentRegister());
            dispatch(resetStudentRegister());
            handleNextStep();
            toastService.success('You are registered successfully.');
        }
    }, [isSuccess]);

    return <>{step === 1 ? stepOne() : step === 2 ? stepTwo() : <></>}</>;
};

export default TutorOnboarding;
