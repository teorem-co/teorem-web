import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useGetProfileProgressQuery } from '../../../../services/tutorService';
import MyTextArea from '../../../components/form/MyTextArea';
import MainWrapper from '../../../components/MainWrapper';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';

interface Values {
    aboutUser: string;
    aboutLessons: string;
}

const AdditionalInformation = () => {
    const { data: profileProgress } = useGetProfileProgressQuery();

    const initialValues: Values = {
        aboutUser: '',
        aboutLessons: '',
    };

    const { t } = useTranslation();

    const handleSubmit = (values: Values) => {
        const test = values;
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            aboutUser: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            aboutLessons: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

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
                            Additional information
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your additional information
                        </div>
                    </div>
                    <div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="aboutUser"
                                    >
                                        Tell us more about yourself*
                                    </label>
                                    <MyTextArea
                                        maxLength={2500}
                                        name="aboutUser"
                                        placeholder="What describes you best, what are your hobbies, approach..."
                                        id="aboutUser"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="aboutLessons"
                                    >
                                        Tell us more about your lessons**
                                    </label>
                                    <MyTextArea
                                        maxLength={2500}
                                        name="aboutLessons"
                                        placeholder="Describe your lessons, approach, way of teaching..."
                                        id="aboutLessons"
                                    />
                                </div>
                                <button
                                    className="btn btn--primary btn--lg"
                                    type="submit"
                                >
                                    Save
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
