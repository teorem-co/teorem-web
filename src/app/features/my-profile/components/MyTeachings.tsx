import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useGetProfileProgressQuery } from '../../../../services/tutorService';
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

    const { data: profileProgress } = useGetProfileProgressQuery();

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
            yearsOfExperience: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
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
                <ProfileCompletion percentage={profileProgress?.percentage} />

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
                                {/* Text Fields */}
                                <div className="flex">
                                    <div className="field">
                                        <label
                                            className="field__label"
                                            htmlFor="occupation"
                                        >
                                            Your current occupation*
                                        </label>
                                        <TextField
                                            id="occupation"
                                            wrapperClassName="flex--grow"
                                            name="occupation"
                                            placeholder="What’s your current occupation"
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
                                            withoutErr={
                                                formik.errors
                                                    .yearsOfExperience &&
                                                formik.touched.yearsOfExperience
                                                    ? false
                                                    : true
                                            }
                                        />
                                    </div>
                                </div>
                                {/* Add subject */}
                                <div className="flex">
                                    <div>
                                        <div className="mb-2 type--wgt--bold">
                                            Card details
                                        </div>
                                        <div className="type--color--tertiary w--200--max">
                                            Select default payment method or add
                                            new one.
                                        </div>
                                    </div>
                                    <div className="dash-wrapper flex--grow">
                                        <div className="dash-wrapper__item">
                                            <div className="dash-wrapper__item__element">
                                                <div className="flex--primary cur--pointer">
                                                    <div>
                                                        <div className="type--wgt--bold">
                                                            Add new Subject
                                                        </div>
                                                        <div>
                                                            Select to add new
                                                            Subject
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <i className="icon icon--base icon--plus icon--primary"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Map through subjects here */}
                                    </div>
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
