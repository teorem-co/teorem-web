import {useFormik} from 'formik';
import {isEqual} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {
  useLazyGetProfileProgressQuery,
  useLazyGetTutorByIdQuery,
  useUpdateAditionalInfoMutation,
} from '../../../../services/tutorService';
import RouterPrompt from '../../../components/RouterPrompt';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import toastService from '../../../services/toastService';
import {getUserId} from '../../../utils/getUserId';
import IUpdateAdditionalInfo
  from "../../my-profile/interfaces/IUpdateAdditionalInfo";
import {setMyProfileProgress} from "../../my-profile/slices/myProfileSlice";
import {AiOutlineLeft} from "react-icons/ai";
import CircularProgress from "../../my-profile/components/CircularProgress";
import {setStepTwo} from "../../../../slices/onboardingSlice";
import TestTutorProfile from "./TestTutorProfile";
import UploadFile from "../../../components/form/MyUploadField";

//TODO: update the additional values to only image

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

const ImagePage = ({nextStep, backStep}: AdditionalProps) => {
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

  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const [initialValues, setInitialValues] = useState<IUpdateAdditionalInfo>({
    aboutTutor: '',
    aboutLessons: '',
    yearsOfExperience: null,
    currentOccupation: '',
  });

  const user = useAppSelector((state) => state.auth.user);

  const handleSubmit = async (values: IUpdateAdditionalInfo) => {
    const toSend: IUpdateAdditionalInfo = {
      aboutLessons: values.aboutLessons,
      aboutTutor: values.aboutTutor,
      currentOccupation: values.currentOccupation,
      yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : null,
    };
    await updateAditionalInfo(toSend);
    const progressResponse = await getProfileProgress().unwrap();
    dispatch(setMyProfileProgress(progressResponse));
    setSaveBtnActive(false);
    toastService.success(t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS'));
    dispatch(setStepTwo({
      currentOccupation: values.currentOccupation,
      yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : "",
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
      toastService.error(t('FORM_VALIDATION.WRONG_REQUIREMENTS'));
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
      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
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
      aboutTutor: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      aboutLessons: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      currentOccupation: Yup.string()
        .min(2, t('FORM_VALIDATION.TOO_SHORT'))
        .max(50, t('FORM_VALIDATION.TOO_LONG'))
        .required(t('FORM_VALIDATION.REQUIRED')),
      yearsOfExperience: Yup.number().min(0, t('FORM_VALIDATION.NEGATIVE')).max(100, t('FORM_VALIDATION.TOO_BIG')).nullable(),
    }),
  });


  useEffect(() => {
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
    if (formik.values.aboutLessons.length !== 0 && formik.values.aboutTutor.length !== 0 && formik.values.currentOccupation.length !== 0) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
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
      <div style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "start",
        gridTemplateColumns: "repeat(3, 1fr)"
      }}>
        <div style={{
          gridColumn: "1/3", top: "0", justifyContent: "center",
          alignItems: "center"
        }} className="align--center">
          <div className='flex field__w-fit-content align--center'>
            <div className="flex flex--col flex--jc--center ml-6">
              <div style={{margin: "40px"}} className="flex flex--center">
                <AiOutlineLeft
                  className={`ml-2 mr-6 cur--pointer signup-icon`}
                  color='grey'
                  onClick={backStep}
                />
                <div className="flex flex--center flex--shrink w--105">
                  <CircularProgress
                    progressNumber={profileProgressState.percentage ? profileProgressState.percentage : 0}
                    size={80}/>
                </div>
                <div className="flex flex--col flex--jc--center ml-6">
                  <h4
                    className='signup-title ml-6 text-align--center'>{t('MY_PROFILE.PAYOUTS')}</h4>
                </div>
              </div>
            </div>
          </div>
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
                removePreviewOnUnmount={true}
              />
            </div>
          </div>
          <div>
            <div>Profile Preview</div>
            <TestTutorProfile occupation={formik.values.currentOccupation}
                              aboutTutor={formik.values.aboutTutor}
                              aboutLessons={formik.values.aboutLessons}
                              yearsOfExperience={formik.values.yearsOfExperience}
            ></TestTutorProfile>
          </div>
        </div>
      </div>
      </>
      );
      };

      export default ImagePage;
