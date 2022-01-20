import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import MyTextArea from '../../../components/form/MyTextArea';
import MainWrapper from '../../../components/MainWrapper';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

interface Values {
    aboutUser: string;
    aboutLessons: string;
}

const AdditionalInformation = () => {
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
                <ProfileCompletion />

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
