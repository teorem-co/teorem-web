import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { useGetAvailableTutorsQuery } from '../../../services/tutorService';
import ImageCircle from '../../components/ImageCircle';
import MainWrapper from '../../components/MainWrapper';
import { PATHS } from '../../routes';

const TutorProfile = () => {
    const { t } = useTranslation();

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
            <div className="layout--primary">
                <div>
                    <div className="card--secondary card--secondary--alt">
                        <div className="card--secondary__head">
                            <div className="flex flex--center">
                                <Link to={PATHS.SEARCH_TUTORS}>
                                    <div>
                                        <i className="icon icon--base icon--arrow-left icon--black"></i>
                                    </div>
                                </Link>
                                <div className="type--lg type--wgt--bold ml-6">
                                    {tutorData
                                        ? `${tutorData.User.firstName} ${tutorData.User.lastName}`
                                        : 'Go back'}
                                </div>
                            </div>
                        </div>
                        {tutorData ? (
                            <div className="card--secondary__body">
                                <div className="tutor-list__item">
                                    <div className="tutor-list__item__img">
                                        {tutorData?.User.File?.path ? (
                                            <img
                                                src={
                                                    tutorData.User.File &&
                                                    tutorData.User.File.path
                                                }
                                                alt="tutor-list"
                                            />
                                        ) : (
                                            <ImageCircle
                                                initials={`${
                                                    tutorData?.User.firstName
                                                        ? tutorData.User.firstName.charAt(
                                                              0
                                                          )
                                                        : ''
                                                }${
                                                    tutorData?.User.lastName
                                                        ? tutorData.User.lastName.charAt(
                                                              0
                                                          )
                                                        : ''
                                                }`}
                                                imageBig={true}
                                            />
                                        )}
                                    </div>
                                    <div className="tutor-list__item__info flex flex--col flex--jc--center">
                                        <div className="type--md mb-1">
                                            {tutorData
                                                ? `${tutorData.User.firstName} ${tutorData.User.lastName} `
                                                : t(
                                                      'SEARCH_TUTORS.TUTOR_PROFILE.NOT_FILLED'
                                                  )}
                                        </div>
                                        <div className="type--color--brand mb-4">
                                            {tutorData
                                                ? tutorData.currentOccupation
                                                : t(
                                                      'SEARCH_TUTORS.TUTOR_PROFILE.NOT_FILLED'
                                                  )}
                                        </div>
                                    </div>
                                    <div className="tutor-list__item__details">
                                        <div className="flex--grow mb-6">
                                            <div className="flex flex--center mb-3">
                                                <i className="icon icon--pricing icon--base icon--grey"></i>
                                                <span className="d--ib ml-4">
                                                    {/* Add later */}
                                                    $44 - $45 /hr
                                                </span>
                                            </div>
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
                                    <div className="type--wgt--bold">
                                        {t(
                                            'SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_ME'
                                        )}
                                    </div>
                                    <div className="type--color--secondary">
                                        {tutorData ? (
                                            tutorData.aboutTutor
                                        ) : (
                                            <>
                                                {t(
                                                    'SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_ABOUT'
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="type--wgt--bold">
                                        {t(
                                            'SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_TEACHINGS'
                                        )}
                                    </div>
                                    <div className="type--color--secondary">
                                        {tutorData && tutorData.aboutLessons ? (
                                            tutorData.aboutLessons
                                        ) : (
                                            <>
                                                {t(
                                                    'SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_LESSON'
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="type--wgt--bold type--lg mt-5 ml-5">
                                User not found
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="card--primary">test</div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default TutorProfile;
