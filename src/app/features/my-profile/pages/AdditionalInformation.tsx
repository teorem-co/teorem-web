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
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import IUpdateAdditionalInfo from '../interfaces/IUpdateAdditionalInfo';

const AdditionalInformation = () => {
    const [getProfileProgress, { data: profileProgress }] =
        useLazyGetProfileProgressQuery();

    const { t } = useTranslation();

    const tutorId = getUserId();

    const [
        getProfileData,
        {
            data: additionalInfoData,
            isSuccess: isSuccessGetInfo,
            isLoading: isLoadingGetInfo,
        },
    ] = useLazyGetTutorProfileDataQuery();

    const [initialValues, setInitialValues] = useState<IUpdateAdditionalInfo>({
        aboutTutor: '',
        aboutLessons: '',
        yearsOfExperience: '',
        currentOccupation: '',
    });
    const [saveBtnActive, setSaveBtnActive] = useState(false);

    const [
        updateAditionalInfo,
        {
            isLoading: isUpdatingInfo,
            isSuccess: isSuccessUpdateInfo,
            status: updateStatus,
        },
    ] = useUpdateAditionalInfoMutation();

    const handleSubmit = (values: IUpdateAdditionalInfo) => {
        updateAditionalInfo(values);
        setSaveBtnActive(false);
    };

    useEffect(() => {
        if (tutorId) {
            getProfileData(tutorId);
            getProfileProgress();
        }
    }, []);

    useEffect(() => {
        if (updateStatus === QueryStatus.fulfilled) {
            getProfileProgress();
        }
    }, [updateStatus]);

    useEffect(() => {
        if (isSuccessGetInfo && additionalInfoData) {
            const values = {
                aboutTutor: additionalInfoData.aboutTutor,
                aboutLessons: additionalInfoData.aboutLessons,
                yearsOfExperience: additionalInfoData.yearsOfExperience,
                currentOccupation: additionalInfoData.currentOccupation,
            };
            setInitialValues(values);
        }
    }, [isSuccessGetInfo]);

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

    const handleChangeForSave = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    useEffect(() => {
        handleChangeForSave();
    }, [formik.values]);

    const isLoading = isLoadingGetInfo || isUpdatingInfo;

    return (
        <MainWrapper>
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
                                                Years of professional experience
                                                (optional)
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
                    </Form>
                </FormikProvider>
            </div>
        </MainWrapper>
    );
};

export default AdditionalInformation;
