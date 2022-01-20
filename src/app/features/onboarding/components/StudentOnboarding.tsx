import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import * as Yup from 'yup';

import { setStepOne } from '../../../../slices/studentRegisterSlice';
import MyCountrySelect from '../../../components/form/MyCountrySelect';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneSelect from '../../../components/form/MyPhoneSelect';
import MySelect from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useRegisterStudentMutation } from '../../../services/authService';
import { useLazyGetCountriesQuery } from '../services/countryService';

interface StepOneValues {
    countryId: string;
    prefix: string;
    phoneNumber: string;
    dateOfBirth: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

const StudentOnboarding: React.FC<IProps> = ({
    handleGoBack,
    handleNextStep,
}) => {
    const [registerStudent, { isSuccess }] = useRegisterStudentMutation();
    const state = useAppSelector((state) => state.studentRegister);
    const roleAbrv = useAppSelector((state) => state.role.selectedRole);
    const {
        firstName,
        lastName,
        password,
        passwordRepeat,
        countryId,
        prefix,
        phoneNumber,
        dateOfBirth,
        email,
    } = state;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();

    useEffect(() => {
        getCountries();
    }, []);

    const initialValuesOne: StepOneValues = {
        countryId: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
    };

    const formik = useFormik({
        initialValues: initialValuesOne,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: StepOneValues) => {
        registerStudent({
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: passwordRepeat,
            roleAbrv: roleAbrv ? roleAbrv : '',
            countryId: values.countryId,
            phonePrefix: values.prefix,
            phoneNumber: values.phoneNumber,
            dateOfBirth: moment(values.dateOfBirth).toISOString(),
            email: email,
        });
    };

    useEffect(() => {
        if (isSuccess) {
            handleNextStep();
        }
    });

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
    return (
        <>
            <FormikProvider value={formik}>
                <Form>
                    {/* <div>{JSON.stringify(formik.values, null, 2)}</div> */}
                    <div className="field">
                        <label htmlFor="countryId" className="field__label">
                            Country*
                        </label>

                        <MyCountrySelect
                            form={formik}
                            field={formik.getFieldProps('countryId')}
                            meta={formik.getFieldMeta('countryId')}
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
                                form={formik}
                                field={formik.getFieldProps('prefix')}
                                meta={formik.getFieldMeta('prefix')}
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
                                className="input input--base input--phone-number"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                            Date of Birth*
                        </label>
                        <MyDatePicker
                            form={formik}
                            field={formik.getFieldProps('dateOfBirth')}
                            meta={formik.getFieldMeta('dateOfBirth')}
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
                        Back to register
                    </div>
                </Form>
            </FormikProvider>
        </>
    );
};

export default StudentOnboarding;
