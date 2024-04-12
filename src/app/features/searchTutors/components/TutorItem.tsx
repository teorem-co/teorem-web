import { t } from 'i18next';
import { uniq } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import ImageCircle from '../../../components/ImageCircle';
import { PATHS } from '../../../routes';
import ITutorItem from '../../../../interfaces/ITutorItem';
import CustomSubjectList from './CustomSubjectList';
import { TutorItemVideoPopup } from './TutorItemVideoPopup';
import { MdOutlinePlayCircleFilled } from 'react-icons/md';
import { getAndSetThumbnailUrl } from '../../my-profile/VideoRecorder/getThumbnail';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { NoReviews } from '../../../components/NoReviews';

export interface VimeoResponse {
    thumbnail_large: string;
}

interface Props {
    tutor: ITutorItem;
    setActiveCard: (id: string) => void;
    currentlyActive: boolean;
}

const TutorItem: FC<Props> = (props: Props) => {
    const { tutor, setActiveCard, currentlyActive } = props;
    const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    useEffect(() => {
        if (currentlyActive && tutor.videoUrl) getAndSetThumbnailUrl(tutor.videoUrl, setThumbnailUrl);
    }, [currentlyActive]);

    useEffect(() => {
        if (tutor.subjects.length > 0) {
            setUniqueSubjects(tutor.subjects);
        }
    }, [tutor]);

    const handleLongText = (text: string) => {
        let showText: string = '';
        showText = text.slice(0, 300) + '...';
        return <div className="type--break">{showText}</div>;
    };

    // const cacheBuster = Date.now();
    return (
        <div className={`mb-2 flex flex--row ${currentlyActive ? '' : ''}`}>
            <a
                onMouseEnter={() => {
                    if (tutor.videoUrl) getAndSetThumbnailUrl(tutor.videoUrl, setThumbnailUrl);
                    setActiveCard(tutor.id);
                }}
                style={{ color: 'black' }}
                href={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
                target="_blank" // Opens link in a new tab
                rel="noopener noreferrer" // Security for opening new tabs
            >
                <div style={{ height: '280px' }} className={`tutor-list__item m-0 cur--pointer ${currentlyActive ? 'outline-purple' : ''}`}>
                    <div className="tutor-list__item__img">
                        {tutor.profileImage ? (
                            <img src={`${tutor.profileImage}`} alt="tutor-list" />
                        ) : (
                            <ImageCircle
                                initials={`${tutor.firstName ? tutor.firstName.charAt(0) : ''}${tutor.lastName ? tutor.lastName.charAt(0) : ''}`}
                                imageBig={true}
                            />
                        )}
                    </div>
                    <div className="tutor-list__item__info w--550--max mr-2">
                        <div className="flex flex--row flex--ai--center mb-2">
                            <div className="type--md type--wgt--extra-bold mr-1">
                                {tutor.firstName && tutor.lastName ? `${tutor.firstName} ${tutor.lastName}` : ''}
                            </div>

                            <Tooltip
                                id="ID-tooltip"
                                place={'bottom'}
                                positionStrategy={'absolute'}
                                float={false}
                                delayShow={200}
                                style={{
                                    backgroundColor: 'rgba(70,70,70, 0.9)',
                                    color: 'white',
                                    fontSize: 'smaller',
                                }}
                            />
                            {tutor.idVerified && (
                                <div
                                    className={'flex flex--center'}
                                    data-tooltip-id={'ID-tooltip'}
                                    data-tooltip-html={t('TUTOR_PROFILE.TOOLTIP.ID_VERIFIED')}
                                >
                                    <RiVerifiedBadgeFill size={20} />
                                </div>
                            )}
                        </div>
                        <div className="type--color--brand mb-2">
                            {tutor.currentOccupation ? tutor.currentOccupation : t('SEARCH_TUTORS.NOT_FILLED')}{' '}
                        </div>
                        {tutor.completedLessons > 0 && (
                            <div className="flex flex--center mb-1">
                                <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                <span className="d--ib ml-4">
                                    {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                                </span>
                            </div>
                        )}
                        <div className={`type--color--secondary w--550--min type--3--lines`}>
                            {tutor.aboutTutor ? tutor.aboutTutor : t('SEARCH_TUTORS.NOT_FILLED')}
                        </div>
                        <div className={`type--color--secondary mb-4 mt-2 ${tutor.subjects.length > 0 ? 'mb-4' : ''}`}>
                            {t('SEARCH_TUTORS.YEARS_OF_EXPERIENCE')} {tutor.yearsOfExperience}
                        </div>

                        {tutor.subjects.length > 0 ? <CustomSubjectList subjects={uniq(uniqueSubjects)} /> : <></>}
                    </div>

                    <div className="flex flex--col flex--jc--space-around">
                        <div className="flex flex--row flex--ai--center flex--jc--space-around mt-2 mb-2">
                            {tutor.averageGrade > 0 && tutor.numberOfGrades ? (
                                <div className="flex flex--col flex--ai--center">
                                    <div className="flex flex--row flex--ai--center">
                                        <i className="icon icon--base icon--star"></i>
                                        <span className={'type--md type--wgt--extra-bold'}>{tutor.averageGrade.toFixed(1)}</span>
                                    </div>
                                    <span className={'type--sm'}>
                                        {tutor.numberOfGrades}&nbsp;{t('TUTOR_PROFILE.REVIEWS')}
                                    </span>
                                </div>
                            ) : (
                                <NoReviews />
                            )}
                            <div className="flex flex--col flex--ai--center">
                                <div className="flex flex--center flex--col type--center">
                                    {tutor.minPrice ? (
                                        <span className="d--ib type--md type--wgt--extra-bold">
                                            &euro;{tutor.minPrice}{' '}
                                            {tutor.minPrice !== tutor.maxPrice && (
                                                <>
                                                    &nbsp;-&nbsp; &euro;
                                                    {tutor.maxPrice}{' '}
                                                </>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="d--ib">{t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}</span>
                                    )}
                                    <span className={'type--sm'}>{t('SEARCH_TUTORS.TUTOR_PROFILE.LESSON_LENGTH')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex--col profile-btn-container flex--jc--center  w--250 ml-1">
                            <>
                                <Link
                                    className="btn btn--xl btn--primary type--center type--wgt--extra-bold"
                                    to={`${PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(':tutorSlug', tutor.slug)}`}
                                >
                                    <i className="icon icon--base icon--thunder icon--white mr-1"></i>
                                    {t('TUTOR_PROFILE.BOOK')}
                                </Link>

                                <a
                                    className="btn btn--base btn--ghost type--center flex flex--center flex--jc--center mt-2 type--wgt--extra-bold"
                                    href={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
                                    target="_blank" // Opens link in a new tab
                                >
                                    <span>{t('SEARCH_TUTORS.VIEW_PROFILE')}</span>
                                </a>
                            </>
                        </div>
                    </div>
                </div>
            </a>
            {currentlyActive && tutor.videoUrl && thumbnailUrl && (
                <div
                    onClick={() => setShowVideoPopup(true)}
                    className="tutor-list__item__details flex--grow appear-from-left cur--pointer"
                    style={{ position: 'relative', height: '280px' }}
                >
                    <MdOutlinePlayCircleFilled
                        className={'icon-hover-color-change'}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            zIndex: 2,
                            cursor: 'pointer', // If the icon is interactive
                        }}
                        floodColor={'#fff'}
                        size={55}
                    />
                    <img className={'image-border-radius'} src={thumbnailUrl} alt="tutor-list" style={{ zIndex: 1, height: '100%' }} />
                </div>
            )}
            {showVideoPopup && tutor.videoUrl && (
                <TutorItemVideoPopup
                    videoUrl={tutor.videoUrl}
                    onClose={() => {
                        setShowVideoPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default TutorItem;
