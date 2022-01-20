import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import * as Yup from 'yup';

import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneSelect from '../../../components/form/MyPhoneSelect';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import { useLazyGetCountriesQuery } from '../../onboarding/services/countryService';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

interface Values {
    firstName: string;
    lastName: string;
    prefix: string;
    phoneNumber: string;
    dateOfBirth: string;
}

const PersonalInformation = () => {
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();

    const { t } = useTranslation();

    useEffect(() => {
        getCountries();
    }, []);

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
    };

    const handleSubmit = (values: Values) => {
        const test = values;
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            lastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    useEffect(() => {
        console.log(formik.values);
    }, [formik.values]);

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

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion />

                {/* PERSONAL INFO */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Personal Information
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your personal information
                        </div>
                    </div>
                    <div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="row">
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="firstName"
                                                className="field__label"
                                            >
                                                First Name
                                            </label>
                                            <TextField
                                                name="firstName"
                                                id="firstName"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="lastName"
                                                className="field__label"
                                            >
                                                Last Name
                                            </label>
                                            <TextField
                                                name="lastName"
                                                id="lastName"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="phoneNumber"
                                                className="field__label"
                                            >
                                                Phone Number*
                                            </label>
                                            <div className="flex flex--center pos--rel">
                                                <MyPhoneSelect
                                                    form={formik}
                                                    field={formik.getFieldProps(
                                                        'prefix'
                                                    )}
                                                    meta={formik.getFieldMeta(
                                                        'prefix'
                                                    )}
                                                    isMulti={false}
                                                    classNamePrefix="prefix-select"
                                                    className="phoneNumber-select"
                                                    options={countries}
                                                    placeholder="Select pre"
                                                    customInputField={
                                                        phoneNumberInput
                                                    }
                                                    customOption={
                                                        phoneNumberOption
                                                    }
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
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="country"
                                                className="field__label"
                                            >
                                                Select country
                                            </label>
                                            <TextField
                                                name="country"
                                                id="country"
                                                placeholder="Enter your country name"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                className="field__label"
                                                htmlFor="dateOfBirth"
                                            >
                                                Date of Birth*
                                            </label>
                                            <MyDatePicker
                                                form={formik}
                                                field={formik.getFieldProps(
                                                    'dateOfBirth'
                                                )}
                                                meta={formik.getFieldMeta(
                                                    'dateOfBirth'
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn--primary btn--lg"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default PersonalInformation;
