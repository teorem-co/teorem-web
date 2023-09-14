import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import {Link, NavLink} from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import {
  PATHS,
} from '../routes';

const PublicNavbar = () => {

  const [textCopiedToClipboard, setTextCopiedToClipboard] = useState<boolean>(false);

  useEffect(() => {
    textCopiedToClipboard && setTimeout(() => setTextCopiedToClipboard(false), 800);
  }, [textCopiedToClipboard]);

  return (
    <div className="navbar">
      <NavLink
        className="d--b"
        to={PATHS.LOGIN}
      >
        <img className="navbar__logo" src={logo} alt="logo" />
      </NavLink>
      <div className="flex--grow">
        <NavLink
          className={`navbar__item`}
          activeClassName="active"
          to={PATHS.LOGIN}
        >
            <i className={`icon icon--base navbar__item__icon navbar__item--search-tutors`}></i>
          <span className={`navbar__item__label`}>{t(`NAVIGATION.SEARCH_TUTORS`)}</span>
        </NavLink>
      </div>
        <div className="type--center" style={{padding: "10px"}}>
          <Link className="btn btn--primary btn--base w--100 mb-3" to={PATHS.LOGIN}>
            {t('ROLE_SELECTION.LOG_IN')}
          </Link>
          <Link
            className="btn btn--base btn--ghost--bordered w--100 type--wgt--extra-bold"
            to={PATHS.ROLE_SELECTION}
          >
            {t('ROLE_SELECTION.TITLE')}
          </Link>
        </div>
    </div>
  );
};

export default PublicNavbar;
