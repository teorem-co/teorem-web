import {Form, FormikProvider, useFormik} from 'formik';
import {isEqual} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {
  useLazyGetProfileProgressQuery,
  useLazyGetTutorByIdQuery,
  useUpdateAditionalInfoMutation,
} from '../../../../services/tutorService';
import MyTextArea from '../../../components/form/MyTextArea';
import TextField from '../../../components/form/TextField';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {getUserId} from '../../../utils/getUserId';
import IUpdateAdditionalInfo
  from "../../my-profile/interfaces/IUpdateAdditionalInfo";
import {setMyProfileProgress} from "../../my-profile/slices/myProfileSlice";
import {AiOutlineLeft} from "react-icons/ai";
import CircularProgress from "../../my-profile/components/CircularProgress";
import {setStepTwo} from "../../../../slices/onboardingSlice";
import TestTutorProfile from "./TestTutorProfile";
import logo from "../../../../assets/images/teorem_logo_purple.png";

interface AdditionalValues {
  currentOccupation: string;
  yearsOfExperience: string;
  aboutYou: string;
  aboutYourLessons: string;
}

type AdditionalProps = {
  nextStep: () => void,
  backStep: () => void
};

const AdditionalInfoPage = ({nextStep, backStep}: AdditionalProps) => {

  const state = useAppSelector((state) => state.onboarding);
  const { currentOccupation, aboutYou,aboutYourLessons } = state;

  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getProfileData, {
    isLoading: isLoadingGetInfo,
    isLoading: dataLoading,
    isUninitialized: dataUninitialized
  }] =
    useLazyGetTutorByIdQuery();
  const [updateAditionalInfo, {
    isLoading: isUpdatingInfo,
    isSuccess: isSuccessUpdateInfo
  }] = useUpdateAditionalInfoMutation();

  const isLoading = isLoadingGetInfo || isUpdatingInfo;
  const pageLoading = dataLoading || dataUninitialized;
  const {t} = useTranslation();
  const tutorId = getUserId();
  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const [progressPercentage, setProgressPercentage] = useState(profileProgressState.percentage);

  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const [initialValues, setInitialValues] = useState<IUpdateAdditionalInfo>({
    aboutTutor: '',
    aboutLessons: '',
    yearsOfExperience: null,
    currentOccupation: '',
  });

  const handleSubmit = async (values: IUpdateAdditionalInfo) => {
    const toSend: IUpdateAdditionalInfo = {
      aboutLessons: values.aboutLessons,
      aboutTutor: values.aboutTutor,
      currentOccupation: values.currentOccupation,
      yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : null,
    };
    await updateAditionalInfo(toSend);
    const progressResponse = await getProfileProgress().unwrap();
    setProgressPercentage(progressResponse.percentage);
    dispatch(setMyProfileProgress(progressResponse));
    setSaveBtnActive(false);
    dispatch(setStepTwo({
      currentOccupation: values.currentOccupation,
      yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : "0",
      aboutYou: values.aboutTutor,
      aboutYourLessons: values.aboutLessons,
    }));

    if (values.currentOccupation.length === 0 || values.aboutTutor.length === 0 || values.aboutLessons.length === 0) {
      setSaveBtnActive(false);
    }

    nextStep();
  };

  const handleChangeForSave = () => {
    if (!isEqual(initialValues, formik.values)) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
  };

  const handleUpdateOnRouteChange = () => {
    if (Object.keys(formik.errors).length > 0) {
      return false;
    } else {
      handleSubmit(formik.values);
      return true;
    }
  };

  const fetchData = async () => {
    if (tutorId) {
      const profileDataResponse = await getProfileData(tutorId).unwrap();

      if (profileDataResponse) {
        const values = {
          aboutTutor: profileDataResponse.aboutTutor ?? '',
          aboutLessons: profileDataResponse.aboutLessons ?? '',
          yearsOfExperience: profileDataResponse.yearsOfExperience,
          currentOccupation: profileDataResponse.currentOccupation ?? '',
        };
        setInitialValues(values);
      }

      //If there is no state in redux for profileProgress fetch data and save result to redux
      const progressResponse = await getProfileProgress().unwrap();
      setProgressPercentage(progressResponse.percentage);
      setProgressPercentage(progressResponse.percentage);
      dispatch(setMyProfileProgress(progressResponse));
      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
        setProgressPercentage(progressResponse.percentage);
        dispatch(setMyProfileProgress(progressResponse));
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      aboutTutor: Yup.string().max(2500).required(t('FORM_VALIDATION.REQUIRED')),
      aboutLessons: Yup.string().max(2500).required(t('FORM_VALIDATION.REQUIRED')),
      currentOccupation: Yup.string()
        .min(2, t('FORM_VALIDATION.TOO_SHORT'))
        .max(75, t('FORM_VALIDATION.TOO_LONG'))
        .required(t('FORM_VALIDATION.REQUIRED')),
      yearsOfExperience: Yup.number().min(0, t('FORM_VALIDATION.NEGATIVE')).max(100, t('FORM_VALIDATION.TOO_BIG')),
    }),
  });

  useEffect(() => {
    window.scrollTo({top:0});
    fetchData();
  }, []);

  //check for displaying save button
  useEffect(() => {
    if (isSuccessUpdateInfo) {
      if (tutorId) {
        getProfileData(tutorId);
      }
    }
  }, [isSuccessUpdateInfo]);

  useEffect(() => {
    handleChangeForSave();
  }, [formik.values]);

  useEffect(() => {
    if (formik.values.aboutLessons.length !== 0 && formik.values.aboutTutor.trim().split(" ").length >= 50 && formik.values.currentOccupation.length !== 0) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
  }, [formik.values]);


  const isMobile = window.innerWidth < 765;
  return (
    <>
      {/*<RouterPrompt*/}
      {/*  when={saveBtnActive}*/}
      {/*  onOK={handleUpdateOnRouteChange}*/}
      {/*  onCancel={() => {*/}
      {/*    return true;*/}
      {/*  }}*/}
      {/*/>*/}

      <img
        src={logo}
        alt='logo'
        className="mt-5 ml-5 signup-logo"
      />
      <div
        className="subject-form-container flex--jc--space-evenly"
      >
        <div
          className={`${isMobile ? '' : 'w--50'} `}
        >
          <div className='flex field__w-fit-content align--center'>
            <div className="flex flex--col flex--jc--center">
              <div style={{margin: "40px"}} className="flex flex--center">
                <AiOutlineLeft
                  className={`ml-2 mr-6 cur--pointer signup-icon`}
                  color='grey'
                  onClick={backStep}
                />

                <div  className="flex flex--row flex--jc--center">
                  <div className="flex flex--center flex--shrink ">
                    <CircularProgress progressNumber={progressPercentage} size={isMobile ? 65 : 80}  />
                  </div>
                  <div className="flex flex--col flex--jc--center">
                    <h4 className='signup-title ml-6 text-align--center'>{t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_ME')}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginLeft: "30px"
          }}>

            {/* ADDITIONAL INFO */}
            <FormikProvider value={formik}>
              <Form>
                {(pageLoading && <LoaderPrimary/>) || (
                  <div className="card--profile__section"
                       style={{justifyContent: "center", alignItems: "center"}}>
                    <div className="w--800--max">
                      <div className="row">
                        <div className="col col-12 col-xl-6">
                          <div className="field">
                            <label className="field__label"
                                   htmlFor="currentOccupation">
                              {t('MY_PROFILE.ABOUT_ME.OCCUPATION')}
                            </label>
                            <TextField
                              maxLength={75}
                              id="currentOccupation"
                              wrapperClassName="flex--grow"
                              name="currentOccupation"
                              placeholder={t('MY_PROFILE.ABOUT_ME.OCCUPATION_PLACEHOLDER')}
                              className="input input--base"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        <div className="col col-12 col-xl-6">
                          <div className="field">
                            <label className="field__label"
                                   htmlFor="yearsOfExperience">
                              {t('MY_PROFILE.ABOUT_ME.YEARS')}
                            </label>
                            <TextField
                              id="yearsOfExperience"
                              wrapperClassName="flex--grow"
                              name="yearsOfExperience"
                              placeholder={t('MY_PROFILE.ABOUT_ME.YEARS_PLACEHOLDER')}
                              className="input input--base"
                              type={'number'}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        <div className="col col-12">
                          <div className="field">
                            <label className="field__label"
                                   htmlFor="aboutTutor">
                              {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_LABEL')}
                            </label>
                            <MyTextArea
                              minLength={50}
                              maxLength={2500}
                              name="aboutTutor"
                              placeholder={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_PLACEHOLDER')}
                              id="aboutTutor"
                              disabled={isLoading}
                            />
                            <>
                              <table className={`text-align--start password-tooltip`} style={{ color: "#636363"}}>
                                <tbody>
                                <tr>
                                  <td>
                                    {formik.values.aboutTutor.trim().split(" ").length >= 50 ?
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--check icon--success mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i> :
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--close icon--grey mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i>
                                    }
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_REQUEST')}</td>
                                </tr>
                                <tr>
                                  <td>
                                    {formik.values.aboutTutor.trim().split(" ").length >= 100 ?
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--check icon--success mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i> :
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--chevron-right icon--grey mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i>
                                    }
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.TOOLTIP_EFFECTIVE')}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <i
                                      id="length"
                                      className="icon icon--sm icon--chevron-right icon--grey mr-3"
                                      style={{pointerEvents: "none"}}
                                    ></i>
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_TOOLTIP')}</td>
                                </tr>
                                </tbody>
                              </table>
                            </>
                          </div>
                        </div>
                        <div className="col col-12">
                          <div className="field">
                            <label className="field__label"
                                   htmlFor="aboutLessons">
                              {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_LABEL')}
                            </label>
                            <MyTextArea
                              maxLength={2500}
                              name="aboutLessons"
                              placeholder={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_PLACEHOLDER')}
                              id="aboutLessons"
                              disabled={isLoading}
                            />
                            <>
                              <table className={`text-align--start password-tooltip`} style={{color: "#636363"}}>
                                <tbody>
                                <tr>
                                  <td>
                                    {formik.values.aboutTutor.trim().split(" ").length >= 50 ?
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--check icon--success mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i> :
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--close icon--grey mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i>
                                    }
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_REQUEST')}</td>
                                </tr>
                                <tr>
                                  <td>
                                    {formik.values.aboutLessons.trim().split(" ").length >= 100 ?
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--check icon--success mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i> :
                                      <i
                                        id="length"
                                        className="icon icon--sm icon--chevron-right icon--grey mr-3"
                                        style={{pointerEvents: "none"}}
                                      ></i>
                                    }
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.TOOLTIP_EFFECTIVE')}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <i
                                      id="length"
                                      className="icon icon--sm icon--chevron-right icon--grey mr-3"
                                      style={{pointerEvents: "none"}}
                                    ></i>
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_TOOLTIP')}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <i
                                      id="length"
                                      className="icon icon--sm icon--chevron-right icon--grey mr-3"
                                      style={{pointerEvents: "none"}}
                                    ></i>
                                  </td>
                                  <td>{t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_TOOLTIP_2')}</td>
                                </tr>
                                </tbody>
                              </table>
                            </>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </Form>
            </FormikProvider>

            <div className="flex--center" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}>
              <button
                id="tutor-onboarding-step-3"
                onClick={() => handleSubmit(formik.values)}
                disabled={!saveBtnActive}
                className="btn btn--lg btn--primary mt-4">
                {t('REGISTER.NEXT_BUTTON')}
              </button>
            </div>
          </div>
        </div>
        <div className= {`profile-preview-wrapper ${isMobile ? 'mt-10' : ''} `}>
          <TestTutorProfile
            occupation={formik.values.currentOccupation}
            aboutTutor={formik.values.aboutTutor}
            aboutLessons={formik.values.aboutLessons}
            yearsOfExperience={formik.values.yearsOfExperience}
          ></TestTutorProfile>
        </div>
      </div>
    </>
  );
};

export default AdditionalInfoPage;
