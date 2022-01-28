import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    useGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
} from '../../../../services/tutorService';
import MyCountrySelect from '../../../components/form/MyCountrySelect';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import TextField from '../../../components/form/TextField';
import ImageCircle from '../../../components/ImageCircle';
import MainWrapper from '../../../components/MainWrapper';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import { useLazyGetCountriesQuery } from '../../onboarding/services/countryService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';

interface Values {
    firstName: string;
    lastName: string;
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
    const tutor = useAppSelector((state) => state.auth.user);

    const { t } = useTranslation();

    const initialValues: Values = {
        firstName: '',
        lastName: '',
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
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            lastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .min(6, t('FORM_VALIDATION.TOO_SHORT'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .test(
                    'dateOfBirth',
                    t('FORM_VALIDATION.FUTURE_DATE'),
                    (value) => {
                        const dateDiff = moment(value).diff(moment(), 'days');

                        if (dateDiff < 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                ),
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
                        <ProfileCompletion
                            percentage={profileProgress?.percentage}
                        />

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
                                                {t(
                                                    'REGISTER.FORM.PHONE_NUMBER'
                                                )}
                                            </label>
                                            <MyPhoneInput
                                                form={formik}
                                                name="phoneNumber"
                                                field={formik.getFieldProps(
                                                    'phoneNumber'
                                                )}
                                                meta={formik.getFieldMeta(
                                                    'phoneNumber'
                                                )}
                                            />
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
                                    Upload or remove a new profile picture (PNG
                                    or JPG)
                                </div>
                            </div>
                            <div className="w--800--max">
                                <div className="flex flex--center flex--grow">
                                    <div className="tutor-list__item__img">
                                        {tutor?.File?.path ? (
                                            <img
                                                src={tutor.File.path}
                                                alt="tutor-list"
                                            />
                                        ) : (
                                            <ImageCircle
                                                initials={`${
                                                    tutor?.firstName
                                                        ? tutor.firstName.charAt(
                                                              0
                                                          )
                                                        : ''
                                                }${
                                                    tutor?.lastName
                                                        ? tutor.lastName.charAt(
                                                              0
                                                          )
                                                        : ''
                                                }`}
                                                imageBig={true}
                                            />
                                        )}
                                    </div>
                                    <div className="field field__file">
                                        <label
                                            className="field__label"
                                            htmlFor="profileImage"
                                        >
                                            Profile Image*
                                        </label>
                                        {/* <UploadFile
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
                                        /> */}
                                    </div>
                                </div>
                                <button
                                    className="btn btn--primary btn--lg mt-6"
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
