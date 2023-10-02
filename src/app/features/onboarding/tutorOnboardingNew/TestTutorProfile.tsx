import {cloneDeep, debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {Link, useParams} from 'react-router-dom';
import {
  useLazyGetTutorByTutorSlugQuery
} from "../../../../services/tutorService";
import {useGetOrCreateChatMutation} from "../../../services/chatEngineService";
import {useAppSelector} from "../../../hooks";
import IMyReviewParams from "../../myReviews/interfaces/IMyReviewParams";
import IMyReview from "../../myReviews/interfaces/IMyReview";
import {
  useLazyGetMyReviewsQuery, useLazyGetStatisticsQuery
} from "../../myReviews/services/myReviewsService";
import {
  useLazyGetTutorAvailabilityQuery
} from "../../my-profile/services/tutorAvailabilityService";
import {PATHS} from "../../../routes";
import {IGetMyReviews} from "../../myReviews/MyReviews";
import {addChatRoom, IChatRoom} from "../../chat/slices/chatSlice";
import PublicTutorProfile from "../../searchTutors/PublicTutorProfile";
import MainWrapper from "../../../components/MainWrapper";
import LoaderTutorProfile
  from "../../../components/skeleton-loaders/LoaderTutorProfile";
import ITutorSubjectLevel from "../../../../interfaces/ITutorSubjectLevel";
import handleRatingStars from "../../../utils/handleRatingStarts";
import Ratings from "../../myReviews/components/Ratings";
import ReviewItem from "../../myReviews/components/ReviewItem";
import ImageCircle from "../../../components/ImageCircle";
import {RoleOptions} from "../../../../slices/roleSlice";
import LoaderPrimary from "../../../components/skeleton-loaders/LoaderPrimary";

type Props = {
  occupation?: string;
  yearsOfExperience?: string | null;
  aboutTutor?: string;
  aboutLessons?: string;
};

const TestTutorProfile = (props: Props) => {
  const {t} = useTranslation();

  const [getTutorProfileData, {
    data: tutorData,
    isLoading: tutorDataLoading
  }] = useLazyGetTutorByTutorSlugQuery();

  const [getOrCreateNewChat, {isLoading: createChatLoading}] = useGetOrCreateChatMutation();
  const [tutorId, setTutorId] = useState('');
  const [pathTutorId, setPathTutorId] = useState('');
  const [tutorPath, setTutorPath] = useState('');

  //TODO tutor data
  const tutorSlug = "Silvija.T43990";

  useEffect(() => {
    getTutorProfileData(tutorSlug).unwrap().then((tutorIdObj: any) => {
      setTutorId(tutorIdObj.userId);
    });
  }, []);
  const history = useHistory();

  const dispatch = useDispatch();

  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
  const user = useAppSelector((state) => state.auth.user);
  const [params, setParams] = useState<IMyReviewParams>({page: 1, rpp: 5});
  const [loadedMyReviews, setLoadedMyReviews] = useState<IMyReview[]>([]);

  // const { tutorData } = useGetTutorProfileDataQuery(
  //     (tutorId),
  //     {
  //         selectFromResult: ({ data }) => ({
  //             tutorData: data?.rows.find((tutor) => tutor.userId === tutorId),
  //         }),
  //     }
  // );

  const [getMyReviews, {data: myReviews}] = useLazyGetMyReviewsQuery();
  const [getStatistics, {data: tutorStatistics}] = useLazyGetStatisticsQuery();
  const [getTutorAvailability, {data: tutorAvailability}] = useLazyGetTutorAvailabilityQuery();

  useEffect(() => {
    if (tutorSlug?.length) {
      setTutorPath(PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(":tutorSlug", tutorSlug));
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

  const renderTableCells = (column: string | boolean, index: number) => {
    if (typeof column === 'boolean') {
      return (
        <td key={index}
            className={`${column ? 'table--availability--check' : 'table--availability--close'}`}>
          <i
            className={`icon icon--base ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
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
      return <td
        key={index}>{t(`CONSTANTS.DAYS_SHORT.${column.toUpperCase()}`)}</td>;
    }
  };

  const handleLoadMore = () => {
    let newParams = {...params};
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
      setActive: true
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
  const cacheBuster = Date.now();

  function breakTextAtWord(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }

    let breakPoint = text.lastIndexOf(' ', maxLength);

    if (breakPoint === -1) breakPoint = maxLength;  // If there's no space, break at maxLength

    const part1 = text.substring(0, breakPoint);
    const part2 = text.substring(breakPoint + 1);  // +1 to skip the space

    return `${part1}<br />${part2}`;
  }

  if (user === null) {
    return <PublicTutorProfile/>;
  } else {
    return (
      <>
        <div className="layout--primary">
          {tutorDataLoading ? (
            <LoaderTutorProfile/>
          ) : tutorData ? (
            <>
              <div>
                <div onScroll={(e: any) => debouncedScrollHandler(e.target)}
                     className="card--secondary card--secondary--alt">
                  <div className="card--secondary__head">
                    <div className="flex--center flex" style={{alignItems: "center"}}>
                      {tutorData.User?.profileImage ? (
                        <img
                          className="align--center d--b mb-4"
                          style={{alignSelf: "center"}}
                          src={`${tutorData.User.profileImage}&v=${cacheBuster}`}
                          alt="tutor-profile-pic"/>
                      ) : (
                        <ImageCircle
                          className="align--center d--b mb-4"
                          imageBig={false}
                          initials={`${tutorData.User?.firstName.charAt(0)}${tutorData.User?.lastName.charAt(0)}`}
                        />
                      )}
                      <div className="type--lg type--wgt--bold ml-4">
                        {tutorData ? `${tutorData.User.firstName} ${tutorData.User.lastName}` : 'Go back'}
                      </div>
                    </div>
                    <div
                      className="type--color--brand type--center type--break"
                      style={{textAlign: "right", wordWrap: "break-word", marginLeft: "auto", float: "right"}}
                      dangerouslySetInnerHTML={{
                        __html: breakTextAtWord(props.occupation ? props.occupation : "", 25)
                      }}
                    ></div>
                  </div>
                  <div className="card--secondary__body">
                    <div className="mb-10">
                      <div
                        className="type--wgt--bold mb-2">{t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_ME')}</div>
                      <div className="type--color--secondary type--break">
                        {props.aboutTutor ? props.aboutTutor : <>{t('SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_ABOUT')}</>}
                      </div>
                    </div>
                    <div className="mb-10">
                      <div
                        className="type--wgt--bold mb-2">{t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_TEACHINGS')}</div>
                      <div className="type--color--secondary type--break">
                        {props.aboutLessons ? (
                          props.aboutLessons
                        ) : (
                          <>{t('SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_LESSON')}</>
                        )}
                      </div>
                    </div>
                    <div className="mb-10">
                      <div
                        className="type--wgt--bold mb-2">{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</div>
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
                    <div className="mb-10">
                      <div
                        className="type--wgt--bold mb-2">{t('TUTOR_PROFILE.SUBJECTS.TITLE')}</div>
                      <table className="table table--primary">
                        <thead>
                        <tr>
                          <th>{t('TUTOR_PROFILE.SUBJECTS.SUBJECT')}</th>
                          <th>{t('TUTOR_PROFILE.SUBJECTS.QUALIFICATION')}</th>
                          <th>{t('TUTOR_PROFILE.SUBJECTS.PRICE')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tutorData.TutorSubjects.length > 0 ? (
                          tutorData.TutorSubjects.map((item: ITutorSubjectLevel) => {
                            return (
                              <tr key={item.id}>
                                <td>{t(`SUBJECTS.${item.Subject.abrv.replace('-', '')}`)}</td>
                                {
                                  item.Level.name === 'IB (International Baccalaurate)' ?
                                    <td>{t('LEVELS.ib')}</td> :
                                    <td>{t(`LEVELS.${item.Level.name.replace('-', '').replace(' ', '').toLowerCase()}`)}</td>
                                }
                                <td>
                                  {item.price}
                                  <span className="type--color--tertiary">
                                                                        {' ' + tutorData.User.Country.currencyCode}/{t('TUTOR_PROFILE.SUBJECTS.HOUR_ABRV')}
                                                                    </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={3}>{t('TUTOR_PROFILE.SUBJECTS.EMPTY')}</td>
                          </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mb-10">
                      <div
                        className="type--wgt--bold mb-2">{t('TUTOR_PROFILE.RATING.TITLE')}</div>
                      <div className="flex flex--jc--space-between">
                        <div>
                          <div className="type--huge">
                            {tutorStatistics?.statistic ? tutorStatistics.statistic.toFixed(1) : 0}
                          </div>
                          <div className="rating__stars mb-4">
                            <div
                              className="rating__stars__fill"
                              style={{
                                width: `${tutorStatistics && tutorStatistics.statistic
                                  ? handleRatingStars(tutorStatistics.statistic)
                                  : 0
                                }px`,
                              }}
                            ></div>
                          </div>
                          <div className="type--color--secondary">
                            {myReviews?.count} {t('TUTOR_PROFILE.RATING.TOTAL')}
                          </div>
                        </div>
                        <div>
                          <Ratings
                            ratings={tutorStatistics ? tutorStatistics.result : []}/>
                        </div>
                      </div>
                    </div>
                    <div className="divider--primary mb-10"></div>
                    <div>
                      {myReviews && myReviews.rows.length > 0 ? (
                        <>
                          <div className="reviews-list">
                            {loadedMyReviews &&
                              loadedMyReviews.map((item: IMyReview, index: number) => (
                                <ReviewItem key={index} reviewItem={item}/>
                              ))}
                          </div>
                          {/* {hideLoadMore() ? (
                                                    <></>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleLoadMore()
                                                        }
                                                        className="btn btn--base btn--clear d--b align--center mt-6"
                                                    >
                                                        Load more
                                                    </button>
                                                )} */}
                        </>
                      ) : (
                        <div className="reviews-list">
                          <div className="type--center mt-22">
                            <h1
                              className="type--xxl">{t('MY_REVIEWS.NO_RESULT.TITLE')}</h1>
                            <p
                              className="type--color--secondary">{t('MY_REVIEWS.NO_RESULT.DESC')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className="type--wgt--bold type--lg mt-5 ml-5">{t('TUTOR_PROFILE.EMPTY')}</div>
          )}
        </div>
      </>
    );
  }
};

export default TestTutorProfile;
