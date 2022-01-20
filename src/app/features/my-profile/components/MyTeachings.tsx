import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import MyTextField from '../../../components/form/MyTextField';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import Sidebar from '../../../components/Sidebar';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

interface Values {
    occupation: string;
    yearsOfExperience: string;
}

const MyTeachings = () => {
    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [editSidebarOpen, setEditSidebarOpen] = useState(false);

    const initialValues: Values = {
        occupation: '',
        yearsOfExperience: '',
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
            occupation: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    useEffect(() => {
        console.log(formik.values);
    }, [formik.values]);

    const handleAddSubject = () => {
        //add subject submit
    };

    const closeAddSubjectSidebar = () => {
        setAddSidebarOpen(false);
    };

    const handleEditSubject = () => {
        //add subject submit
    };

    const closeEditSubjectSidebar = () => {
        setEditSidebarOpen(false);
    };

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion />

                {/* MY TEACHINGS */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">My teachings</div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your teaching information
                        </div>
                    </div>
                    <div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="occupation"
                                    >
                                        Tell us more about yourself*
                                    </label>
                                    <TextField
                                        id="occupation"
                                        wrapperClassName="flex--grow"
                                        name="occupation"
                                        placeholder="Your current occupation*"
                                        className="input input--base"
                                        withoutErr={
                                            formik.errors.occupation &&
                                            formik.touched.occupation
                                                ? false
                                                : true
                                        }
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="aboutLessons"
                                    >
                                        Years of professional experience
                                        (optional)
                                    </label>
                                    <TextField
                                        id="aboutLessons"
                                        wrapperClassName="flex--grow"
                                        name="yearsOfExperience"
                                        placeholder="Enter your phone number"
                                        className="input input--base"
                                        withoutErr={
                                            formik.errors.yearsOfExperience &&
                                            formik.touched.yearsOfExperience
                                                ? false
                                                : true
                                        }
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
                <button onClick={() => setAddSidebarOpen(true)}>
                    Add subject
                </button>
                <button onClick={() => setEditSidebarOpen(true)}>
                    Edit subject
                </button>
            </div>
            <Sidebar
                cancelLabel="Delete"
                submitLabel="Save information"
                sideBarIsOpen={addSidebarOpen}
                closeSidebar={closeAddSubjectSidebar}
                onSubmit={handleAddSubject}
                title="ADD NEW SUBJECT"
            >
                <div>TESSSTTTT</div>
            </Sidebar>
            <Sidebar
                cancelLabel="Delete"
                submitLabel="Save information"
                sideBarIsOpen={editSidebarOpen}
                closeSidebar={closeEditSubjectSidebar}
                onSubmit={handleEditSubject}
                title="EDIT SUBJECT DETAILS"
            >
                <div>TESSSTTTT</div>
            </Sidebar>
        </MainWrapper>
    );
};

export default MyTeachings;
