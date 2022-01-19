import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import * as Yup from 'yup';

import { setStepOne } from '../../../../slices/studentRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MySelect from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { useAppDispatch } from '../../../hooks';

interface StepOneValues {
    country: string;
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
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

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
            country: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: StepOneValues) => {
        dispatch(
            setStepOne({
                country: values.country,
                prefix: values.prefix,
                phoneNumber: values.phoneNumber,
                dateOfBirth: values.dateOfBirth,
            })
        );
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
    return (
        <>
            <FormikProvider value={formik}>
                <Form>
                    <div>{JSON.stringify(formik.errors, null, 2)}</div>
                    <div className="field">
                        <label htmlFor="country" className="field__label">
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
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                            Phone Number*
                        </label>
                        <div className="flex flex--center pos--rel">
                            <MySelect
                                form={formik}
                                field={formik.getFieldProps('prefix')}
                                meta={formik.getFieldMeta('prefix')}
                                isMulti={false}
                                classNamePrefix="prefix-select"
                                className="phoneNumber-select"
                                options={phoneOptions}
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
