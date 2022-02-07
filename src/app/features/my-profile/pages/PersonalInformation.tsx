import { Form, FormikProvider, useFormik } from 'formik';
import { debounce, isEqual } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    useGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
} from '../../../../services/tutorService';
import MyCountrySelect from '../../../components/form/MyCountrySelect';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import UploadFile from '../../../components/form/MyUploadField';
import TextField from '../../../components/form/TextField';
import ImageCircle from '../../../components/ImageCircle';
import MainWrapper from '../../../components/MainWrapper';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import {
    ICountry,
    useLazyGetCountriesQuery,
} from '../../onboarding/services/countryService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import {
    useLazyGetUserQuery,
    useUpdateUserInformationMutation,
} from '../services/userService';

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
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [saveBtnActive, setSaveBtnActive] = useState(false);
    const user = useAppSelector((state) => state.auth.user);

    const userId = getUserId();

    const { data: profileProgress } = useGetProfileProgressQuery();
    const [
        updateUserInformation,
        { isLoading: isLoadingUserUpdate, isSuccess: isSuccessUserUpdate },
    ] = useUpdateUserInformationMutation();
    const [
        getUser,
        {
            data: userInformation,
            isLoading: isLoadingUser,
            isSuccess: isSuccessUser,
        },
    ] = useLazyGetUserQuery();

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

    useEffect(() => {
        if (
            isSuccessUser &&
            userInformation?.firstName &&
            userInformation.lastName &&
            userInformation.phoneNumber &&
            userInformation.countryId &&
            userInformation.dateOfBirth &&
            userInformation.profileImage
        ) {
            const values = {
                firstName: userInformation.firstName,
                lastName: userInformation.lastName,
                phoneNumber: userInformation.phoneNumber,
                countryId: userInformation.countryId,
                dateOfBirth: userInformation.dateOfBirth,
                profileImage: userInformation.profileImage,
            };
            setInitialvalues(values);
        }
    }, [isSuccessUser]);

    const [initialValues, setInitialvalues] = useState<Values>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        countryId: '',
        profileImage: '',
    });

    const handleSubmit = (values: Values) => {
        updateUserInformation({
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            countryId: values.countryId,
            dateOfBirth: moment(values.dateOfBirth).toISOString(),
            profileImage: values.profileImage,
        });
    };

    useEffect(() => {
        if (isSuccessUserUpdate) {
            if (user) {
                getUser(user.id);
            }
            setSaveBtnActive(false);
            toastService.success(
                t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS')
            );
        }
    }, [isSuccessUserUpdate]);

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

    const isLoading = isLoadingUser || isLoadingUserUpdate;

    const handleBlur = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    useEffect(() => {
        handleBlur();
    }, [formik.values]);

    useEffect(() => {
        getCountries();
        if (user) {
            getUser(user.id);
        }
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
                                <button
                                    className={`btn btn--primary btn--lg mt-6 card--profile__savebtn`}
                                    type="submit"
                                    // disabled={isLoading || !saveBtnActive}
                                    disabled={isLoading || !saveBtnActive}
                                >
                                    Save
                                </button>
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
                                                disabled={isLoading}
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
                                                disabled={isLoading}
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
                                                disabled={isLoading}
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

                                            <MySelect
                                                form={formik}
                                                field={formik.getFieldProps(
                                                    'countryId'
                                                )}
                                                meta={formik.getFieldMeta(
                                                    'countryId'
                                                )}
                                                isMulti={false}
                                                classNamePrefix="onboarding-select"
                                                options={countryOptions}
                                                placeholder="Choose your country"
                                                customInputField={countryInput}
                                                customOption={countryOption}
                                                isDisabled={isLoading}
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
                                                isDisabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="field field__file">
                                    <label
                                        className="field__label"
                                        htmlFor="profileImage"
                                    >
                                        Profile Image*
                                    </label>
                                    <UploadFile
                                        setFieldValue={formik.setFieldValue}
                                        id="profileImage"
                                        name="profileImage"
                                        value={
                                            user?.profileImage
                                                ? user.profileImage
                                                : ''
                                        }
                                        disabled={isLoading}
                                    />
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
                        </div>
                        {/* IMAGE */}
                        {/* <div className="card--profile__section">
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
                                        {tutor?.profileImage ? (
                                            <img
                                                src={tutor.profileImage}
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
                                </div>
                            </div>
                        </div> */}
                    </Form>
                </FormikProvider>
            </div>
        </MainWrapper>
    );
};

export default PersonalInformation;
