import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { useGetProfileProgressQuery } from '../../../../services/tutorService';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import AddSubjectSidebar from '../components/AddSubjectSidebar';
import EditSubjectSidebar from '../components/EditSubjectSidebar';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';

interface Values {
    occupation: string;
    yearsOfExperience: string;
}

const MyTeachings = () => {
    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [editSidebarOpen, setEditSidebarOpen] = useState(false);

    const { data: profileProgress } = useGetProfileProgressQuery();

    const history = useHistory();

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
                <FormikProvider value={formik}>
                    <Form>
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
                                {/* Text Fields */}
                                <div className="row">
                                    <div className="col col-12 col-xl-6">
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
                                </div>
                            </div>
                        </div>
                        <div className="card--profile__section">
                            {/* Add subject */}
                            <div>
                                <div className="mb-2 type--wgt--bold">
                                    Card details
                                </div>
                                <div className="type--color--tertiary w--200--max">
                                    Select default payment method or add
                                    new one.
                                </div>
                            </div>
                            <div>
                                <div className="dash-wrapper flex--grow">
                                    <div className="dash-wrapper__item">
                                        <div
                                            className="dash-wrapper__item__element"
                                            onClick={() =>
                                                setAddSidebarOpen(true)
                                            }
                                        >
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
                                    {/* Test fields */}
                                    <div className="dash-wrapper__item">
                                        <div
                                            className="dash-wrapper__item__element"
                                            onClick={() => {
                                                history.push(
                                                    '?level=d696d5b3-ffec-4b76-91d7-6413ca217e84&subject=5d205fc3-0d05-4a1e-81d5-4dd216dd6204&price=312'
                                                );
                                                setEditSidebarOpen(true);
                                            }}
                                        >
                                            <div className="flex--primary cur--pointer">
                                                <div>
                                                    <div className="type--wgt--bold">
                                                        English
                                                    </div>
                                                    <div>A level, IB</div>
                                                </div>
                                                <div>
                                                    <i className="icon icon--base icon--edit icon--primary"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dash-wrapper__item">
                                        <div
                                            className="dash-wrapper__item__element"
                                            onClick={() => {
                                                history.push(
                                                    '?level=xsdsadsadsadsada&subject=42342432432&price=22222'
                                                );
                                                setEditSidebarOpen(true);
                                            }}
                                        >
                                            <div className="flex--primary cur--pointer">
                                                <div>
                                                    <div className="type--wgt--bold">
                                                        History
                                                    </div>
                                                    <div>University</div>
                                                </div>
                                                <div>
                                                    <i className="icon icon--base icon--edit icon--primary"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn--primary btn--lg mt-6"
                                    type="submit"
                                >
                                    Save
                                </button>

                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
            <EditSubjectSidebar
                sideBarIsOpen={editSidebarOpen}
                closeSidebar={closeEditSubjectSidebar}
            />
            <AddSubjectSidebar
                sideBarIsOpen={addSidebarOpen}
                closeSidebar={closeAddSubjectSidebar}
            />
        </MainWrapper>
    );
};

export default MyTeachings;
