import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from './Navbar';
import { debounce } from 'lodash';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { setTopOffset } from '../../slices/scrollSlice';
import { RoleOptions } from '../../slices/roleSlice';
import {
  DocumentVerificationBanner,
} from './banner/DocumentVerificationBanner';
import { Banner } from './banner/Banner';
import {
  IRecentBooking,
  useLazyGetRecentBookingsQuery,
} from '../features/my-bookings/services/bookingService';
import { PROFILE_PATHS } from '../routes';
import { useLazyGetChildrenQuery } from '../../services/userService';
import { useLazyGetVideoPreviewInfoQuery } from '../../services/tutorService';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {
  const state = useAppSelector((state) => state.scroll);
  const topOffset = useAppSelector((state) => state.scroll.topOffset);
  const loggedInUser = useAppSelector((state) => state.auth.user);
  const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [asideActive, setAsideActive] = useState<boolean>(false);

  const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);
  const [hideBanner, setHideBanner] = useState<string | null>(null);
  const [hideStripeBanner, setHideStripeBanner] = useState<string | null>(null);
  const [hideReviewBanner, setHideReviewBanner] = useState<string | null>(null);
  const [hideVideoBanner, setHideVideoBanner] = useState<string | null>(null);
  const [hideAddChildBanner, setHideAddChildBanner] = useState<string | null>(null);
  const [getRecentBookings] = useLazyGetRecentBookingsQuery();
  const [getVideoPreviewInfo] = useLazyGetVideoPreviewInfoQuery();
  const [recentBookings, setRecentBookings] = useState<IRecentBooking[]>([]);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [getChildren, {
    data: childrenData,
    isLoading: childrenLoading,
    isSuccess: childrenSuccess,
  }] = useLazyGetChildrenQuery();

  const handleScroll = async (e: HTMLDivElement) => {
    if (e.scrollTop) dispatch(setTopOffset(e.scrollTop));
  };

  useEffect(() => {
    setHideBanner(sessionStorage.getItem('hideApprovedBanner'));
    setHideStripeBanner(sessionStorage.getItem('hideStripeBanner'));
    setHideReviewBanner(sessionStorage.getItem('hideReviewBanner'));
    setHideAddChildBanner(sessionStorage.getItem('hideAddChildBanner'));
    setHideVideoBanner(sessionStorage.getItem('hideVideoBanner'));

    if (userId && userRole === RoleOptions.Parent) {
      getChildren(userId);
    }
    if (loggedInUser) {
      fetchRecentBookings();
      fetchVideoPreviewInfo();
    }
  }, []);

  async function fetchRecentBookings() {
    if (
      (loggedInUser?.Role.abrv === RoleOptions.Parent || loggedInUser?.Role.abrv === RoleOptions.Student) &&
      !sessionStorage.getItem('hideReviewBanner')
    ) {
      getRecentBookings()
        .unwrap()
        .then((res) => {
          setRecentBookings(res);
          if (res.length == 0) {
            sessionStorage.setItem('hideReviewBanner', 'true');
          }
        });
    }
  }

  async function fetchVideoPreviewInfo() {
    if (userRole === RoleOptions.Tutor && !sessionStorage.getItem('hideVideoBanner')) {
      getVideoPreviewInfo()
        .unwrap()
        .then((res) => {
          if (res.videoUploaded) {
            sessionStorage.setItem('hideVideoBanner', 'true');
            setHideVideoBanner('true');
          }
        });
    }
  }

  function hide() {
    setHideBanner('true');
    sessionStorage.setItem('hideApprovedBanner', 'true');
  }

  const getBannerToShow = () => {
    if (userRole === RoleOptions.Tutor && profileProgressState && !profileProgressState.verified) {
      return (
        <Banner
          text={t(`TUTOR_VERIFIED_NOTE.TITLE`) + t(`TUTOR_VERIFIED_NOTE.DESCRIPTION`)}
          hide={hide} />
      );
    }

    if (userRole === RoleOptions.Tutor && !hideStripeBanner) {
      return <DocumentVerificationBanner hideBanner={setHideStripeBanner} />;
    }

    if (!hideReviewBanner && recentBookings.length > 0) {
      return (
        <Banner
          text={`${t('BANNER.REVIEW.PART_1')}${t('SUBJECTS.' + recentBookings[0].subjectAbrv.replaceAll('-', ''))} ${t('BANNER.REVIEW.PART_2')}${recentBookings[0].tutorName}${t('BANNER.REVIEW.PART_3')}`}
          hide={() => {
            setHideReviewBanner('true');
            sessionStorage.setItem('hideReviewBanner', 'true');
          }}
          redirectionPath={`${t('PATHS.COMPLETED_LESSONS')}?bookingId=${recentBookings[0].bookingId}&showModal=true`}
          buttonText={t('COMPLETED_LESSONS.LEAVE_REVIEW')}
        />
      );
    }

    if (!hideVideoBanner && userRole === RoleOptions.Tutor) {
      return (
        <Banner
          text={t('BANNER.VIDEO_PREVIEW.TEXT')}
          hide={() => {
            setHideVideoBanner('true');
            sessionStorage.setItem('hideVideoBanner', 'true');
          }}
          redirectionPath={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL}
          buttonText={t('BANNER.VIDEO_PREVIEW.BUTTON')}
        />
      );
    }

    if (userRole === RoleOptions.Parent && childrenData?.length === 0 && !hideAddChildBanner) {
      return (
        <Banner
          text={t(`CHILDLESS_PARENT_NOTE.TITLE`)}
          hide={() => {
            setHideAddChildBanner('true');
            sessionStorage.setItem('hideAddChildBanner', 'true');
          }}
          redirectionPath={PROFILE_PATHS.MY_PROFILE_CHILD_INFO}
          buttonText={t('BANNER.ADD_CHILD.BUTTON')}
        />
      );
    }

    return null;
  };

  const bannerToShow = getBannerToShow();

  return (
    <>
      <div className='flex flex--col whole-page-layout'>
        <>{bannerToShow}</>

        <div className='layout'>
          <div className='layout__mobile'>
            <img src='/logo.svg' alt='' className=''
                 style={{ height: '20px' }} />
            <i className='icon icon--md icon--menu icon--black'
               onClick={() => setAsideActive(!asideActive)}>
              hamburger
            </i>
          </div>
          <div
            className={`sidebar layout__aside ${asideActive ? 'active' : ''}`}>
            <div className='layout__aside__close sidebar__close'
                 onClick={() => setAsideActive(!asideActive)}>
              <i className='icon icon--md icon--close icon--black'></i>
            </div>
            <div className='font'>
              <Navbar />
            </div>
          </div>
          <div id='main_layout' className='layout__main'
               onScroll={(e) => debouncedScrollHandler(e.target)}>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainWrapper;
