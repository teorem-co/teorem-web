import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import { useGetAvailableTutorsQuery } from '../../../services/tutorService';
import MainWrapper from '../../components/MainWrapper';
import { PATHS } from '../../routes';

const TutorProfile = () => {
    const { t } = useTranslation();

    const history = useHistory();

    const { tutorId } = useParams();

    const { tutorData } = useGetAvailableTutorsQuery(
        {},
        {
            selectFromResult: ({ data }) => ({
                tutorData: data?.rows.find((tutor) => tutor.userId === tutorId),
            }),
        }
    );

    return (
        <MainWrapper>
            <div className="card--search">
                <div className="card--search__head">
                    <div className="flex flex--center">
                        <Link to={PATHS.SEARCH_TUTORS}>
                            <div>
                                <i className="icon icon--base icon--arrow-left icon--black"></i>
                            </div>
                        </Link>
                        <div className="type--lg type--wgt--bold ml-6">
                            {tutorData
                                ? `${tutorData.User.firstName} ${tutorData.User.lastName}`
                                : ''}
                        </div>
                    </div>
                </div>
                <div className="card--search__body">
                    <div className="tutor-list__item">
                        <div className="tutor-list__item__img">
                            <img
                                src="https://source.unsplash.com/random/300×300/?face"
                                alt="tutor-list"
                            />
                        </div>
                        <div className="tutor-list__item__info flex flex--col flex--jc--center">
                            <div className="type--md mb-1">
                                {tutorData
                                    ? `${tutorData.User.firstName} ${tutorData.User.lastName} `
                                    : ''}
                            </div>
                            <div className="type--color--brand mb-4">
                                {tutorData ? tutorData.currentOccupation : ''}
                            </div>
                        </div>
                        <div className="tutor-list__item__details">
                            <div className="flex--grow mb-6">
                                <div className="flex flex--center mb-3">
                                    <i className="icon icon--star icon--base icon--grey"></i>
                                    <span className="d--ib ml-4">
                                        {/* Add later */}
                                        4.9
                                    </span>
                                </div>
                                <div className="flex flex--center">
                                    <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                    <span className="d--ib ml-4">
                                        {/* Add later */}
                                        15 completed lessions
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 mt-10">
                        <div className="type--wgt--bold">About me</div>
                        <div className="type--color--secondary">
                            {tutorData ? tutorData.aboutTutor : ''}
                        </div>
                    </div>
                    <div>
                        <div className="type--wgt--bold">
                            About my teachings
                        </div>
                        <div className="type--color--secondary">
                            {tutorData ? tutorData.aboutLessons : ''}
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default TutorProfile;
