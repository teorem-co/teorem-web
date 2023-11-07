import {Form, FormikProvider, useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {
  useLazyGetProfileProgressQuery,
  useLazyGetTutorByIdQuery,
  useUpdateAditionalInfoMutation,
} from '../../../../services/tutorService';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import toastService from '../../../services/toastService';
import {getUserId} from '../../../utils/getUserId';
import {setMyProfileProgress} from "../../my-profile/slices/myProfileSlice";
import {AiOutlineLeft} from "react-icons/ai";
import CircularProgress from "../../my-profile/components/CircularProgress";
import TestTutorProfile from "./TestTutorProfile";
import UploadFile from "../../../components/form/MyUploadField";
import {
  useLazyGetUserQuery,
  useUpdateUserInformationMutation,
} from '../../../../services/userService';
import moment from 'moment/moment';
import imageCompression from "browser-image-compression";

//TODO: update the additional values to only image

interface Values {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  countryId: string;
  profileImage: string;
}

type AdditionalProps = {
  nextStep: () => void,
  backStep: () => void
};

const ImagePage = ({nextStep, backStep}: AdditionalProps) => {
  const state = useAppSelector((state) => state.onboarding);
  const { yearsOfExperience, currentOccupation, aboutYou,aboutYourLessons } = state;


  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getProfileData, {
    isLoading: isLoadingGetInfo,
    isLoading: dataLoading,
    isUninitialized: dataUninitialized
  }] =
    useLazyGetTutorByIdQuery();

  const [getUser, {
    isLoading: isLoadingUser,
    isUninitialized: userUninitialized,
    isFetching: userFetching
  }] = useLazyGetUserQuery();

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

  const [updateUserInformation, {isLoading: isLoadingUserUpdate}] = useUpdateUserInformationMutation();


  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const [initialValues, setInitialValues] = useState<Values>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    countryId: '',
    profileImage: '',
  });

  const user = useAppSelector((state) => state.auth.user);

  const handleSubmit = async (values: Values) => {
    const toSend: any = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      countryId: values.countryId,
      dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'),
    };

    if (typeof values.profileImage === 'string') {
      delete toSend.profileImage;
    }else {
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      };
      toSend['profileImage'] = await imageCompression(values.profileImage, options);
    }

    await updateUserInformation(toSend);

    //hide save button
    setInitialValues(values);
    nextStep();
    setSaveBtnActive(false);
  };

  const fetchData = async () => {
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
        setInitialValues(values);
      }
      //If there is no state in redux for profileProgress fetch data and save result to redux
      const progressResponse = await getProfileProgress().unwrap();
      setProgressPercentage(progressResponse.percentage);
      dispatch(setMyProfileProgress(progressResponse));

      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
        setProgressPercentage(progressResponse.percentage);
        dispatch(setMyProfileProgress(progressResponse));
      }

      if(userResponse.profileImage) {
        setSaveBtnActive(true);
      }
    }
  };

  const handleChangeForSave = () => {
    if(formik.values.profileImage) {
      setSaveBtnActive(true);
    }
  };

  const handleUpdateOnRouteChange = () => {
    if (Object.keys(formik.errors).length > 0) {
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

  const generateValidation = () => {
    const validation: any = {};

    validation['profileImage'] = Yup.mixed()
      .required(t('FORM_VALIDATION.REQUIRED'))
      .test('profileImage', t('FORM_VALIDATION.IMAGE_TYPE'), (value) => {
        if (typeof value === 'string') {
          return true;
        } else {
          if (value.type === 'image/jpg' || value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/svg') {
            setSaveBtnActive(true);
            return true;
          }
          setSaveBtnActive(false);
          return false;
        }
      })
      .test('profileImage', t('FORM_VALIDATION.IMAGE_SIZE'), (value) => {
        if (typeof value === 'string') {
          return true;
        } else {
          if (value.size > 5000000) {
            setSaveBtnActive(false);
            return false;
          }

          setSaveBtnActive(true);
          return true;
        }
      });

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
    window.scrollTo({top:0, left:0, behavior:'smooth'});
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

  const isMobile = window.innerWidth < 765;

  const { file } = useAppSelector((state) => state.uploadFile);

  const [image, setImage] = useState('');

  function setImagePreview(preivewPath: string){
    setImage(preivewPath);
  }

  return (
    <>
      <div className="subject-form-container flex--jc--space-around">
        <FormikProvider value={formik}>
          <Form>
            <div>
              <div
                style={{
                gridColumn: "1/3", top: "0", justifyContent: "center",
                alignItems: "center"
                }}
                className="align--center m-2">
                <div className='flex field__w-fit-content align--center'>
                  <div className="flex flex--col flex--jc--center ">
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
                          <h4 className='signup-title ml-6 text-align--center'>{t('MY_PROFILE.IMAGE')}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w--680--max align--center">
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
                      removePreviewOnUnmount={true}
                      setPreview={setImagePreview}
                    />
                  </div>

                  <div className="field__w-fit-content type--base align--center">
                    <table className={`text-align--start password-tooltip`} style={{color: "#636363", fontSize: "15px"}}>
                      <tbody>
                      <tr>
                        <td>
                          <i
                            id="length"
                            className="icon icon--base icon--chevron-right icon--grey mr-3"
                          ></i>
                        </td>
                        <td>{t('TUTOR_ONBOARDING.IMAGE_TIPS.TIP_1')}</td>
                      </tr>
                      <tr>
                        <td>
                          <i
                            id="length"
                            className="icon icon--base icon--chevron-right icon--grey mr-3"
                          ></i>
                        </td>
                        <td>{t('TUTOR_ONBOARDING.IMAGE_TIPS.TIP_2')}</td>
                      </tr>
                      <tr>
                        <td>
                          <i
                            id="letter"
                            className="icon icon--base icon--chevron-right icon--grey mr-3"
                          ></i>
                        </td>
                        <td>{t('TUTOR_ONBOARDING.IMAGE_TIPS.TIP_3')}</td>
                      </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

                <div className="flex flex--jc--center text-align--center">

                  <div className='flex flex--col'>
                    <button
                      id="tutor-onboarding-step-4"
                      onClick={() => handleSubmit(formik.values)}
                            disabled={!saveBtnActive}
                            className="btn btn--lg btn--primary mt-4 align--center">
                      {t('REGISTER.NEXT_BUTTON')}
                    </button>

                  </div>
                </div>

              </div>
            </div>

          </Form>
        </FormikProvider>

        <div className="profile-preview-wrapper m-1">
          <TestTutorProfile
            // profileImage={formik.values.profileImage}
            profileImage={image}
            occupation={currentOccupation}
            aboutTutor={aboutYou}
            aboutLessons={aboutYourLessons}
            yearsOfExperience={yearsOfExperience}
          ></TestTutorProfile>
        </div>
      </div>
      </>
      );
};

      export default ImagePage;
