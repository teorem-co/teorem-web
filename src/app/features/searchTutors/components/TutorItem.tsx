import { t } from 'i18next';
import { uniq } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCircle from '../../../components/ImageCircle';
import { PATHS } from '../../../routes';
import ITutorItem from '../../../../interfaces/ITutorItem';
import CustomSubjectList from './CustomSubjectList';
import { TutorItemVideoPopup } from './TutorItemVideoPopup';
import { MdOutlinePlayCircleFilled } from 'react-icons/md';
import { getAndSetThumbnailUrl } from '../../my-profile/VideoRecorder/getThumbnail';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';

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
                    <div className="tutor-list__item__info w--550--max">
                        <div className="flex flex--row flex--ai--center mb-1">
                            <div className="type--md mr-1">{tutor.firstName && tutor.lastName ? `${tutor.firstName} ${tutor.lastName}` : ''}</div>

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
                        <div className="type--color--brand mb-4">
                            {tutor.currentOccupation ? tutor.currentOccupation : t('SEARCH_TUTORS.NOT_FILLED')}{' '}
                        </div>
                        <div className={`type--color--secondary w--550--min`}>
                            {tutor.aboutTutor
                                ? tutor.aboutTutor
                                    ? tutor.aboutTutor.length > 300
                                        ? handleLongText(tutor.aboutTutor)
                                        : tutor.aboutTutor
                                    : ''
                                : t('SEARCH_TUTORS.NOT_FILLED')}
                        </div>
                        <div className={`type--color--secondary mb-4 mt-2 ${tutor.subjects.length > 0 ? 'mb-6' : ''}`}>
                            {t('SEARCH_TUTORS.YEARS_OF_EXPERIENCE')} {tutor.yearsOfExperience}
                        </div>

                        {tutor.subjects.length > 0 ? <CustomSubjectList subjects={uniq(uniqueSubjects)} /> : <></>}
                    </div>
                    <div className="tutor-list__item__details mr-4 border-none">
                        <div className="flex--grow mb-6">
                            <div className="flex flex--center mb-3">
                                <i className="icon icon--pricing icon--base icon--grey"></i>
                                {tutor.minPrice ? (
                                    <span className="d--ib ml-4">
                                        {tutor.minPrice} {tutor.currencyCode}
                                        {tutor.minPrice !== tutor.maxPrice && (
                                            <>
                                                &nbsp;-&nbsp;
                                                {tutor.maxPrice} {tutor.currencyCode}
                                            </>
                                        )}
                                        &nbsp;/h
                                    </span>
                                ) : (
                                    <span className="d--ib ml-4">{t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}</span>
                                )}
                            </div>

                            <div className="flex flex--center mb-3">
                                <i className="icon icon--star icon--base icon--grey"></i>
                                <span className="d--ib ml-4">
                                    {/* Add later */}
                                    {tutor.averageGrade ? tutor.averageGrade.toFixed(1) : 0}
                                </span>
                            </div>
                            <div className="flex flex--center">
                                <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                <span className="d--ib ml-4">
                                    {/* Add later */}
                                    {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                                </span>
                            </div>
                        </div>
                        <div className="type--center">
                            <Link
                                className="btn btn--primary btn--base w--100 mb-3"
                                to={`${PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(':tutorSlug', tutor.slug)}`}
                            >
                                {t('SEARCH_TUTORS.BOOK_LESSON')}
                            </Link>
                            <a
                                href={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
                                className="btn btn--base btn--ghost--bordered w--100 type--wgt--extra-bold"
                                target="_blank" // Opens link in a new tab
                                rel="noopener noreferrer" // Security for opening new tabs
                            >
                                {t('SEARCH_TUTORS.VIEW_PROFILE')}
                            </a>
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
