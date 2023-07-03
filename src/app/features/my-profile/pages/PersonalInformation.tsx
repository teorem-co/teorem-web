import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { optionCSS } from 'react-select/dist/declarations/src/components/Option';
import * as Yup from 'yup';

import {
  useLazyDisableTutorQuery,
  useLazyEnableTutorQuery,
  useLazyGetProfileProgressQuery,
  useLazyGetTutorProfileDataQuery,
} from '../../../../services/tutorService';
import { useLazyGetUserQuery, useUpdateUserInformationMutation } from '../../../../services/userService';
import { RoleOptions } from '../../../../slices/roleSlice';
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
import languageOptions, { ILanguageOption } from '../../../constants/languageOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { PROFILE_PATHS } from '../../../routes';
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

  const [getTutor, { data: tutorData, isSuccess: isSuccessTutor }] = useLazyGetTutorProfileDataQuery();
  const [updateTutorDisabled] = useLazyDisableTutorQuery();
  const [updateTutorEnabled] = useLazyEnableTutorQuery();

  const [tutorDisabled, setTutorDisabledValue] = useState<boolean>(true);
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const [t, i18n] = useTranslation();
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
  const isLoading = isLoadingUser || isLoadingUserUpdate;
  const pageLoading = countriesLoading || countriesUninitialized || isLoadingUser || userUninitialized || countriesFetching || userFetching;

  const handleSubmit = async (values: Values) => {
    const toSend: any = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      countryId: values.countryId,
      dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'),
    };

    if (userRole === RoleOptions.Tutor) {
      toSend['profileImage'] = values.profileImage;
    }

    await updateUserInformation(toSend);

    //hide save button
    setSaveBtnActive(false);
    setInitialvalues(values);
    toastService.success(t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS'));
  };

  const handleBlur = () => {
    const initialValueImgSplit = initialValues.profileImage.split('/');
    const initialValueImg = initialValueImgSplit[initialValueImgSplit.length - 1];

    let formikImgSplit = [];
    let formikImg = '';
    if (typeof formik.values.profileImage === 'string') {
      formikImgSplit = formik.values.profileImage.split('/');
      formikImg = formikImgSplit[formikImgSplit.length - 1];
    } else {
      const test: any = formik.values.profileImage;
      formikImg = test.name;
    }

    const initialValueObj = {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
      phoneNumber: initialValues.phoneNumber,
      dateOfBirth: initialValues.dateOfBirth,
      countryId: initialValues.countryId,
      profileImage: initialValueImg,
    };

    const formikValuesObj = {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      phoneNumber: formik.values.phoneNumber,
      dateOfBirth: formik.values.dateOfBirth,
      countryId: formik.values.countryId,
      profileImage: formikImg,
    };

    if (!isEqual(initialValueObj, formikValuesObj)) {
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
          profileImage: userResponse.profileImage ? userResponse.profileImage : '',
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
      console.log(formik.errors);
      console.log("PersonalInformation");
      toastService.error(t('FORM_VALIDATION.WRONG_REQUIREMENTS'));
      return false;
    } else {
      updateUserInformation({
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        phoneNumber: formik.values.phoneNumber,
        countryId: formik.values.countryId,
        dateOfBirth: moment(formik.values.dateOfBirth).format('YYYY-MM-DD'),
        profileImage: formik.values.profileImage,
      });
      return true;
    }
  };

  const isValidDate = (dateString: string | undefined) => {
    const dateFormat = 'YYYY-MM-DD';
    const date = moment(dateString, dateFormat, true);

    // Check if the date is valid and the year is greater than 1900
    return date.isValid() && date.year() > 1900;
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
        })
        .test('dateOfBirth', t('FORM_VALIDATION.VALID_DATE'), (value) => {
          return !isValidDate(value);
        }),
      countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
    };

    if (userRole === RoleOptions.Tutor) {
      validation['profileImage'] = Yup.mixed()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .test('profileImage', t('FORM_VALIDATION.IMAGE_TYPE'), (value) => {
          if (typeof value === 'string') {
            return true;
          } else {
            if (value.type === 'image/jpg' || value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/svg') {
              return true;
            }

            return false;
          }
        })
        .test('profileImage', t('FORM_VALIDATION.IMAGE_SIZE'), (value) => {
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

  const setTutorDisabled = (disabled: boolean) => {
    if (disabled) {
      updateTutorDisabled();
    } else {
      updateTutorEnabled();
    }

    setTutorDisabledValue(disabled);
  };

  useEffect(() => {
    if (isSuccessTutor && tutorData) setTutorDisabledValue(tutorData.disabled);
  }, [tutorData]);

  useEffect(() => {
    fetchData();

    //if user id exist, update user info on component unmount
    if (userId) {
      if (userRole === RoleOptions.Tutor) getTutor(userId);

      return function updateUserOnUnmount() {
        //if user is loggin out, dont fetch new userData
        if (history.location.pathname !== '/login') {
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

  const changeLanguage = (option: ILanguageOption) => {
    let pushPath = '';

    Object.keys(PROFILE_PATHS).forEach((path) => {
      if (t('PATHS.PROFILE_PATHS.' + path) === history.location.pathname) {
        pushPath = 'PATHS.PROFILE_PATHS.' + path;
      }
    });

    i18n.changeLanguage(option.path);

    history.push(t(pushPath));
    window.location.reload();
  };

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
                <>
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
                        {userRole === RoleOptions.Tutor && (
                          <div className="col col-12">
                            <div className="field field__file">
                              <label className="field__label" htmlFor="profileImage">
                                {/*t('MY_PROFILE.PROFILE_SETTINGS.IMAGE')*/}
                              </label>
                              <UploadFile
                                setFieldValue={formik.setFieldValue}
                                id="profileImage"
                                name="profileImage"
                                value={user?.profileImage ? user.profileImage : ''}
                                disabled={isLoading}
                                imagePreview={formik.values.profileImage}
                                removePreviewOnUnmount={true}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card--profile__section">
                    <div>
                      <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.TRANSLATION.TITLE')}</div>
                      <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.TRANSLATION.SUBTITLE')}</div>
                    </div>
                    <div className="w--800--max">
                      {languageOptions.map((option: ILanguageOption) => {
                        return (
                          <div
                            key={option.path}
                            className={`btn btn--base btn--${option.path === i18n.language ? 'primary' : 'disabled'} mr-2`}
                            onClick={() => {
                              changeLanguage(option);
                            }}
                          >
                            {option.label.substring(0, 3)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {userRole === RoleOptions.Tutor && isSuccessTutor && (
                    <div className="card--profile__section">
                      <div>
                        <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.TUTOR_DISABLE.TITLE')}</div>
                        <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.TUTOR_DISABLE.SUBTITLE')}</div>
                      </div>
                      <div className="w--800--max">
                        <div
                          className={`btn btn--base btn--${tutorDisabled ? 'primary' : 'disabled'} mr-2`}
                          onClick={() => {
                            setTutorDisabled(true);
                          }}
                        >
                          {t('MY_PROFILE.TUTOR_DISABLE.NO')}
                        </div>
                        <div
                          className={`btn btn--base btn--${!tutorDisabled ? 'primary' : 'disabled'} mr-2`}
                          onClick={() => {
                            setTutorDisabled(false);
                          }}
                        >
                          {t('MY_PROFILE.TUTOR_DISABLE.YES')}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Form>
          </FormikProvider>
        </div>
      </MainWrapper>
    </>
  );
};

export default PersonalInformation;
