import { Form, FormikProvider, useFormik, useFormikContext } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { components } from 'react-select';
import * as Yup from 'yup';

import gradientCircle from '../../../../assets/images/gradient-circle.svg';
import IChildListOption from '../../../../interfaces/IChildListOption';
import { setchildren } from '../../../../slices/childrenSlice';
import {
    setChildList,
    setStepOne,
    setStepTwo,
} from '../../../../slices/parentRegisterSlice';
import MyCountrySelect from '../../../components/form/MyCountrySelect';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneSelect from '../../../components/form/MyPhoneSelect';
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
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.children);
    const childDetail = useAppSelector((state) => state.parentRegister);
    const { childFirstName, childLastName, childDateOfBirth } = childDetail;
    const [childId, setChildId] = useState<string>('');
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [phoneOptions, setPhoneOptions] = useState<OptionType[]>([]);

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
    });
    const id = _.uniqueId();
    const { child } = state;
    const { t } = useTranslation();

    const handleSubmit = (values: any) => {
        console.log(values);
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

    const formikStepTwo = useFormik({
        initialValues: initialValuesTwo,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            country: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
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
                countryId: values.countryId,
                phoneNumber: values.phoneNumber,
                prefix: values.prefix,
                dateOfBirth: values.dateOfBirth,
            })
        );
        handleNextStep();
        debugger;
    };

    const submitDetails = (values: DetailsValues) => {
        dispatch(
            setStepTwo({
                childFirstName: values.childFirstName,
                childLastName: values.childLastName,
                childDateOfBirth: values.childDateOfBirth,
            })
        );
        dispatch(
            setchildren([
                ...child,
                {
                    id: id,
                    name: `${values.childFirstName} ${values.childLastName}`,
                    description: moment(values.childDateOfBirth).format(
                        'MM / DD / YYYY'
                    ),
                },
            ])
        );
        setChildId('');
        setDetailsOpen(false);
    };

    const handleFindId = (id: string) => {
        const test: IChildListOption | undefined = child.find(
            (x) => x.id === id
        );
        if (test?.id === id) {
            setInitialValuesTwo({
                childFirstName: test.name,
                childLastName: test.name,
                childDateOfBirth: test.description,
            });
            formikStepThree.setFieldValue('childFirstName', test.name);
            formikStepThree.setFieldValue('childLastName', test.name);
            formikStepThree.setFieldValue('childDateOfBirth', test.description);
            setDetailsOpen(true);
            setChildId(test.id);
        }
    };

    const stepOne = () => {
        return (
            <FormikProvider value={formikStepOne}>
                <Form>
                    <div className="field">
                        <label htmlFor="countryId" className="field__label">
                            Country*
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
                            Phone Number*
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
                            Date of Birth*
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

    const handleAddNewchild = () => {
        setInitialValuesTwo({
            childFirstName: '',
            childLastName: '',
            childDateOfBirth: '',
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
                                    <div className="mb-1">Add new Child</div>
                                    <div className="type--color--secondary">
                                        Select to Add new Child
                                    </div>
                                </div>
                                <i className="icon icon--base icon--plus icon--primary"></i>
                            </div>
                            {child.map((x) => {
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
                                            <div className="mb-1">{x.name}</div>
                                            <div className="type--color--secondary">
                                                {moment(x.description).format(
                                                    'MM / DD / YYYY'
                                                )}
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
                        onClick={() => {
                            handleResetForm();
                        }}
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
