import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useLazyGetProfileProgressQuery, useLazyGetTutorProfileDataQuery } from '../../../../services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import AddSubjectSidebar from '../components/AddSubjectSidebar';
import EditSubjectSidebar from '../components/EditSubjectSidebar';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import SubjectList from '../components/SubjectList';
import { setMyProfileProgress } from '../slices/myProfileSlice';

const MyTeachings = () => {
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getProfileData, { data: myTeachingsData, isLoading: myTeachingsLoading, isUninitialized: myTeachingsUninitialized }] =
        useLazyGetTutorProfileDataQuery();

    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [editSidebarOpen, setEditSidebarOpen] = useState(false);

    const dispatch = useAppDispatch();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const tutorId = getUserId();
    const { t } = useTranslation();
    const isLoading = myTeachingsLoading || myTeachingsUninitialized;
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

    const fetchData = async () => {
        if (tutorId) {
            getProfileData(tutorId);
            //If there is no state in redux for profileProgress fetch data and save result to redux
            if (profileProgressState.percentage === 0) {
                const progressResponse = await getProfileProgress().unwrap();
                dispatch(setMyProfileProgress(progressResponse));
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MainWrapper>
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

                {/* MY TEACHINGS */}
                {(isLoading && <>Loading...</>) || (
                    <div className="card--profile__section">
                        {/* Add subject */}
                        <div>
                            <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.TITLE')}</div>
                            <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.MY_TEACHINGS.DESCRIPTION')}</div>
                        </div>
                        <div>
                            <div className="dash-wrapper dash-wrapper--adaptive flex--grow">
                                <div className="dash-wrapper__item">
                                    <div className="dash-wrapper__item__element" onClick={() => setAddSidebarOpen(true)}>
                                        <div className="flex--primary cur--pointer">
                                            <div>
                                                <div className="type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.ADD_NEW')}</div>
                                                <div>{t('MY_PROFILE.MY_TEACHINGS.ADD_DESC')}</div>
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
                                    tutorSubjects={myTeachingsData && myTeachingsData.TutorSubjects ? myTeachingsData.TutorSubjects : []}
                                    key={myTeachingsData && myTeachingsData.TutorSubjects.length}
                                />
                            </div>
                        </div>
                    </div>
                )}
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
