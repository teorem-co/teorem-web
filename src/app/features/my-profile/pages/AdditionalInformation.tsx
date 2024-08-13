import { Field, Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    ITutorVideoInformation,
    useLazyGetProfileProgressQuery,
    useLazyGetTutorByIdQuery,
    useLazyGetTutorVideoInformationQuery,
    useUpdateAditionalInfoMutation,
} from '../../../store/services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import toastService from '../../../store/services/toastService';
import { getUserId } from '../../../utils/getUserId';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IUpdateAdditionalInfo from '../interfaces/IUpdateAdditionalInfo';
import { setMyProfileProgress } from '../../../store/slices/myProfileSlice';
import { TextField } from '@mui/material';
import { RoleOptions } from '../../../store/slices/roleSlice';
import { VideoPreviewUpload } from '../VideoRecorder/VideoPreviewUpload';
import { UploadedVideoComponent } from '../VideoRecorder/UploadedVideoComponent';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

const AdditionalInformation = () => {
    const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';

    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getProfileData, { isLoading: isLoadingGetInfo, isLoading: dataLoading, isUninitialized: dataUninitialized }] = useLazyGetTutorByIdQuery();
    const [updateAditionalInfo, { isLoading: isUpdatingInfo, isSuccess: isSuccessUpdateInfo }] = useUpdateAditionalInfoMutation();
    const [getVideoInformation, { isLoading: isLoadingGetVideoInformation }] = useLazyGetTutorVideoInformationQuery();

    const [showVideoSection, setShowVideoSection] = useState(false);
    const [videoInformation, setVideoInformation] = useState<ITutorVideoInformation>({
        url: undefined,
        approved: undefined,
        videoTranscoded: false,
    });
    const isLoading = isLoadingGetInfo || isUpdatingInfo;
    const pageLoading = dataLoading || dataUninitialized;
    const { t } = useTranslation();
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

            const videoInfo = await getVideoInformation().unwrap();
            setShowVideoSection(true);
            setVideoInformation({
                ...videoInfo,
            });
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
                <ProfileHeader className="mb-1" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgressState.generalAvailability}
                    additionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
                    payment={profileProgressState.payment}
                />

                {/* ADDITIONAL INFO */}
                <FormikProvider value={formik}>
                    <Form>
                        {(pageLoading && <LoaderPrimary />) || (
                            <div className="card--profile__section">
                                <div>
                                    <div className="mb-2 type--wgt--bold">{t('SEARCH_TUTORS.TUTOR_PROFILE.ADDITIONAL_INFORMATION_TITLE')}</div>
                                    <div className="type--color--tertiary w--200--max">
                                        {t('SEARCH_TUTORS.TUTOR_PROFILE.ADDITIONAL_INFORMATION_DESC')}
                                    </div>
                                    {saveBtnActive ? (
                                        <ButtonPrimaryGradient className="btn btn--lg mt-6 type--wgt--extra-bold" type="submit" disabled={isLoading}>
                                            {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.SUBMIT_BTN')}
                                        </ButtonPrimaryGradient>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="w--800--max">
                                    <div className="row">
                                        <div className="col col-12 col-xl-6">
                                            <div className="field align--center mb-5">
                                                <Field
                                                    as={TextField}
                                                    name="currentOccupation"
                                                    type="text"
                                                    fullWidth
                                                    id="currentOccupation"
                                                    label={t('MY_PROFILE.ABOUT_ME.OCCUPATION')}
                                                    variant="outlined"
                                                    color="secondary"
                                                    error={formik.touched.currentOccupation && !!formik.errors.currentOccupation}
                                                    helperText={formik.touched.currentOccupation && formik.errors.currentOccupation}
                                                    InputProps={{
                                                        style: {
                                                            fontFamily: "'Lato', sans-serif",
                                                            backgroundColor: 'white',
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        style: { fontFamily: "'Lato', sans-serif" },
                                                    }}
                                                    FormHelperTextProps={{
                                                        style: { color: 'red' }, // Change the color of the helper text here
                                                    }}
                                                    inputProps={{
                                                        maxLength: 75,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12 col-xl-6">
                                            <div className="field align--center mb-5">
                                                <Field
                                                    as={TextField}
                                                    name="yearsOfExperience"
                                                    type="text"
                                                    fullWidth
                                                    id="yearsOfExperience"
                                                    label={t('MY_PROFILE.ABOUT_ME.YEARS')}
                                                    variant="outlined"
                                                    color="secondary"
                                                    error={formik.touched.yearsOfExperience && !!formik.errors.yearsOfExperience}
                                                    helperText={formik.touched.yearsOfExperience && formik.errors.yearsOfExperience}
                                                    InputProps={{
                                                        style: {
                                                            fontFamily: "'Lato', sans-serif",
                                                            backgroundColor: 'white',
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        style: { fontFamily: "'Lato', sans-serif" },
                                                    }}
                                                    FormHelperTextProps={{
                                                        style: { color: 'red' },
                                                    }}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                                        if (
                                                            e.key === 'Backspace' ||
                                                            e.key === 'Delete' ||
                                                            e.key === 'ArrowLeft' ||
                                                            e.key === 'ArrowRight' ||
                                                            e.key.match(/[0-9]/)
                                                        ) {
                                                            // let these keys work
                                                        } else {
                                                            // prevent other keys
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12">
                                            <div className="field align--center mb-5">
                                                <Field
                                                    as={TextField}
                                                    name="aboutTutor"
                                                    type="text"
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    id="aboutTutor"
                                                    error={formik.touched.aboutTutor && !!formik.errors.aboutTutor}
                                                    helperText={formik.touched.aboutTutor && formik.errors.aboutTutor}
                                                    InputProps={{
                                                        style: {
                                                            fontFamily: "'Lato', sans-serif",
                                                            backgroundColor: 'white',
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        style: { fontFamily: "'Lato', sans-serif" },
                                                    }}
                                                    FormHelperTextProps={{
                                                        style: { color: 'red' }, // Change the color of the helper text here
                                                    }}
                                                    inputProps={{
                                                        maxLength: 2500,
                                                    }}
                                                    label={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_LABEL')}
                                                    variant="outlined"
                                                    color="secondary"
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12">
                                            <div className="field align--center mb-5">
                                                <Field
                                                    as={TextField}
                                                    name="aboutLessons"
                                                    type="text"
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    error={formik.touched.aboutLessons && !!formik.errors.aboutLessons}
                                                    helperText={formik.touched.aboutLessons && formik.errors.aboutLessons}
                                                    InputProps={{
                                                        style: {
                                                            fontFamily: "'Lato', sans-serif",
                                                            backgroundColor: 'white',
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        style: { fontFamily: "'Lato', sans-serif" },
                                                    }}
                                                    FormHelperTextProps={{
                                                        style: { color: 'red' }, // Change the color of the helper text here
                                                    }}
                                                    inputProps={{
                                                        maxLength: 2500,
                                                    }}
                                                    id="aboutLessons"
                                                    label={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_LABEL')}
                                                    variant="outlined"
                                                    color="secondary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Form>
                </FormikProvider>
                <div className="card--profile__section"></div>
                {userRole === RoleOptions.Tutor && (
                    <div className="card--profile__section">
                        <div>
                            <p className={'mb-2 type--wgt--bold'}>{t('VIDEO_PREVIEW.TITLE')}</p>
                        </div>

                        {!showVideoSection ? (
                            <LoaderPrimary />
                        ) : videoInformation.url ? (
                            <UploadedVideoComponent fetchData={fetchData} videoInformation={videoInformation} />
                        ) : (
                            <VideoPreviewUpload fetchData={fetchData} />
                        )}
                    </div>
                )}
            </div>
        </MainWrapper>
    );
};

export default AdditionalInformation;
