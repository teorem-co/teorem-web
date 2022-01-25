import { Form, FormikProvider, useFormik } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import gradientCircle from '../../../../assets/images/gradient-circle.svg';
import { IChild } from '../../../../interfaces/IChild';
import IChildListOption from '../../../../interfaces/IChildListOption';
import { setchildren } from '../../../../slices/childrenSlice';
import {
    resetParentRegister,
    setChildList,
    setStepOne,
    setStepTwo,
} from '../../../../slices/parentRegisterSlice';
import { resetStudentRegister } from '../../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../../slices/tutorRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MySelect, {
    OptionType,
    PhoneOptionType,
} from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { phoneNumberInput } from '../../../constants/phoneNumberInput';
import { phoneNumberOption } from '../../../constants/phoneNumberOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
    useCheckUsernameMutation,
    useRegisterParentMutation,
} from '../../../services/authService';
import toastService from '../../../services/toastService';
import TooltipPassword from '../../register/TooltipPassword';
import { ICountry, useLazyGetCountriesQuery } from '../services/countryService';

interface StepOneValues {
    countryId: string;
    phoneNumber: string;
    prefix: string;
    dateOfBirth: string;
}

interface DetailsValues {
    childFirstName: string;
    childLastName: string;
    childDateOfBirth: string;
    username: string;
    childPassword: string;
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
    const { t } = useTranslation();
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.children);
    const [childId, setChildId] = useState<string>('');
    const [currentChildUserName, setCurrentChildUsername] =
        useState<string>('');
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [phoneOptions, setPhoneOptions] = useState<OptionType[]>([]);
    const [passTooltip, setPassTooltip] = useState<boolean>(false);
    const [registerParent, { isSuccess }] = useRegisterParentMutation();
    const [checkUsername, { isSuccess: isSuccessUsername }] =
        useCheckUsernameMutation();
    const parentCreds = useAppSelector((state) => state.parentRegister);
    const {
        firstName,
        lastName,
        password,
        passwordRepeat,
        email,
        dateOfBirth,
        phoneNumber,
        prefix,
        countryId,
        child,
    } = parentCreds;
    const roleAbrv = useAppSelector((state) => state.role.selectedRole);

    const [initialValuesTwo, setInitialValuesTwo] = useState<DetailsValues>({
        childFirstName: '',
        childLastName: '',
        childDateOfBirth: '',
        username: '',
        childPassword: '',
    });
    const handlePasswordFocus = () => {
        setPassTooltip(true);
    };

    const handlePasswordBlur = () => {
        setPassTooltip(false);
    };

    const myInput = document.getElementById(
        'childPassword'
    ) as HTMLInputElement;
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');
    const special = document.getElementById('special');

    const handleKeyUp = () => {
        const lowerCaseLetters = /[a-z]/g;
        if (letter && myInput?.value.match(lowerCaseLetters)) {
            letter.classList.remove('icon--grey');
            letter.classList.add('icon--success');
        } else {
            letter?.classList.remove('icon--success');
            letter?.classList.add('icon--grey');
        }
        // Validate capital letters
        const upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
            capital?.classList.remove('icon--grey');
            capital?.classList.add('icon--success');
        } else {
            capital?.classList.remove('icon--success');
            capital?.classList.add('icon--grey');
        }
        // Validate numbers
        const numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number?.classList.remove('icon--grey');
            number?.classList.add('icon--success');
        } else {
            number?.classList.remove('icon--success');
            number?.classList.add('icon--grey');
        }
        // Validate length
        if (myInput.value.length >= 8) {
            length?.classList.remove('icon--grey');
            length?.classList.add('icon--success');
        } else {
            length?.classList.remove('icon--success');
            length?.classList.add('icon--grey');
        }
        // Validate special characters
        const specialCharacters = /[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]/;
        if (myInput.value.match(specialCharacters)) {
            special?.classList.remove('icon--grey');
            special?.classList.add('icon--success');
        } else {
            special?.classList.remove('icon--success');
            special?.classList.add('icon--grey');
        }
    };

    // Step one

    const initialValuesOne: StepOneValues = {
        countryId: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
    };

    const formikStepOne = useFormik({
        initialValues: initialValuesOne,
        onSubmit: (values) => submitStepOne(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const submitStepOne = (values: StepOneValues) => {
        dispatch(
            setStepOne({
                countryId: values.countryId,
                phoneNumber: values.phoneNumber,
                prefix: values.prefix,
                dateOfBirth: values.dateOfBirth,
            })
        );
        handleNextStep();
    };

    const stepOne = () => {
        return (
            <FormikProvider value={formikStepOne}>
                <Form>
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
                        <div className="flex flex--center">
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
                    <div
                        className="btn btn--base btn--primary type--center w--100 mb-2 mt-6"
                        // type="submit"
                        onClick={() => formikStepOne.handleSubmit()}
                        // disabled={isLoading}
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

    // Step two

    const formikStepTwo = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => submitStepTwo(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({}),
    });

    const submitStepTwo = (values: any) => {
        registerParent({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: passwordRepeat,
            dateOfBirth: moment(dateOfBirth).toISOString(),
            phoneNumber: phoneNumber,
            countryId: countryId,
            children: JSON.stringify(child),
            phonePrefix: prefix,
            roleAbrv: roleAbrv ? roleAbrv : '',
        });

        debugger;
    };

    const stepTwo = () => {
        return (
            <>
                <FormikProvider value={formikStepTwo}>
                    <Form id="formSubmit">
                        <div className="role-selection__form">
                            <div
                                className="role-selection__item"
                                onClick={() => {
                                    handleAddNewchild();
                                }}
                            >
                                <div className="flex--grow ml-4">
                                    <div className="mb-1">
                                        {t('ADD_CHILD.TITLE')}
                                    </div>
                                    <div className="type--color--secondary">
                                        {t('ADD_CHILD.DESCRIPTION')}
                                    </div>
                                </div>
                                <i className="icon icon--base icon--plus icon--primary"></i>
                            </div>
                            {child.length > 0 &&
                                child.map((x: any) => {
                                    return (
                                        <div
                                            className="role-selection__item"
                                            key={x.id}
                                            onClick={() => {
                                                handleFindId(x.username);
                                                setCurrentChildUsername(
                                                    x.username
                                                );
                                            }}
                                        >
                                            <img
                                                src={gradientCircle}
                                                alt="gradient circle"
                                            />
                                            <div className="flex--grow ml-4">
                                                <div className="mb-1">
                                                    {x.firstName}
                                                </div>
                                                <div className="type--color--secondary">
                                                    {moment(
                                                        x.description
                                                    ).format('MM/DD/YYYY')}
                                                </div>
                                            </div>
                                            <i className="icon icon--base icon--edit icon--primary"></i>
                                        </div>
                                    );
                                })}
                        </div>
                        <div
                            className="btn btn--base btn--primary type--center w--100 mb-2 mt-6"
                            onClick={() => formikStepTwo.handleSubmit()}
                            // disabled={isLoading}
                            // onClick={() => handleNextStep()}
                        >
                            {t('REGISTER.FINISH')}
                        </div>
                        <div
                            onClick={() => handleGoBack()}
                            className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                        >
                            <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                            {t('REGISTER.BACK_TO_STEP_ONE')}
                        </div>
                    </Form>
                </FormikProvider>
            </>
        );
    };

    // Step three

    const formikStepThree = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => submitStepThree(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            childFirstName: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
            childDateOfBirth: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
            username: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .test(
                    'username',
                    'Username already exists',
                    async (value: any) => {
                        if (value) {
                            const isValid = await checkUsername({
                                username: value,
                            }).unwrap();
                            return !isValid;
                        }
                        return true;
                    }
                ),
            childPassword: Yup.string()
                .min(8, t('FORM_VALIDATION.TOO_SHORT'))
                .max(128, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                )
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const submitStepThree = (values: DetailsValues) => {
        let newArr = child;
        newArr = [...child];
        const currentChild = {
            firstName: values.childFirstName,
            dateOfBirth: values.childDateOfBirth,
            username: values.username,
            password: values.childPassword,
        };
        if (childId === currentChildUserName) {
            const currentItem = newArr.findIndex((x) => {
                return x.username === currentChildUserName;
            });
            newArr.splice(currentItem);
            newArr.push(currentChild);
            setChildId('');
            dispatch(setChildList(newArr));
            setDetailsOpen(false);
        } else {
            newArr.push(currentChild);
            dispatch(setChildList(newArr));
            setDetailsOpen(false);
        }
    };

    const stepThree = () => {
        return (
            <FormikProvider value={formikStepThree}>
                <Form>
                    <div className="field">
                        <label
                            htmlFor="childFirstName"
                            className="field__label"
                        >
                            {t('REGISTER.FORM.CHILD_NAME')}
                        </label>
                        <TextField
                            name="childFirstName"
                            id="childFirstName"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="field">
                        <label
                            className="field__label"
                            htmlFor="childDateOfBirth"
                        >
                            {t('REGISTER.FORM.CHILD_DATE_OF_BIRTH')}
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
                    <div className="field">
                        <label htmlFor="username" className="field__label">
                            {t('REGISTER.FORM.USERNAME')}
                        </label>
                        <TextField
                            // onBlur={() =>
                            //     checkUsername({
                            //         username: formikStepThree.values.username,
                            //     })
                            // }
                            name="username"
                            id="username"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="childPassword">
                            {t('REGISTER.FORM.PASSWORD')}
                        </label>
                        <TextField
                            name="childPassword"
                            id="childPassword"
                            placeholder="Type your password"
                            className="input input--base input--text input--icon"
                            password={true}
                            onBlur={(e: any) => {
                                handlePasswordBlur();
                                formikStepThree.handleBlur(e);
                            }}
                            onFocus={handlePasswordFocus}
                            onKeyUp={handleKeyUp}
                        />

                        <TooltipPassword passTooltip={passTooltip} />
                    </div>
                    <div
                        className="btn btn--base btn--primary type--center w--100 mb-2 mt-6"
                        onClick={() => formikStepThree.handleSubmit()}
                        // disabled={isLoading}
                    >
                        {t('REGISTER.SAVE_BUTTON')}
                    </div>
                    <div
                        onClick={() => {
                            handleResetForm();
                        }}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        {t('REGISTER.BACK_TO_LIST')}
                    </div>
                </Form>
            </FormikProvider>
        );
    };

    // end of steps

    const handleFindId = (username: string) => {
        const test: IChild | undefined = child.find(
            (x) => x.username === username
        );
        if (test?.username === username) {
            setInitialValuesTwo({
                childFirstName: test.firstName,
                childLastName: test.firstName,
                childDateOfBirth: test.dateOfBirth,
                username: test.username,
                childPassword: test.password,
            });
            formikStepThree.setFieldValue('childFirstName', test.firstName);
            formikStepThree.setFieldValue('childLastName', test.firstName);
            formikStepThree.setFieldValue('childDateOfBirth', test.dateOfBirth);
            setDetailsOpen(true);
            setChildId(test.username);
        }
    };

    const handleAddNewchild = () => {
        formikStepThree.resetForm();
        setInitialValuesTwo({
            childFirstName: '',
            childLastName: '',
            childDateOfBirth: '',
            username: '',
            childPassword: '',
        });
        setDetailsOpen(true);
    };

    const handleResetForm = () => {
        formikStepThree.resetForm();
        setChildId('');
        setDetailsOpen(false);
    };

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

    console.log(child);
    return (
        <>
            {step === 1 ? (
                stepOne()
            ) : step === 2 && detailsOpen === false ? (
                stepTwo()
            ) : detailsOpen && step === 2 ? (
                stepThree()
            ) : (
                <></>
            )}
        </>
    );
};

export default ParentOnboarding;
