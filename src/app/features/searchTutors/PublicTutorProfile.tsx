import { cloneDeep, debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useParams} from 'react-router-dom';
import ITutorSubjectLevel from '../../../interfaces/ITutorSubjectLevel';
import {
  useLazyGetTutorByTutorSlugQuery,
} from '../../../services/tutorService';
import LoaderTutorProfile
  from '../../components/skeleton-loaders/LoaderTutorProfile';
import { PATHS } from '../../routes';
import handleRatingStars from '../../utils/handleRatingStarts';
import {
  useLazyGetTutorAvailabilityQuery,
} from '../my-profile/services/tutorAvailabilityService';
import Ratings from '../myReviews/components/Ratings';
import ReviewItem from '../myReviews/components/ReviewItem';
import IMyReview from '../myReviews/interfaces/IMyReview';
import IMyReviewParams from '../myReviews/interfaces/IMyReviewParams';
import { IGetMyReviews } from '../myReviews/MyReviews';
import {
  useLazyGetMyReviewsQuery,
  useLazyGetStatisticsQuery,
} from '../myReviews/services/myReviewsService';
import ImageCircle from '../../components/ImageCircle';
import PublicMainWrapper from "../../components/PublicMainWrapper";


const PublicTutorProfile = () => {
  const { t } = useTranslation();

  const [getTutorProfileData, { data: tutorData, isLoading: tutorDataLoading }] = useLazyGetTutorByTutorSlugQuery();

  const [tutorId, setTutorId] = useState('');

  const { tutorSlug } = useParams();

  useEffect(() => {
    getTutorProfileData(tutorSlug).unwrap().then((tutorIdObj: any) => {
      setTutorId(tutorIdObj.userId);
    });
  }, []);

  const [params, setParams] = useState<IMyReviewParams>({ page: 1, rpp: 5 });
  const [loadedMyReviews, setLoadedMyReviews] = useState<IMyReview[]>([]);

  const [getMyReviews, { data: myReviews }] = useLazyGetMyReviewsQuery();
  const [getStatistics, { data: tutorStatistics }] = useLazyGetStatisticsQuery();
  const [getTutorAvailability, { data: tutorAvailability }] = useLazyGetTutorAvailabilityQuery();

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
        <td key={index} className={`${column ? 'table--availability--check' : 'table--availability--close'}`}>
          <i className={`icon icon--base ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
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
    }
    else {
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

  //scroll to bottom alerter
  const handleScroll = (e: HTMLDivElement) => {
    const innerHeight = e.scrollHeight;
    const scrollPosition = e.scrollTop + e.clientHeight;
    if (!hideLoadMore() && innerHeight === scrollPosition && loadedMyReviews.length > 0) {
      handleLoadMore();
    }
  };

  const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);
  const cacheBuster = Date.now();

  return (
    <PublicMainWrapper>
    <div className="layout--primary">
      {tutorDataLoading ? (
        <LoaderTutorProfile />
      ) : tutorData ? (
        <>
          <div>
            <div onScroll={(e: any) => debouncedScrollHandler(e.target)} className="card--secondary card--secondary--alt">
              <div className="card--secondary__head">
                <div className="flex flex--center">
                  <div className="type--lg type--wgt--bold ml-4">
                    {tutorData ? `${tutorData.User.firstName} ${tutorData.User.lastName}` : 'Go back'}
                  </div>
                </div>
              </div>
              <div className="card--secondary__body">
                <div className="mb-10">
                  <div className="type--wgt--bold mb-2">{t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_ME')}</div>
                  <div className="type--color--secondary type--break">
                    {tutorData ? tutorData.aboutTutor : <>{t('SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_ABOUT')}</>}
                  </div>
                </div>
                <div className="mb-10">
                  <div className="type--wgt--bold mb-2">{t('SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_TEACHINGS')}</div>
                  <div className="type--color--secondary type--break">
                    {tutorData && tutorData.aboutLessons ? (
                      tutorData.aboutLessons
                    ) : (
                      <>{t('SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_LESSON')}</>
                    )}
                  </div>
                </div>
                <div className="mb-10">
                  <div className="type--wgt--bold mb-2">{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</div>
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
                  <div className="type--wgt--bold mb-2">{t('TUTOR_PROFILE.SUBJECTS.TITLE')}</div>
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
                        <td colSpan={3}>{t('TUTOR_PROFILE.SUBJECTS.EMPTY')}</td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
                <div className="mb-10">
                  <div className="type--wgt--bold mb-2">{t('TUTOR_PROFILE.RATING.TITLE')}</div>
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
                      <Ratings ratings={tutorStatistics ? tutorStatistics.result : []} />
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
          <div>
            <div className="card--primary p-4 pt-6">
              <div className="tutor-list__item__img align--center">
                {tutorData.User?.profileImage ? (
                  <img
                    className="align--center d--b mb-4"
                    src={`${tutorData.User.profileImage}&v=${cacheBuster}`}
                    alt="tutor-profile-pic" />
                ) : (
                  <ImageCircle
                    className="align--center d--b mb-4"
                    imageBig={true}
                    initials={`${tutorData.User?.firstName.charAt(0)}${tutorData.User?.lastName.charAt(0)}`}
                  />
                )}
              </div>
              <div className="type--md type--center mb-1">
                {tutorData.User.firstName}&nbsp;
                {tutorData.User.lastName}
              </div>
              <div className="type--color--brand type--center type--break">{tutorData.currentOccupation}</div>
              <div className="mt-10 mb-10">
                <div className="flex--primary mb-3">
                  <div>
                    <i className="icon icon--pricing icon--base icon--grey"></i>
                    <span className="d--ib ml-2 type--color--secondary">{t('TUTOR_PROFILE.PRICING')}:</span>
                  </div>
                  <span className="d--ib ml-4">
                                            {/* Add later */}{tutorData.minimumPrice}
                    &nbsp;-&nbsp;
                    {tutorData.maximumPrice}&nbsp; {tutorData.User.Country.currencyCode} /{t('TUTOR_PROFILE.SUBJECTS.HOUR_ABRV')}
                                        </span>
                </div>
                <div className="flex--primary mb-3">
                  <div>
                    <i className="icon icon--star icon--base icon--grey"></i>
                    <span className="d--ib ml-2 type--color--secondary">{t('TUTOR_PROFILE.RATING_TITLE')}:</span>
                  </div>

                  <span className="d--ib ml-4">
                                            {/* Add later */}
                    {tutorData.averageGrade ? tutorData.averageGrade.toFixed(1) : 0}
                                        </span>
                </div>
                <div className="flex--primary">
                  <div>
                    <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                    <span className="d--ib ml-2 type--color--secondary">{t('TUTOR_PROFILE.COMPLETED_LESSONS')}:</span>
                  </div>
                  <span className="d--ib ml-4">
                                            {/* Add later */}
                    {tutorData.completedLessons}
                                        </span>
                </div>
              </div>
                  <Link
                    className="btn btn--base btn--primary w--100 mb-4 type--center"
                    to={PATHS.LOGIN}
                  >
                    {t('TUTOR_PROFILE.BOOK')}
                  </Link>

                  <Link
                    className="btn btn--base btn--ghost w--100 type--center flex flex--center flex--jc--center"
                    to={PATHS.LOGIN}
                  >
                    <span>{t('TUTOR_PROFILE.SEND')}</span>
                  </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="type--wgt--bold type--lg mt-5 ml-5">{t('TUTOR_PROFILE.EMPTY')}</div>
      )}
    </div>
    </PublicMainWrapper>
  );
};

export default PublicTutorProfile;
