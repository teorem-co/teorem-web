import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useLazyGetProfileProgressQuery, useLazyGetTutorByIdQuery } from '../../../../services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import AddSubjectSidebar from '../components/AddSubjectSidebar';
import EditSubjectSidebar from '../components/EditSubjectSidebar';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import { setMyProfileProgress } from '../slices/myProfileSlice';
import SubjectsPageMyTeachings from '../components/SubjectsPageMyTeachings';

const MyTeachings = () => {
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getProfileData, { data: myTeachingsData, isLoading: myTeachingsLoading, isUninitialized: myTeachingsUninitialized }] =
        useLazyGetTutorByIdQuery();

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
        history.push(t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS'));
        setEditSidebarOpen(false);
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
                <ProfileHeader className="mb-1" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgressState.generalAvailability}
                    additionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
                    payment={profileProgressState.payment}
                />

                {/* MY TEACHINGS */}
                {(isLoading && <LoaderPrimary />) || (
                    <div className="card--profile__section">
                        {/* Add subject */}
                        <div>
                            <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.TITLE')}</div>

                            <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.MY_TEACHINGS.DESCRIPTION')}</div>
                            <SubjectsPageMyTeachings />
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
                key={myTeachingsData?.TutorSubjects.length}
                sideBarIsOpen={addSidebarOpen}
                closeSidebar={closeAddSubjectSidebar}
                handleGetData={() => getProfileData(tutorId ? tutorId : '')}
            />
        </MainWrapper>
    );
};

export default MyTeachings;
