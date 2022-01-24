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
    setChildList,
    setStepOne,
    setStepTwo,
} from '../../../../slices/parentRegisterSlice';
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
import { useRegisterParentMutation } from '../../../services/authService';
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
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [phoneOptions, setPhoneOptions] = useState<OptionType[]>([]);
    const [registerParent, { isSuccess }] = useRegisterParentMutation();
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
        childDateOfBirth,
        childPassword,
        childFirstName,
        childLastName,
        username,
    } = parentCreds;
    const roleAbrv = useAppSelector((state) => state.role.selectedRole);
    const id = _.uniqueId();

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

    const initialValuesOne: StepOneValues = {
        countryId: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
    };
    const [initialValuesTwo, setInitialValuesTwo] = useState<DetailsValues>({
        childFirstName: '',
        childLastName: '',
        childDateOfBirth: '',
        username: '',
        childPassword: '',
    });

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

    const formikStepTwo = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({}),
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
            childDateOfBirth: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
            username: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            childPassword: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
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

    const submitDetails = (values: DetailsValues) => {
        debugger;
        let newArr = child;
        newArr = [...child];
        const currentChild = {
            firstName: values.childFirstName,
            lastName: 'Last Name',
            dateOfBirth: moment(values.childDateOfBirth).toISOString(),
            username: values.username,
            password: values.childPassword,
        };

        newArr.push(currentChild);
        dispatch(setChildList(newArr));

        setChildId('');
        setDetailsOpen(false);
    };

    const handleFindId = (id: string) => {
        // const test: IChild | undefined = child.find(
        //     (x) => x.id === id
        // );
        // if (test?.id === id) {
        //     setInitialValuesTwo({
        //         childFirstName: test.name,
        //         childLastName: test.name,
        //         childDateOfBirth: test.description,
        //         username: '',
        //         childPassword: '',
        //     });
        //     formikStepThree.setFieldValue('childFirstName', test.name);
        //     formikStepThree.setFieldValue('childLastName', test.name);
        //     formikStepThree.setFieldValue('childDateOfBirth', test.description);
        //     setDetailsOpen(true);
        //     setChildId(test.id);
        // }
        console.log(id);
    };

    const handleSubmit = (values: any) => {
        registerParent({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: passwordRepeat,
            dateOfBirth: moment(dateOfBirth).toISOString(),
            phoneNumber: phoneNumber,
            countryId: countryId,
            children: JSON.stringify([
                {
                    childDateOfBirth: childDateOfBirth,
                    childFirstName: childFirstName,
                    childPassword: childPassword,
                    username: username,
                },
            ]),
            phonePrefix: prefix,
            roleAbrv: roleAbrv ? roleAbrv : '',
        });
        debugger;
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
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                    >
                        {t('REGISTER.NEXT_BUTTON')}
                    </button>
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

    const handleAddNewchild = () => {
        setInitialValuesTwo({
            childFirstName: '',
            childLastName: '',
            childDateOfBirth: '',
            username: '',
            childPassword: '',
        });
        setDetailsOpen(true);
        setChildId('');
    };

    const handleResetForm = () => {
        formikStepThree.resetForm();
        setChildId('');
        setDetailsOpen(false);
    };

    const stepTwo = () => {
        return (
            <>
                <FormikProvider value={formikStepTwo}>
                    <Form>
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
                                            onClick={() => handleFindId(x.id)}
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
                                                    ).format('MM / DD / YYYY')}
                                                </div>
                                            </div>
                                            <i className="icon icon--base icon--edit icon--primary"></i>
                                        </div>
                                    );
                                })}
                        </div>
                        <button
                            className="btn btn--base btn--primary w--100 mb-2 mt-6"
                            type="submit"
                            // disabled={isLoading}
                            // onClick={() => handleNextStep()}
                        >
                            {t('REGISTER.FINISH')}
                        </button>
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

    const childDetails = () => {
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
                                formikStepThree.handleBlur(e);
                            }}
                        />
                    </div>
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                    >
                        {t('REGISTER.SAVE_BUTTON')}
                    </button>
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

    useEffect(() => {
        if (isSuccess) {
            handleNextStep();
        }
    }, [isSuccess]);

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
