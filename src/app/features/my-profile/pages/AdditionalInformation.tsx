import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    useLazyGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
    useUpdateAditionalInfoMutation,
} from '../../../../services/tutorService';
import MyTextArea from '../../../components/form/MyTextArea';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IUpdateAdditionalInfo from '../interfaces/IUpdateAdditionalInfo';

const AdditionalInformation = () => {
    const [
        getProfileProgress,
        {
            data: profileProgress,
            isLoading: progressLoading,
            isUninitialized: progressUninitialized,
        },
    ] = useLazyGetProfileProgressQuery();
    const [
        getProfileData,
        {
            isLoading: isLoadingGetInfo,
            isLoading: dataLoading,
            isUninitialized: dataUninitialized,
        },
    ] = useLazyGetTutorProfileDataQuery();
    const [
        updateAditionalInfo,
        {
            isLoading: isUpdatingInfo,
            isSuccess: isSuccessUpdateInfo,
            status: updateStatus,
        },
    ] = useUpdateAditionalInfoMutation();

    const isLoading = isLoadingGetInfo || isUpdatingInfo;
    const pageLoading =
        progressLoading ||
        dataLoading ||
        progressUninitialized ||
        dataUninitialized;
    const { t } = useTranslation();
    const tutorId = getUserId();

    const [initialValues, setInitialValues] = useState<IUpdateAdditionalInfo>({
        aboutTutor: '',
        aboutLessons: '',
        yearsOfExperience: '',
        currentOccupation: '',
    });
    const [saveBtnActive, setSaveBtnActive] = useState(false);

    const handleSubmit = async (values: IUpdateAdditionalInfo) => {
        await updateAditionalInfo(values);
        setSaveBtnActive(false);
    };

    const handleChangeForSave = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    const handleUpdateOnRouteChange = () => {
        handleSubmit(formik.values);
        return true;
    };

    const fetchData = async () => {
        if (tutorId) {
            const profileDataResponse = await getProfileData(tutorId).unwrap();

            if (profileDataResponse) {
                const values = {
                    aboutTutor: profileDataResponse.aboutTutor,
                    aboutLessons: profileDataResponse.aboutLessons,
                    yearsOfExperience: profileDataResponse.yearsOfExperience,
                    currentOccupation: profileDataResponse.currentOccupation,
                };
                setInitialValues(values);
            }

            getProfileProgress();
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
            yearsOfExperience: Yup.number()
                .min(0, 'Can`t be a negative number')
                .max(100, 'number is too big'),
        }),
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (updateStatus === QueryStatus.fulfilled) {
            getProfileProgress();
        }
    }, [updateStatus]);

    useEffect(() => {
        if (isSuccessUpdateInfo) {
            if (tutorId) {
                getProfileData(tutorId);
            }
            toastService.success(
                t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS')
            );
        }
    }, [isSuccessUpdateInfo]);

    useEffect(() => {
        handleChangeForSave();
    }, [formik.values]);

    return (
        <MainWrapper>
            <RouterPrompt
                when={saveBtnActive}
                onOK={handleUpdateOnRouteChange}
                onCancel={() => {
                    //if you pass "false" router will be blocked and you will stay on the current page
                    return true;
                }}
            />
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgress?.generalAvailability}
                    aditionalInformation={profileProgress?.aboutMe}
                    myTeachings={profileProgress?.myTeachings}
                    percentage={profileProgress?.percentage}
                />

                {/* ADDITIONAL INFO */}
                <FormikProvider value={formik}>
                    <Form>
                        {pageLoading || (
                            <div className="card--profile__section">
                                <div>
                                    <div className="mb-2 type--wgt--bold">
                                        {t(
                                            'SEARCH_TUTORS.TUTOR_PROFILE.ADDITIONAL_INFORMATION_TITLE'
                                        )}
                                    </div>
                                    <div className="type--color--tertiary w--200--max">
                                        {t(
                                            'SEARCH_TUTORS.TUTOR_PROFILE.ADDITIONAL_INFORMATION_DESC'
                                        )}
                                    </div>
                                    {saveBtnActive ? (
                                        <button
                                            className="btn btn--primary btn--lg mt-6"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {t(
                                                'SEARCH_TUTORS.TUTOR_PROFILE.FORM.SUBMIT_BTN'
                                            )}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="w--800--max">
                                    <div className="row">
                                        <div className="col col-12 col-xl-6">
                                            <div className="field">
                                                <label
                                                    className="field__label"
                                                    htmlFor="currentOccupation"
                                                >
                                                    Your current Occupation*
                                                </label>
                                                <TextField
                                                    id="currentOccupation"
                                                    wrapperClassName="flex--grow"
                                                    name="currentOccupation"
                                                    placeholder="What’s your current Occupation"
                                                    className="input input--base"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12 col-xl-6">
                                            <div className="field">
                                                <label
                                                    className="field__label"
                                                    htmlFor="yearsOfExperience"
                                                >
                                                    Years of professional
                                                    experience (optional)
                                                </label>
                                                <TextField
                                                    id="yearsOfExperience"
                                                    wrapperClassName="flex--grow"
                                                    name="yearsOfExperience"
                                                    placeholder="How many years of professional experience you have"
                                                    className="input input--base"
                                                    type={'number'}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12 col-xl-6">
                                            <div className="field">
                                                <label
                                                    className="field__label"
                                                    htmlFor="aboutTutor"
                                                >
                                                    {t(
                                                        'SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_LABEL'
                                                    )}
                                                </label>
                                                <MyTextArea
                                                    maxLength={2500}
                                                    name="aboutTutor"
                                                    placeholder={t(
                                                        'SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_PLACEHOLDER'
                                                    )}
                                                    id="aboutTutor"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12 col-xl-6">
                                            <div className="field">
                                                <label
                                                    className="field__label"
                                                    htmlFor="aboutLessons"
                                                >
                                                    {t(
                                                        'SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_LABEL'
                                                    )}
                                                </label>
                                                <MyTextArea
                                                    maxLength={2500}
                                                    name="aboutLessons"
                                                    placeholder={t(
                                                        'SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_PLACEHOLDER'
                                                    )}
                                                    id="aboutLessons"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Form>
                </FormikProvider>
            </div>
        </MainWrapper>
    );
};

export default AdditionalInformation;
