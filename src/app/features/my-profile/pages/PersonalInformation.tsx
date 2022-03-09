import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useLazyGetProfileProgressQuery } from '../../../../services/tutorService';
import { useLazyGetUserQuery, useUpdateUserInformationMutation } from '../../../../services/userService';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import UploadFile from '../../../components/form/MyUploadField';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import { ICountry, useLazyGetCountriesQuery } from '../../onboarding/services/countryService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import { setMyProfileProgress } from '../slices/myProfileSlice';

interface Values {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    countryId: string;
    profileImage: string;
}

const PersonalInformation = () => {
    const [getCountries, { data: countries, isLoading: countriesLoading, isUninitialized: countriesUninitialized, isFetching: countriesFetching }] =
        useLazyGetCountriesQuery();
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [updateUserInformation, { isLoading: isLoadingUserUpdate }] = useUpdateUserInformationMutation();
    const [getUser, { isLoading: isLoadingUser, isUninitialized: userUninitialized, isFetching: userFetching }] = useLazyGetUserQuery();

    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [saveBtnActive, setSaveBtnActive] = useState(false);
    const [initialValues, setInitialvalues] = useState<Values>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        countryId: '',
        profileImage: '',
    });

    const dispatch = useAppDispatch();
    const history = useHistory();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';
    const user = useAppSelector((state) => state.auth.user);
    const userId = getUserId();
    const { t } = useTranslation();
    const isLoading = isLoadingUser || isLoadingUserUpdate;
    const pageLoading = countriesLoading || countriesUninitialized || isLoadingUser || userUninitialized || countriesFetching || userFetching;

    const handleSubmit = async (values: Values) => {
        const toSend: any = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            countryId: values.countryId,
            dateOfBirth: moment(values.dateOfBirth).toISOString(),
        };

        if (userRole === 'tutor') {
            toSend['profileImage'] = values.profileImage;
        }

        await updateUserInformation(toSend);

        //hide save button
        setSaveBtnActive(false);
        setInitialvalues(values);
        toastService.success(t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS'));
    };

    const handleBlur = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    const fetchData = async () => {
        getCountries();
        if (user) {
            const userResponse = await getUser(user.id).unwrap();

            if (userResponse) {
                const values = {
                    firstName: userResponse.firstName,
                    lastName: userResponse.lastName,
                    phoneNumber: userResponse.phoneNumber,
                    countryId: userResponse.countryId,
                    dateOfBirth: userResponse.dateOfBirth,
                    profileImage: userResponse.profileImage,
                };
                //set formik values
                setInitialvalues(values);
            }
            //If there is no state in redux for profileProgress fetch data and save result to redux
            if (profileProgressState.percentage === 0) {
                const progressResponse = await getProfileProgress().unwrap();
                dispatch(setMyProfileProgress(progressResponse));
            }
        }
    };

    const handleUpdateOnRouteChange = () => {
        if (Object.keys(formik.errors).length > 0) {
            toastService.error('You didn`t fulfill all field requirements');
            return false;
        } else {
            updateUserInformation({
                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                phoneNumber: formik.values.phoneNumber,
                countryId: formik.values.countryId,
                dateOfBirth: moment(formik.values.dateOfBirth).toISOString(),
                profileImage: formik.values.profileImage,
            });
            return true;
        }
    };

    const generateValidation = () => {
        const validation: any = {
            firstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            lastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().min(6, t('FORM_VALIDATION.TOO_SHORT')).required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .test('dateOfBirth', t('FORM_VALIDATION.FUTURE_DATE'), (value) => {
                    const dateDiff = moment(value).diff(moment(), 'days');

                    if (dateDiff < 0) {
                        return true;
                    } else {
                        return false;
                    }
                }),
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        };

        if (userRole === 'tutor') {
            validation['profileImage'] = Yup.mixed()
                .required('Image Required')
                .test('profileImage', 'Image has to be either jpg,png,jpeg or svg', (value) => {
                    if (typeof value === 'string') {
                        return true;
                    } else {
                        if (value.type === 'image/jpg' || value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/svg') {
                            return true;
                        }

                        return false;
                    }
                })
                .test('profileImage', 'Image has to be less than 2MB in size.', (value) => {
                    if (typeof value === 'string') {
                        return true;
                    } else {
                        if (value.size > 2000000) {
                            return false;
                        }

                        return true;
                    }
                });
        }

        return Yup.object().shape(validation);
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: generateValidation(),
    });

    useEffect(() => {
        fetchData();

        //if user id exist, update user info on component unmount
        if (userId) {
            return function updateUserOnUnmount() {
                //if user is loggin out, dont fetch new userData
                if (history.location.pathname !== '/') {
                    getUser(userId);
                }
            };
        }
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
        handleBlur();
    }, [formik.values]);

    return (
        <>
            <RouterPrompt
                when={saveBtnActive}
                onOK={handleUpdateOnRouteChange}
                onCancel={() => {
                    //if you pass "false" router will be blocked and you will stay on the current page
                    return true;
                }}
            />
            <MainWrapper>
                <div className="card--profile">
                    <FormikProvider value={formik}>
                        <Form>
                            {/* HEADER */}
                            <ProfileHeader className="mb-8" />

                            {/* PROGRESS */}
                            <ProfileCompletion
                                generalAvailability={profileProgressState.generalAvailability}
                                aditionalInformation={profileProgressState.aboutMe}
                                myTeachings={profileProgressState.myTeachings}
                                percentage={profileProgressState.percentage}
                            />

                            {/* PERSONAL INFO */}
                            {(pageLoading && <LoaderPrimary />) || (
                                <div className="card--profile__section">
                                    <div>
                                        <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.PROFILE_SETTINGS.TITLE')}</div>
                                        <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.PROFILE_SETTINGS.DESCRIPTION')}</div>
                                        <button
                                            className={`btn btn--primary btn--lg mt-6 card--profile__savebtn`}
                                            type="submit"
                                            // disabled={isLoading || !saveBtnActive}
                                            disabled={isLoading || !saveBtnActive}
                                        >
                                            {t('MY_PROFILE.SUBMIT')}
                                        </button>
                                    </div>
                                    <div className="w--800--max">
                                        <div className="row">
                                            <div className="col col-12 col-xl-6">
                                                <div className="field">
                                                    <label htmlFor="firstName" className="field__label">
                                                        {t('MY_PROFILE.PROFILE_SETTINGS.FIRST_NAME')}
                                                    </label>
                                                    <TextField
                                                        name="firstName"
                                                        id="firstName"
                                                        placeholder={t('MY_PROFILE.PROFILE_SETTINGS.FIRST_NAME_PLACEHOLDER')}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col col-12 col-xl-6">
                                                <div className="field">
                                                    <label htmlFor="lastName" className="field__label">
                                                        {t('MY_PROFILE.PROFILE_SETTINGS.LAST_NAME')}
                                                    </label>
                                                    <TextField
                                                        name="lastName"
                                                        id="lastName"
                                                        placeholder={t('MY_PROFILE.PROFILE_SETTINGS.LAST_NAME_PLACEHOLDER')}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col col-12 col-xl-6">
                                                <div className="field">
                                                    <label htmlFor="phoneNumber" className="field__label">
                                                        {t('REGISTER.FORM.PHONE_NUMBER')}
                                                    </label>
                                                    <MyPhoneInput
                                                        form={formik}
                                                        name="phoneNumber"
                                                        field={formik.getFieldProps('phoneNumber')}
                                                        meta={formik.getFieldMeta('phoneNumber')}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col col-12 col-xl-6">
                                                <div className="field">
                                                    <label htmlFor="countryId" className="field__label">
                                                        {t('MY_PROFILE.PROFILE_SETTINGS.COUNTRY')}
                                                    </label>

                                                    <MySelect
                                                        form={formik}
                                                        field={formik.getFieldProps('countryId')}
                                                        meta={formik.getFieldMeta('countryId')}
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
                                                    <label className="field__label" htmlFor="dateOfBirth">
                                                        {t('MY_PROFILE.PROFILE_SETTINGS.BIRTHDAY')}
                                                    </label>
                                                    <MyDatePicker
                                                        form={formik}
                                                        field={formik.getFieldProps('dateOfBirth')}
                                                        meta={formik.getFieldMeta('dateOfBirth')}
                                                        isDisabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            {userRole === 'tutor' && (
                                                <div className="col col-12">
                                                    <div className="field field__file">
                                                        <label className="field__label" htmlFor="profileImage">
                                                            {t('MY_PROFILE.PROFILE_SETTINGS.IMAGE')}
                                                        </label>
                                                        <UploadFile
                                                            setFieldValue={formik.setFieldValue}
                                                            id="profileImage"
                                                            name="profileImage"
                                                            value={user?.profileImage ? user.profileImage : ''}
                                                            disabled={isLoading}
                                                            imagePreview={formik.values.profileImage}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </FormikProvider>
                </div>
            </MainWrapper>
        </>
    );
};

export default PersonalInformation;
