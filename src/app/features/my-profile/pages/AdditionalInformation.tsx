import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useLazyGetProfileProgressQuery, useLazyGetTutorProfileDataQuery, useUpdateAditionalInfoMutation } from '../../../../services/tutorService';
import MyTextArea from '../../../components/form/MyTextArea';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IUpdateAdditionalInfo from '../interfaces/IUpdateAdditionalInfo';
import { setMyProfileProgress } from '../slices/myProfileSlice';

const AdditionalInformation = () => {
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getProfileData, { isLoading: isLoadingGetInfo, isLoading: dataLoading, isUninitialized: dataUninitialized }] =
        useLazyGetTutorProfileDataQuery();
    const [updateAditionalInfo, { isLoading: isUpdatingInfo, isSuccess: isSuccessUpdateInfo }] = useUpdateAditionalInfoMutation();

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
            console.log(formik.errors);
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
                    generalAvailability={profileProgressState.generalAvailability}
                    aditionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
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
                                        <button className="btn btn--primary btn--lg mt-6 type--wgt--extra-bold" type="submit" disabled={isLoading}>
                                            {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.SUBMIT_BTN')}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="w--800--max">
                                    <div className="row">
                                        <div className="col col-12 col-xl-6">
                                            <div className="field">
                                                <label className="field__label" htmlFor="currentOccupation">
                                                    {t('MY_PROFILE.ABOUT_ME.OCCUPATION')}
                                                </label>
                                                <TextField
                                                    maxLength={50}
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
                                                <label className="field__label" htmlFor="yearsOfExperience">
                                                    {t('MY_PROFILE.ABOUT_ME.YEARS')}
                                                </label>
                                                <TextField
                                                    maxLength={50}
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
                                                <label className="field__label" htmlFor="aboutTutor">
                                                    {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_LABEL')}
                                                </label>
                                                <MyTextArea
                                                    maxLength={2500}
                                                    name="aboutTutor"
                                                    placeholder={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_PLACEHOLDER')}
                                                    id="aboutTutor"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <div className="col col-12">
                                            <div className="field">
                                                <label className="field__label" htmlFor="aboutLessons">
                                                    {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_LABEL')}
                                                </label>
                                                <MyTextArea
                                                    maxLength={2500}
                                                    name="aboutLessons"
                                                    placeholder={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_PLACEHOLDER')}
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
