import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import IChatEnginePost from '../../../../interfaces/IChatEnginePost';
import { useRegisterTutorMutation } from '../../../../services/authService';
import { resetParentRegister } from '../../../../slices/parentRegisterSlice';
import { resetStudentRegister } from '../../../../slices/studentRegisterSlice';
import { resetTutorRegister, setStepOne, setStepTwo } from '../../../../slices/tutorRegisterSlice';
import CreditCardfield from '../../../components/CreditCardField';
import ExpDateField from '../../../components/form/ExpDateField';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import UploadFile from '../../../components/form/MyUploadField';
import TextField from '../../../components/form/TextField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useAddUserMutation } from '../../../services/chatEngineService';
import toastService from '../../../services/toastService';
import { resetTutorImageUploadState } from '../../../slices/tutorImageUploadSlice';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';
import { ICountry, useLazyGetCountriesQuery } from '../services/countryService';

interface StepOneValues {
    countryId: string;
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

const TutorOnboarding: React.FC<IProps> = ({ handleGoBack, handleNextStep, step }) => {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.tutorRegister);
    const { firstName, lastName, email, password, passwordRepeat, countryId, phoneNumber, dateOfBirth } = state;
    const roleAbrv = useAppSelector((state) => state.role.selectedRole);
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
    const [registerTutor, { isSuccess, isLoading }] = useRegisterTutorMutation();
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [phoneTooltip, setPhoneTooltip] = useState<boolean>(false);
    const profileImage = useAppSelector((state) => state.tutorRegister.profileImage);
    const { t } = useTranslation();
    //const [addUserQuery] = useAddUserMutation();

    // step one
    const editStepOne = () => {
        const stepOneValues = {
            countryId: countryId,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            profileImage: profileImage,
        };
        const newStepOneValues = countryId ? stepOneValues : initialValuesOne;
        return newStepOneValues;
    };

    const initialValuesOne: StepOneValues = {
        countryId: '',
        phoneNumber: '',
        dateOfBirth: '',
        profileImage: '',
    };

    const formikStepOne = useFormik({
        initialValues: editStepOne(),
        onSubmit: (values) => handleSubmitStepOne(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .matches(
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/gm,
                    t('FORM_VALIDATION.PHONE_NUMBER')
                ),
            dateOfBirth: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .test('dateOfBirth', t('FORM_VALIDATION.FUTURE_DATE'), (value) => {
                    const dateDiff = moment(value).diff(moment(), 'days');

                    if (dateDiff < 0) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .test('dateOfBirth', t('FORM_VALIDATION.TUTOR_AGE'), (value) => {
                    const dateDiff = moment(value).diff(moment().subtract(18, 'years'), 'days');

                    if (dateDiff < 0) {
                        return true;
                    } else {
                        return false;
                    }
                }),
            profileImage: Yup.mixed()
                .test('profileImage', 'Image has to be either jpg,png,jpeg or svg and less than 2MB in size.', (value) => {
                    if (!value)
                        return true;

                    if (value && value.size > 2000000) return false;
                    if (value && value.type === 'image/jpg' || value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/svg') {
                        return true;
                    }

                    return false;
                }).required("Please provide a profile image"),
        }),
    });

    const handleSubmitStepOne = async (values: StepOneValues) => {
        dispatch(
            setStepOne({
                countryId: values.countryId,
                phoneNumber: values.phoneNumber,
                dateOfBirth: values.dateOfBirth,
                profileImage: values.profileImage,
            })
        );
        /*
        const toSend: IChatEnginePost = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            secret: 'Teorem1!',
            username: email.split('@')[0],
        };

        addUserQuery(toSend).unwrap();
        */
        await registerTutor({
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: passwordRepeat,
            roleAbrv: roleAbrv ? roleAbrv : '',
            countryId: values.countryId,
            phoneNumber: values.phoneNumber,
            dateOfBirth: moment(values.dateOfBirth).toISOString(),
            email: email,
            profileImage: values.profileImage,
        }).unwrap();

        handleNextStep();
    };

    const rangeSetterRef = useRef<HTMLDivElement>(null);

    const hideTooltip = () => {
        setPhoneTooltip(false);
    };

    useOutsideAlerter(rangeSetterRef, hideTooltip);

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
                            placeholder={t('REGISTER.FORM.COUNTRY_PLACEHOLDER')}
                            customInputField={countryInput}
                            customOption={countryOption}
                        />
                    </div>
                    <div className="field" ref={rangeSetterRef}>
                        <label htmlFor="phoneNumber" className="field__label">
                            {t('REGISTER.FORM.PHONE_NUMBER')}
                        </label>
                        <MyPhoneInput
                            form={formikStepOne}
                            name="phoneNumber"
                            field={formikStepOne.getFieldProps('phoneNumber')}
                            meta={formikStepOne.getFieldMeta('phoneNumber')}
                            openTooltip={() => setPhoneTooltip(true)}
                        />
                        <div className={`tooltip--phone ${phoneTooltip ? 'active' : ''}`}>
                            <div className="">{t('REGISTER.FORM.PHONE_INFO')}</div>
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
                        <UploadFile setFieldValue={formikStepOne.setFieldValue} id="profileImage" name="profileImage" />
                    </div>

                    <div
                        className="btn btn--base btn--primary type--center w--100 mb-2 mt-6 type--wgt--extra-bold"
                        onClick={() => formikStepOne.handleSubmit()}
                    >
                        {t('REGISTER.NEXT_BUTTON')}
                    </div>
                    <div className="flex flex--jc--center">
                        <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
                            <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> {t('REGISTER.BACK_TO_REGISTER')}
                        </div>
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
        validateOnChange: false,
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
            cardNumber: Yup.string()
                .min(19, t('FORM_VALIDATION.TOO_SHORT'))
                .max(19, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cvv: Yup.string().max(3, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
            zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

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
            phoneNumber: phoneNumber,
            dateOfBirth: moment(dateOfBirth).toISOString(),
            email: email,
            profileImage: profileImage,
        });
        dispatch(resetTutorImageUploadState());
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
                            placeholder={t('REGISTER.FORM.FIRST_NAME_PLACEHOLDER')}
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
                            placeholder={t('REGISTER.FORM.LAST_NAME_PLACEHOLDER')}
                        // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="cardNumber" className="field__label">
                            {t('REGISTER.CARD_DETAILS.CARD_NUMBER')}
                        </label>
                        <CreditCardfield
                            name="cardNumber"
                            id="cardNumber"
                            placeholder="**** **** **** ****"
                        // disabled={isLoading}
                        />
                    </div>
                    <div className="field field__file">
                        <div className="flex">
                            <div className="field w--100 mr-6">
                                <label htmlFor="expiryDate" className="field__label">
                                    {t('REGISTER.CARD_DETAILS.EXPIRY_DATE')}
                                </label>
                                <ExpDateField
                                    name="expiryDate"
                                    id="expiryDate"
                                    placeholder={t('REGISTER.CARD_DETAILS.EXPIRY_PLACEHOLDER')}
                                // disabled={isLoading}
                                />
                            </div>

                            <div className="field w--100">
                                <label htmlFor="cvv" className="field__label">
                                    {t('REGISTER.CARD_DETAILS.CVV')}
                                </label>
                                <TextField
                                    max={3}
                                    maxLength={3}
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
                            placeholder={t('REGISTER.CARD_DETAILS.ZIP_CODE_PLACEHOLDER')}
                        // disabled={isLoading}
                        />
                    </div>
                    <div
                        className={`btn btn--base btn--${isLoading ? 'disabled' : 'primary'} type--wgt--extra-bold type--center w--100 mb-2 mt-6`}
                        onClick={() => formikStepTwo.handleSubmit()}
                    >
                        {t('REGISTER.FINISH')}
                    </div>
                    <div className="flex flex--jc--center">
                        <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
                            <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> {t('REGISTER.BACK_TO_STEP_TWO')}
                        </div>
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
                    icon: x.flag,
                };
            })
            : [];
        setCountryOptions(currentCountries);
    }, [countries]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetTutorRegister());
            dispatch(resetParentRegister());
            dispatch(resetStudentRegister());
            handleNextStep();
            toastService.success(t('ERROR_HANDLING.REGISTERED_SUCCESSFULLY'));
        }
    }, [isSuccess]);

    return <>{step === 1 ? stepOne() : step === 2 ? stepTwo() : <></>}</>;
};

export default TutorOnboarding;
