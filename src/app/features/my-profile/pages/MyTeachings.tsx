import { Form, FormikProvider, useFormik } from 'formik';
import { initial, isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
    useLazyGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
} from '../../../../services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import { getUserId } from '../../../utils/getUserId';
import AddSubjectSidebar from '../components/AddSubjectSidebar';
import EditSubjectSidebar from '../components/EditSubjectSidebar';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import SubjectList from '../components/SubjectList';

const MyTeachings = () => {
    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [editSidebarOpen, setEditSidebarOpen] = useState(false);

    const [getProfileProgress, { data: profileProgress }] =
        useLazyGetProfileProgressQuery();

    const tutorId = getUserId();

    const { t } = useTranslation();

    const [
        getProfileData,
        { data: myTeachingsData, isLoading: isLoadingMyTeachings },
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

    const isLoading = isLoadingMyTeachings;

    useEffect(() => {
        if (tutorId) {
            getProfileData(tutorId);
            getProfileProgress();
        }
    }, []);

    useEffect(() => {
        if (
            myTeachingsData.tutorSubjects &&
            myTeachingsData.tutorSubjects.length > 0 &&
            profileProgress &&
            profileProgress.percentage < 100
        ) {
            getProfileProgress();
        }
    }, [myTeachingsData.tutorSubjects?.length]);

    const history = useHistory();

    const closeAddSubjectSidebar = () => {
        setAddSidebarOpen(false);
    };

    const closeEditSubjectSidebar = () => {
        // history.location.search = '';
        history.push('/my-profile/info/teachings');
        setEditSidebarOpen(false);
    };

    const handleSendId = (subjectId: string) => {
        history.push(`?subjectId=${subjectId}`);
        setEditSidebarOpen(true);
    };

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

                {/* MY TEACHINGS */}
                <div className="card--profile__section">
                    {/* Add subject */}
                    <div>
                        <div className="mb-2 type--wgt--bold">My Subjects</div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your subjects information
                        </div>
                    </div>
                    <div>
                        <div className="dash-wrapper dash-wrapper--adaptive flex--grow">
                            <div className="dash-wrapper__item">
                                <div
                                    className="dash-wrapper__item__element"
                                    onClick={() => setAddSidebarOpen(true)}
                                >
                                    <div className="flex--primary cur--pointer">
                                        <div>
                                            <div className="type--wgt--bold">
                                                Add new Subject
                                            </div>
                                            <div>Select to add new Subject</div>
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
                                key={myTeachingsData.tutorSubjects?.length}
                            />
                        </div>
                    </div>
                </div>
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
