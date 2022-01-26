import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    useGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
} from '../../../../services/tutorService';
import MyCountrySelect from '../../../components/form/MyCountrySelect';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneSelect from '../../../components/form/MyPhoneSelect';
import UploadFile from '../../../components/form/MyUploadField';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { phoneNumberInput } from '../../../constants/phoneNumberInput';
import { phoneNumberOption } from '../../../constants/phoneNumberOption';
import { useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import { useLazyGetCountriesQuery } from '../../onboarding/services/countryService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';

interface Values {
    firstName: string;
    lastName: string;
    prefix: string;
    phoneNumber: string;
    dateOfBirth: string;
    countryId: string;
    profileImage: string;
}

const PersonalInformation = () => {
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();

    const userId = getUserId();

    const { data: profileProgress } = useGetProfileProgressQuery();

    // const [
    //     getTutorProfileData,
    //     { data: tutorProfileData, isSuccess: isSuccessTutorData },
    // ] = useLazyGetTutorProfileDataQuery();

    // useEffect(() => {
    //     if (userId) {
    //         getTutorProfileData(userId);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (isSuccessTutorData && tutorProfileData) {
    //         console.log(tutorProfileData);
    //     }
    // }, [isSuccessTutorData]);

    //change later to fetch image from user service
    const profileImage = useAppSelector(
        (state) => state.tutorRegister.profileImage
    );

    const { t } = useTranslation();

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
        countryId: '',
        profileImage: '',
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
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    useEffect(() => {
        getCountries();
    }, []);

    return (
        <MainWrapper>
            <div className="card--profile">
                <FormikProvider value={formik}>
                    <Form>
                        {/* HEADER */}
                        <ProfileHeader className="mb-8" />

                        <ProfileTabs />

                        {/* PROGRESS */}
                        <ProfileCompletion percentage={profileProgress?.percentage} />

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
                            <div className="w--800--max">
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
                                                    options={countries}
                                                    classNamePrefix="onboarding-select"
                                                    className="w--120"
                                                    placeholder="+00"
                                                    customInputField={
                                                        phoneNumberInput
                                                    }
                                                    customOption={
                                                        phoneNumberOption
                                                    }
                                                    isSearchable={false}
                                                    withoutErr={
                                                        formik.errors.prefix &&
                                                            formik.touched.prefix
                                                            ? false
                                                            : true
                                                    }
                                                />
                                                <div className="ml-4"></div>
                                                <TextField
                                                    wrapperClassName="flex--grow"
                                                    name="phoneNumber"
                                                    placeholder="Enter your phone number"
                                                    className="input input--base"
                                                    withoutErr={
                                                        formik.errors
                                                            .phoneNumber &&
                                                            formik.touched
                                                                .phoneNumber
                                                            ? false
                                                            : true
                                                    }
                                                />
                                            </div>
                                            <div className="flex flex--center">
                                                {formik.errors.prefix &&
                                                    formik.touched.prefix ? (
                                                    <div className="field__validation mr-4">
                                                        {formik.errors.prefix
                                                            ? formik.errors
                                                                .prefix
                                                            : ''}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                {formik.errors.phoneNumber &&
                                                    formik.touched.phoneNumber ? (
                                                    <div className="field__validation">
                                                        {formik.errors
                                                            .phoneNumber
                                                            ? formik.errors
                                                                .phoneNumber
                                                            : ''}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="countryId"
                                                className="field__label"
                                            >
                                                Country*
                                            </label>

                                            <MyCountrySelect
                                                form={formik}
                                                field={formik.getFieldProps(
                                                    'countryId'
                                                )}
                                                meta={formik.getFieldMeta(
                                                    'countryId'
                                                )}
                                                isMulti={false}
                                                classNamePrefix="onboarding-select"
                                                options={countries}
                                                placeholder="Choose your country"
                                                customInputField={countryInput}
                                                customOption={countryOption}
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

                            </div>
                        </div>
                        {/* IMAGE */}
                        <div className="card--profile__section">
                            <div>
                                <div className="mb-2 type--wgt--bold">
                                    Profile Picture
                                </div>
                                <div className="type--color--tertiary w--200--max">
                                    Upload or remove a new profile
                                    picture (PNG or JPG)
                                </div>
                            </div>
                            <div className="w--800--max">
                                <div className="flex flex--center flex--grow">
                                    <div className="tutor-list__item__img">
                                        <img
                                            src="https://source.unsplash.com/random/300×300/?face"
                                            alt="tutor-pic"
                                        />
                                    </div>
                                    <div className="field field__file">
                                        <label
                                            className="field__label"
                                            htmlFor="profileImage"
                                        >
                                            Profile Image*
                                        </label>
                                        <UploadFile
                                            setFieldValue={
                                                formik.setFieldValue
                                            }
                                            uploadedFile={(file: any) => {
                                                formik.setFieldValue(
                                                    'profileImage',
                                                    file
                                                );
                                            }}
                                            id="profileImage"
                                            name="profileImage"
                                            imagePreview={profileImage}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn--primary btn--lg"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
        </MainWrapper>
    );
};

export default PersonalInformation;
