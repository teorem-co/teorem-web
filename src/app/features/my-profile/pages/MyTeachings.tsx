import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
    useGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
    useUpdateMyTeachingsMutation,
} from '../../../../services/tutorService';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import AddSubjectSidebar from '../components/AddSubjectSidebar';
import EditSubjectSidebar from '../components/EditSubjectSidebar';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import SubjectList from '../components/SubjectList';

interface Values {
    occupation: string;
    yearsOfExperience: string;
}

const MyTeachings = () => {
    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [editSidebarOpen, setEditSidebarOpen] = useState(false);
    const [saveBtnActive, setSaveBtnActive] = useState(false);
    const [rerender, setRerender] = useState<boolean>(false);

    const { data: profileProgress } = useGetProfileProgressQuery();

    const tutorId = getUserId();

    const { t } = useTranslation();

    const [
        getProfileData,
        {
            data: myTeachingsData,
            isSuccess: isSuccessMyTeachings,
            isLoading: isLoadingMyTeachings,
        },
    ] = useLazyGetTutorProfileDataQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                occupation: data?.currentOccupation,
                yearsOfExperience: data?.yearsOfExperience,
                tutorSubjects: data?.TutorSubjects,
            },
            isSuccess,
            isLoading,
        }),
    });

    const [
        updateMyTeachings,
        {
            isSuccess: isSuccessUpdateMyTeachings,
            isLoading: isUpdatingMyTeachings,
        },
    ] = useUpdateMyTeachingsMutation();

    const isLoading = isLoadingMyTeachings || isUpdatingMyTeachings;

    useEffect(() => {
        if (tutorId) {
            getProfileData(tutorId);
        }
    }, []);

    useEffect(() => {
        if (
            isSuccessMyTeachings &&
            myTeachingsData.occupation &&
            myTeachingsData.yearsOfExperience
        ) {
            const values = {
                occupation: myTeachingsData.occupation,
                yearsOfExperience: myTeachingsData.yearsOfExperience,
            };
            setInitialValues(values);
        }
    }, [isSuccessMyTeachings]);

    useEffect(() => {
        if (isSuccessUpdateMyTeachings) {
            if (tutorId) {
                getProfileData(tutorId);
            }
            toastService.success(
                t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_TEACHINGS_SUCCESS')
            );
        }
    }, [isSuccessUpdateMyTeachings]);

    const history = useHistory();

    const [initialValues, setInitialValues] = useState<Values>({
        occupation: '',
        yearsOfExperience: '',
    });

    const handleSubmit = (values: Values) => {
        const updateValues = {
            currentOccupation: values.occupation,
            yearsOfExperience: values.yearsOfExperience,
        };
        updateMyTeachings(updateValues);
    };

    const handleChangeForSave = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            occupation: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            yearsOfExperience: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
        }),
    });

    useEffect(() => {
        handleChangeForSave();
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

    const handleSendId = (subjectId: string) => {
        history.push(`?subjectId=${subjectId}`);
        setEditSidebarOpen(true);
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
                        <ProfileCompletion
                            percentage={profileProgress?.percentage}
                        />

                        {/* MY TEACHINGS */}
                        <div className="card--profile__section">
                            <div>
                                <div className="mb-2 type--wgt--bold">
                                    My teachings
                                </div>
                                <div className="type--color--tertiary w--200--max">
                                    Edit and update your teaching information
                                </div>
                                <button
                                    className={`btn btn--primary btn--lg mt-6 card--profile__savebtn`}
                                    type="submit"
                                    disabled={isLoading || !saveBtnActive}
                                >
                                    Save
                                </button>
                            </div>
                            <div className="w--800--max">
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
                                                withoutErr={
                                                    formik.errors
                                                        .yearsOfExperience &&
                                                    formik.touched
                                                        .yearsOfExperience
                                                        ? false
                                                        : true
                                                }
                                                disabled={isLoading}
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
                                    My Subjects
                                </div>
                                <div className="type--color--tertiary w--200--max">
                                    Edit and update your subjects information
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
                                    <SubjectList
                                        handleSendId={handleSendId}
                                        tutorSubjects={
                                            myTeachingsData.tutorSubjects
                                                ? myTeachingsData.tutorSubjects
                                                : []
                                        }
                                        key={
                                            myTeachingsData.tutorSubjects
                                                ?.length
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
            <EditSubjectSidebar
                sideBarIsOpen={editSidebarOpen}
                closeSidebar={closeEditSubjectSidebar}
                handleGetData={() => getProfileData(tutorId ? tutorId : '')}
            />
            <AddSubjectSidebar
                sideBarIsOpen={addSidebarOpen}
                closeSidebar={closeAddSubjectSidebar}
                handleGetData={() => getProfileData(tutorId ? tutorId : '')}
            />
        </MainWrapper>
    );
};

export default MyTeachings;
