import { cloneDeep, debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import { useLazyGetTutorByTutorSlugQuery } from '../../../services/tutorService';
import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import LoaderPrimary from '../../components/skeleton-loaders/LoaderPrimary';
import LoaderTutorProfile from '../../components/skeleton-loaders/LoaderTutorProfile';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import { useGetOrCreateChatMutation } from '../../services/chatEngineService';
import { addChatRoom, IChatRoom } from '../chat/slices/chatSlice';
import { useLazyGetTutorAvailabilityQuery } from '../my-profile/services/tutorAvailabilityService';
import Ratings from '../myReviews/components/Ratings';
import ReviewItem from '../myReviews/components/ReviewItem';
import IMyReview from '../myReviews/interfaces/IMyReview';
import IMyReviewParams from '../myReviews/interfaces/IMyReviewParams';
import { IGetMyReviews } from '../myReviews/MyReviews';
import { useLazyGetMyReviewsQuery, useLazyGetStatisticsQuery } from '../myReviews/services/myReviewsService';
import ImageCircle from '../../components/ImageCircle';
import PublicTutorProfile from './PublicTutorProfile';
import { StarRating } from '../myReviews/components/StarRating';
import { getAndSetThumbnailUrl } from '../my-profile/VideoRecorder/getThumbnail';
import { TutorItemVideoPopup } from './components/TutorItemVideoPopup';
import { MdOutlinePlayCircle } from 'react-icons/md';
import ITutorSubjectLevel from '../../../interfaces/ITutorSubjectLevel';

const TutorProfile = () => {
    const { t } = useTranslation();

    const [getTutorProfileData, { data: tutorData, isLoading: tutorDataLoading }] = useLazyGetTutorByTutorSlugQuery();
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [getOrCreateNewChat, { isLoading: createChatLoading }] = useGetOrCreateChatMutation();
    const [tutorId, setTutorId] = useState('');
    const [pathTutorId, setPathTutorId] = useState('');
    const [tutorPath, setTutorPath] = useState('');

    const { tutorSlug } = useParams();

    useEffect(() => {
        getTutorProfileData(tutorSlug)
            .unwrap()
            .then((tutorIdObj: any) => {
                setTutorId(tutorIdObj.userId);
            });
    }, []);

    useEffect(() => {
        if (tutorData) document.title = tutorData.User.firstName + ' ' + tutorData.User.lastName;
        if (tutorData?.videoUrl) {
            getAndSetThumbnailUrl(tutorData?.videoUrl, setThumbnailUrl);
        } else {
            console.log('NO VIDEO URL ');
        }
    }, [tutorData]);
    const history = useHistory();

    const dispatch = useDispatch();

    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const user = useAppSelector((state) => state.auth.user);
    const [params, setParams] = useState<IMyReviewParams>({ page: 1, rpp: 5 });
    const [loadedMyReviews, setLoadedMyReviews] = useState<IMyReview[]>([]);

    const [getMyReviews, { data: myReviews }] = useLazyGetMyReviewsQuery();
    const [getStatistics, { data: tutorStatistics }] = useLazyGetStatisticsQuery();
    const [getTutorAvailability, { data: tutorAvailability }] = useLazyGetTutorAvailabilityQuery();

    useEffect(() => {
        if (tutorSlug?.length) {
            setTutorPath(PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(':tutorSlug', tutorSlug));
        }
    }, [tutorSlug]);

    useEffect(() => {
        if (tutorId.length) {
            const myReviewsGetObj: IGetMyReviews = {
                tutorId: tutorId,
                page: params.page,
                rpp: params.rpp,
            };

            getMyReviews(myReviewsGetObj);
            getStatistics(tutorId);
            getTutorAvailability(tutorId);
        }
    }, [tutorId]);

    useEffect(() => {
        const currentReviews = cloneDeep(loadedMyReviews);
        if (myReviews) {
            setLoadedMyReviews(currentReviews.concat(myReviews.rows));
        }
    }, [myReviews]);

    useEffect(() => {
        if (tutorId.length) {
            const myReviewsGetObj: IGetMyReviews = {
                tutorId: tutorId,
                page: params.page,
                rpp: params.rpp,
            };
            getMyReviews(myReviewsGetObj);
        }
    }, [params, tutorId]);

    const isMobile = window.innerWidth < 768;
    const renderTableCells = (column: string | boolean, index: number) => {
        if (typeof column === 'boolean') {
            return (
                <td key={index} className={`${column ? 'table--availability--check' : 'table--availability--close'}`}>
                    <i className={`icon icon--${isMobile ? 'sm' : 'base'} ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
                </td>
            );
        } else if (column == '') {
            return <td key={index}></td>;
        } else if (column == 'Pre 12 pm') {
            return <td key={index}>{t(`TUTOR_PROFILE.PRE12`)}</td>;
        } else if (column == '12 - 5 pm') {
            return <td key={index}>{t(`TUTOR_PROFILE.ON12`)}</td>;
        } else if (column == 'After 5 pm') {
            return <td key={index}>{t(`TUTOR_PROFILE.AFTER5`)}</td>;
        } else {
            return <td key={index}>{t(`CONSTANTS.DAYS_SHORT.${column.toUpperCase()}`)}</td>;
        }
    };

    const handleLoadMore = () => {
        let newParams = { ...params };
        newParams = {
            page: params.page + 1,
            rpp: params.rpp,
        };

        setParams(newParams);
    };

    const hideLoadMore = () => {
        let returnValue: boolean = false;
        if (myReviews) {
            const totalPages = Math.ceil(myReviews.count / params.rpp);

            if (params.page === totalPages) returnValue = true;
        }

        return returnValue;
    };

    const createNewChat = async () => {
        const tutorData = await getTutorProfileData(tutorSlug).unwrap();

        const toSend: IChatRoom = {
            user: {
                userId: user?.id + '',
                userImage: user?.profileImage,
                userNickname: user?.firstName + ' ' + user?.lastName,
            },
            tutor: {
                userId: tutorData?.userId + '',
                userImage: tutorData?.User.profileImage,
                userNickname: tutorData?.User.firstName + ' ' + tutorData?.User.lastName,
            },
            unreadMessageCount: 0,
            messages: [],
            addToList: true,
            setActive: true,
        };

        dispatch(addChatRoom(toSend));

        /*await getOrCreateNewChat(toSend)
.unwrap()
.then(() => {
history.push(PATHS.CHAT);
})
.catch(() => {
toastService.error(`can't create a chat with ${tutorUserName}, please contact a support for more informations`);
});*/
    };

    //scroll to bottom alerter
    const handleScroll = (e: HTMLDivElement) => {
        const innerHeight = e.scrollHeight;
        const scrollPosition = e.scrollTop + e.clientHeight;
        if (!hideLoadMore() && innerHeight === scrollPosition && loadedMyReviews.length > 0) {
            handleLoadMore();
        }
        // if (innerHeight === scrollPosition) {
        //     //action to do on scroll to bottom
        //
        // }
    };

    const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);
    // const cacheBuster = Date.now();

    if (user === null) {
        return <PublicTutorProfile />;
    } else {
        return (
            <MainWrapper>
                <div className="layout--primary">
                    {tutorDataLoading ? (
                        <LoaderTutorProfile />
                    ) : tutorData ? (
                        <>
                            <div>
                                <div onScroll={(e: any) => debouncedScrollHandler(e.target)} className="card--secondary card--secondary--alt">
                                    <div className="flex flex--col flex--jc--center ">
                                        {
                                            isMobile ? (
                                                /** mobile component **/
                                                <div className="card--secondary__head text-align--center flex--wrap flex--col flex--ai--center w--100">
                                                    <div className="flex flex--row flex--ai--center flex--jc--space-around w--100 mb-5">
                                                        <div className="tutor-list__item__img">
                                                            {tutorData.User?.profileImage ? (
                                                                <img
                                                                    style={{
                                                                        width: '120px',
                                                                        height: '120px',
                                                                    }}
                                                                    className="align--center d--b"
                                                                    src={`${tutorData.User.profileImage}`}
                                                                    alt="tutor-profile-pic"
                                                                />
                                                            ) : (
                                                                <ImageCircle
                                                                    className="align--center d--b mb-4"
                                                                    imageBig={false}
                                                                    initials={`${tutorData.User?.firstName.charAt(
                                                                        0
                                                                    )}${tutorData.User?.lastName.charAt(0)}`}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="flex flex--col w--80">
                                                            <div className="d--b type--xl type--wgt--bold text-align--center type--break">
                                                                {tutorData ? `${tutorData.User.firstName} ${tutorData.User.lastName}` : 'Go back'}
                                                            </div>
                                                            <div className="type--color--brand type--base type--center type--break">
                                                                {tutorData.currentOccupation}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex--col w--100 flex--jc--center flex--ai--center flex--gap-30 type--sm">
                                                        <div className="flex flex--center tag tag--primary">
                                                            <div className=" flex flex--center">
                                                                <i className="icon icon--completed-lessons icon--base icon--primary"></i>
                                                                <span className="d--ib mr-1">
                                                                    {tutorData.completedLessons ? tutorData.completedLessons : 0}
                                                                </span>
                                                            </div>

                                                            <span> {t('SEARCH_TUTORS.COMPLETED_LESSONS')}</span>
                                                        </div>
                                                        {/*TODO: uncomment*/}
                                                        {/*<div className={'ml-2'}>*/}
                                                        {/*    <div className={'flex flex--row flex--ai--center'}>*/}
                                                        {/*        <i className={'icon icon--base icon--star'}></i>*/}
                                                        {/*        <p className={'type--sm'}>*/}
                                                        {/*            Jako popularan. 5 ucenika je kontaktiralo ovog instruktora U zadnjih 48h sati*/}
                                                        {/*        </p>*/}
                                                        {/*    </div>*/}
                                                        {/*    <div className={'flex flex--row flex--ai--center'}>*/}
                                                        {/*        <i className={'icon icon--base icon--time'}></i>*/}
                                                        {/*        <p className={'type--sm'}>Odgovara u prosjeku unutar 4 sata</p>*/}
                                                        {/*    </div>*/}
                                                        {/*</div>*/}
                                                    </div>

                                                    <div className="flex flex--row flex--ai--center flex--jc--space-around mt-4  w--100">
                                                        {tutorData.averageGrade > 0 && tutorData.numberOfGrades && (
                                                            <div className="flex flex--col flex--ai--center">
                                                                <div className="flex flex--row flex--ai--center">
                                                                    <i className="icon icon--base icon--star"></i>
                                                                    <span className={'type--md type--wgt--extra-bold'}>
                                                                        {tutorData.averageGrade.toFixed(1)}
                                                                    </span>
                                                                </div>
                                                                <span>{tutorData.numberOfGrades} recenzija</span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex--col flex--ai--center">
                                                            <div className="flex flex--center flex--col type--center">
                                                                {tutorData.minimumPrice ? (
                                                                    <span className="d--ib type--md type--wgt--extra-bold">
                                                                        &euro;{tutorData.minimumPrice}{' '}
                                                                        {tutorData.minimumPrice !== tutorData.maximumPrice && (
                                                                            <>
                                                                                &nbsp;-&nbsp; &euro;
                                                                                {tutorData.maximumPrice}{' '}
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="d--ib">{t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}</span>
                                                                )}
                                                                <span>50 min predavanje</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-0 tutor-list__item__details border-none flex flex--col type--sm flex--ai--center w--100">
                                                        <div className="flex flex--col profile-btn-container flex--jc--center w--100">
                                                            {userRole !== RoleOptions.Tutor && (
                                                                <>
                                                                    {tutorData.disabled ? (
                                                                        <button
                                                                            disabled={tutorData.disabled}
                                                                            className="btn btn--lg btn--primary type--center"
                                                                        >
                                                                            {t('TUTOR_PROFILE.TUTOR_DISABLED')}
                                                                        </button>
                                                                    ) : (
                                                                        <Link className="btn btn--base btn--primary type--center" to={tutorPath}>
                                                                            <i className="icon icon--base icon--thunder icon--white mr-1" />
                                                                            {t('TUTOR_PROFILE.BOOK')}
                                                                        </Link>
                                                                    )}

                                                                    <Link
                                                                        className="btn btn--base btn--ghost type--center flex flex--center flex--jc--center mt-2"
                                                                        onClick={() => createNewChat()}
                                                                        to={PATHS.CHAT}
                                                                    >
                                                                        {createChatLoading && <LoaderPrimary small={true} />}
                                                                        <i className="icon icon--base icon--chat icon--primary mr-1"></i>
                                                                        <span>{t('TUTOR_PROFILE.SEND')}</span>
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // end of mobile component

                                                /** desktop component **/
                                                <div className="card--secondary__head text-align--center flex--wrap flex--col flex--ai--center w--100">
                                                    <div className="flex flex--row flex--jc--space-between w--100 flex--ai--center h--200--max">
                                                        {/*  PROFILNA SLIKA*/}
                                                        <div className=" flex flex--row flex--ai--start flex--jc--center ">
                                                            <div className="flex flex--jc--space-between flex--jc--center mr-6">
                                                                <div className="tutor-list__item__img">
                                                                    {tutorData.User?.profileImage ? (
                                                                        <img
                                                                            style={{
                                                                                width: '190px',
                                                                                height: '190px',
                                                                            }}
                                                                            className="align--center d--b"
                                                                            src={`${tutorData.User.profileImage}`}
                                                                            alt="tutor-profile-pic"
                                                                        />
                                                                    ) : (
                                                                        <ImageCircle
                                                                            className="align--center d--b mb-4"
                                                                            imageBig={true}
                                                                            initials={`${tutorData.User?.firstName.charAt(
                                                                                0
                                                                            )}${tutorData.User?.lastName.charAt(0)}`}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex--col flex--ai--start">
                                                                <div className="d--b type--xl type--wgt--bold type--break type--left">
                                                                    {tutorData ? `${tutorData.User.firstName} ${tutorData.User.lastName}` : 'Go back'}
                                                                </div>

                                                                <div className="type--color--brand type--base type--break type--left">
                                                                    {tutorData.currentOccupation}
                                                                </div>

                                                                {/*TODO: uncomment when we have this*/}
                                                                {/*<div className={'ml-2'}>*/}
                                                                {/*    <div className={'flex flex--row flex--ai--center'}>*/}
                                                                {/*        <i className={'icon icon--base icon--star'}></i>*/}
                                                                {/*        <p className={''}>*/}
                                                                {/*            Jako popularan. 5 ucenika je kontaktiralo ovog instruktora U zadnjih 48h sati*/}
                                                                {/*        </p>*/}
                                                                {/*    </div>*/}
                                                                {/*    <div className={'flex flex--row flex--ai--center'}>*/}
                                                                {/*        <i className={'icon icon--base icon--time'}></i>*/}
                                                                {/*        <p className={''}>Odgovara u prosjeku unutar 4 sata</p>*/}
                                                                {/*    </div>*/}
                                                                {/*</div>*/}

                                                                <div className="flex flex--center tag tag--primary field__w-fit-content mt-5">
                                                                    <div className=" flex flex--center">
                                                                        <i className="icon icon--completed-lessons icon--base icon--primary"></i>
                                                                        <span className="d--ib mr-1">
                                                                            {tutorData.completedLessons ? tutorData.completedLessons : 0}
                                                                        </span>
                                                                    </div>

                                                                    <span> {t('SEARCH_TUTORS.COMPLETED_LESSONS')}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={'flex flex--row'}>
                                                            <div className=" border-none flex flex--row type--sm flex--jc--center mr-8">
                                                                <div className="flex--grow">
                                                                    <div className="flex flex--row flex--ai--center flex--jc--space-around mt-2 mb-2">
                                                                        {tutorData.averageGrade > 0 && tutorData.numberOfGrades ? (
                                                                            <div className="flex flex--col flex--ai--center">
                                                                                <div className="flex flex--row flex--ai--center">
                                                                                    <i className="icon icon--base icon--star"></i>
                                                                                    <span className={'type--md type--wgt--extra-bold'}>
                                                                                        {tutorData.averageGrade.toFixed(1)}
                                                                                    </span>
                                                                                </div>
                                                                                <span>{tutorData.numberOfGrades} recenzija</span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className={'type--md type--wgt--extra-bold'}>Nema recenzija</span>
                                                                        )}
                                                                        <div className="flex flex--col flex--ai--center">
                                                                            <div className="flex flex--center flex--col type--center">
                                                                                {tutorData.minimumPrice ? (
                                                                                    <span className="d--ib type--md type--wgt--extra-bold">
                                                                                        &euro;{tutorData.minimumPrice}{' '}
                                                                                        {tutorData.minimumPrice !== tutorData.maximumPrice && (
                                                                                            <>
                                                                                                &nbsp;-&nbsp; &euro;
                                                                                                {tutorData.maximumPrice}{' '}
                                                                                            </>
                                                                                        )}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="d--ib">
                                                                                        {t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}
                                                                                    </span>
                                                                                )}
                                                                                <span>50 min predavanje</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex--col profile-btn-container flex--jc--center  w--350">
                                                                        {userRole !== RoleOptions.Tutor && (
                                                                            <>
                                                                                {tutorData.disabled ? (
                                                                                    <button
                                                                                        disabled={tutorData.disabled}
                                                                                        className="btn btn--lg btn--primary type--center"
                                                                                    >
                                                                                        {t('TUTOR_PROFILE.TUTOR_DISABLED')}
                                                                                    </button>
                                                                                ) : (
                                                                                    <Link
                                                                                        className="btn btn--xl btn--primary type--center type--wgt--extra-bold"
                                                                                        to={tutorPath}
                                                                                    >
                                                                                        <i className="icon icon--base icon--thunder icon--white mr-1"></i>
                                                                                        {t('TUTOR_PROFILE.BOOK')}
                                                                                    </Link>
                                                                                )}

                                                                                <Link
                                                                                    className="btn btn--base btn--ghost type--center flex flex--center flex--jc--center mt-2 type--wgt--extra-bold"
                                                                                    onClick={() => createNewChat()}
                                                                                    to={PATHS.CHAT}
                                                                                >
                                                                                    {createChatLoading && <LoaderPrimary small={true} />}
                                                                                    <i className="icon icon--base icon--chat icon--primary mr-1"></i>
                                                                                    <span>{t('TUTOR_PROFILE.SEND')}</span>
                                                                                </Link>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {thumbnailUrl ? (
                                                                    <div
                                                                        className={'d--b'}
                                                                        style={{
                                                                            position: 'relative',
                                                                            height: '190px',
                                                                        }}
                                                                        onClick={() => setShowVideoPopup(true)}
                                                                    >
                                                                        <img
                                                                            className={'image-border-radius image--border cur--pointer'}
                                                                            src={thumbnailUrl}
                                                                            alt="tutor-list"
                                                                            style={{
                                                                                zIndex: 1,
                                                                                height: '100%',
                                                                                width: 'auto',
                                                                            }}
                                                                        />
                                                                        <MdOutlinePlayCircle
                                                                            className={'icon-hover-color-change'}
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: '50%', // Center vertically
                                                                                left: '50%', // Center horizontally
                                                                                transform: 'translate(-50%, -50%)', // Adjust icon position to center
                                                                                zIndex: 2,
                                                                                cursor: 'pointer', // If the icon is interactive
                                                                            }}
                                                                            size={55}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className={
                                                                            'type--center flex flex--col flex--jc--center card--primary card--primary--shadow'
                                                                        }
                                                                        style={{
                                                                            height: '190px',
                                                                            width: '335px',
                                                                            backgroundColor: 'whitesmoke',
                                                                        }}
                                                                    >
                                                                        Instruktor jos nije ucitao video
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            //   end of desktop component
                                        }
                                    </div>
                                    {showVideoPopup && tutorData.videoUrl && (
                                        <TutorItemVideoPopup
                                            videoUrl={tutorData.videoUrl}
                                            onClose={() => {
                                                setShowVideoPopup(false);
                                            }}
                                        />
                                    )}
                                    <div className="card--secondary__body">
                                        {isMobile && thumbnailUrl && (
                                            <div className="flex flex--col flex--ai--center image-border-radius mb-3">
                                                <iframe
                                                    id={'iframe-video'}
                                                    className={'align-center  cur--pointer'}
                                                    src={tutorData.videoUrl}
                                                    width="100%"
                                                    height="200px"
                                                    frameBorder="0"
                                                    allow="autoplay; fullscreen; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        )}
                                        <div className={`w--100 ${isMobile ? '' : 'flex flex--jc--space-between'} `}>
                                            <div className={`${isMobile ? '' : 'w--45'} mb-10`}>
                                                <div className="type--wgt--bold mb-2 type--lg">{t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_ME')}</div>
                                                <div className="type--color--secondary type--break type--normal">
                                                    {tutorData ? tutorData.aboutTutor : <>{t('SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_ABOUT')}</>}
                                                </div>
                                            </div>

                                            <div className={`${isMobile ? '' : 'w--50'} mb-10`}>
                                                <div className="type--wgt--bold mb-2 type--lg">
                                                    {t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_TEACHINGS')}
                                                </div>
                                                <div className="type--color--secondary type--break type--normal">
                                                    {tutorData && tutorData.aboutLessons ? (
                                                        tutorData.aboutLessons
                                                    ) : (
                                                        <>{t('SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_LESSON')}</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${isMobile ? '' : 'flex flex--jc--space-between'} mb-10`}>
                                            <div className={`${isMobile ? 'mb-10' : 'w--45'}`}>
                                                <div className="type--wgt--bold mb-2 type--lg">{t('TUTOR_PROFILE.SUBJECTS.TITLE')}</div>
                                                <table className="table table--primary type--normal">
                                                    <thead>
                                                        <tr className={`${isMobile ? 'type--sm type--left' : ''}`}>
                                                            <th>{t('TUTOR_PROFILE.SUBJECTS.SUBJECT')}</th>
                                                            <th>{t('TUTOR_PROFILE.SUBJECTS.QUALIFICATION')}</th>
                                                            <th>{t('TUTOR_PROFILE.SUBJECTS.PRICE')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tutorData.TutorSubjects.length > 0 ? (
                                                            tutorData.TutorSubjects.map((item: ITutorSubjectLevel) => {
                                                                return (
                                                                    <tr key={item.id} className={`${isMobile ? 'type--sm p-0 type--left' : ''}`}>
                                                                        <td>{t(`SUBJECTS.${item.Subject.abrv.replaceAll('-', '')}`)}</td>
                                                                        {item.Level.name === 'IB (International Baccalaurate)' ? (
                                                                            <td>{t('LEVELS.ib')}</td>
                                                                        ) : (
                                                                            <td>
                                                                                {t(
                                                                                    `LEVELS.${item.Level.name
                                                                                        .replaceAll('-', '')
                                                                                        .replaceAll(' ', '')
                                                                                        .toLowerCase()}`
                                                                                )}
                                                                            </td>
                                                                        )}
                                                                        <td>
                                                                            {item.price}
                                                                            <span className="type--color--tertiary">
                                                                                {' ' + tutorData.User.Country.currencyCode}/
                                                                                {t('TUTOR_PROFILE.SUBJECTS.HOUR_ABRV')}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={3}>{t('TUTOR_PROFILE.SUBJECTS.EMPTY')}</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className={`${isMobile ? '' : 'w--50'}`}>
                                                <div className="type--wgt--bold mb-2 type--lg">{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</div>
                                                {tutorAvailability && tutorAvailability[1].length > 1 ? (
                                                    <table className="table table--availability">
                                                        <tbody>
                                                            {tutorAvailability.map((row: (string | boolean)[], index: number) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        {row.map((column: string | boolean, index: number) => {
                                                                            return renderTableCells(column, index);
                                                                        })}
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <>{t('TUTOR_PROFILE.AVAILABILITY_EMPTY')}</>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-10">
                                            <div className="type--wgt--bold mb-2">{t('TUTOR_PROFILE.RATING.TITLE')}</div>
                                            <div className="flex flex--jc--space-between">
                                                <div className="flex flex--col flex--ai--center">
                                                    <div className="review-mark-big">
                                                        {tutorStatistics?.statistic ? tutorStatistics.statistic.toFixed(1) : 0}
                                                    </div>

                                                    {tutorStatistics && (
                                                        <StarRating mark={tutorStatistics.statistic} size={isMobile ? 'small' : 'medium'} />
                                                    )}
                                                    <div className="type--color--secondary">({myReviews?.count})</div>
                                                </div>
                                                <div>
                                                    <Ratings ratings={tutorStatistics ? tutorStatistics.result : []} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="divider--primary"></div>
                                        <div>
                                            {myReviews && myReviews.rows.length > 0 ? (
                                                <>
                                                    <div className="reviews-list">
                                                        {loadedMyReviews &&
                                                            loadedMyReviews.map((item: IMyReview, index: number) => (
                                                                <ReviewItem key={index} reviewItem={item} />
                                                            ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="reviews-list">
                                                    <div className="type--center mt-22">
                                                        <h1 className="type--xxl">{t('MY_REVIEWS.NO_RESULT.TITLE')}</h1>
                                                        <p className="type--color--secondary">{t('MY_REVIEWS.NO_RESULT.DESC')}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="type--wgt--bold type--lg mt-5 ml-5">{t('TUTOR_PROFILE.EMPTY')}</div>
                    )}
                </div>
            </MainWrapper>
        );
    }
};

export default TutorProfile;
