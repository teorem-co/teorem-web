import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import React from 'react';
import { t } from 'i18next';
import { Banner } from './Banner';
import { PROFILE_PATHS } from '../../routes';

interface Props {
    hideBanner: (arg0: string) => void;
}

export const DocumentVerificationBanner = (props: Props) => {
  const {hideBanner} = props;
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  function hide(){
    hideBanner('true');
    sessionStorage.setItem('hideStripeBanner', 'true');
  }

  return (
    <>
      {loggedInUser
        && loggedInUser.stripeVerifiedStatus !== 'verified'
        && !loggedInUser.stripeVerificationDocumentsUploaded
        && <Banner
          text={t('ID_VERIFICATION.BANNER')}
          hide={hide}
          redirectionPath={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL}
        />
      }
    </>
  );
};
