import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    useGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
    useUpdateAditionalInfoMutation,
} from '../../../../services/tutorService';
import MyTextArea from '../../../components/form/MyTextArea';
import MainWrapper from '../../../components/MainWrapper';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';

interface Values {
    aboutTutor: string;
    aboutLessons: string;
}

const AdditionalInformation = () => {
    const { data: profileProgress } = useGetProfileProgressQuery();

    const { t } = useTranslation();

    const tutorId = getUserId();

    const [
        getProfileData,
        {
            data: additionalInfoData,
            isSuccess: isSuccessGetInfo,
            isLoading: isLoadingGetInfo,
        },
    ] = useLazyGetTutorProfileDataQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                aboutTutor: data?.aboutTutor,
                aboutLessons: data?.aboutLessons,
            },
            isSuccess,
            isLoading,
        }),
    });

    const [initialValues, setInitialValues] = useState<Values>({
        aboutTutor: '',
        aboutLessons: '',
    });

    const [
        updateAditionalInfo,
        { isLoading: isUpdatingInfo, isSuccess: isSuccessUpdateInfo },
    ] = useUpdateAditionalInfoMutation();

    const handleSubmit = (values: Values) => {
        updateAditionalInfo(values);
    };

    useEffect(() => {
        if (tutorId) {
            getProfileData(tutorId);
        }
    }, []);

    useEffect(() => {
        if (
            isSuccessGetInfo &&
            additionalInfoData.aboutLessons &&
            additionalInfoData.aboutTutor
        ) {
            const values = {
                aboutTutor: additionalInfoData.aboutTutor,
                aboutLessons: additionalInfoData.aboutLessons,
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
        }),
    });

    const isLoading = isLoadingGetInfo || isUpdatingInfo;

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion percentage={profileProgress?.percentage} />

                {/* ADDITIONAL INFO */}
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
                    </div>
                    <div>
                        <FormikProvider value={formik}>
                            <Form>
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
                                <button
                                    className="btn btn--primary btn--lg"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {t(
                                        'SEARCH_TUTORS.TUTOR_PROFILE.FORM.SUBMIT_BTN'
                                    )}
                                </button>
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default AdditionalInformation;
