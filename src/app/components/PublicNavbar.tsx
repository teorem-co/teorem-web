import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import { PATHS } from '../routes';
import { ButtonPrimaryGradient } from './ButtonPrimaryGradient';
import { useAppDispatch } from '../store/hooks';
import { setLoginModalOpen } from '../store/slices/modalsSlice';

const PublicNavbar = () => {
    const dispatch = useAppDispatch();
    const [textCopiedToClipboard, setTextCopiedToClipboard] = useState<boolean>(false);

    useEffect(() => {
        textCopiedToClipboard && setTimeout(() => setTextCopiedToClipboard(false), 800);
    }, [textCopiedToClipboard]);

    return (
        <div className="navbar">
            <NavLink className="d--b" onClick={() => dispatch(setLoginModalOpen(true))}>
                <img className="navbar__logo" src={logo} alt="logo" />
            </NavLink>
            <div className="flex--grow">
                <NavLink
                    className={`navbar__item`}
                    activeClassName="active"
                    onClick={() => dispatch(setLoginModalOpen(true))}
                >
                    <i className={`icon icon--base navbar__item__icon navbar__item--search-tutors`}></i>
                    <span className={`navbar__item__label`}>{t(`NAVIGATION.SEARCH_TUTORS`)}</span>
                </NavLink>
            </div>
            <div className="type--center" style={{ padding: '10px' }}>
                <Link className="type--color--white" onClick={() => dispatch(setLoginModalOpen(true))}>
                    <ButtonPrimaryGradient className="btn btn--base w--100 mb-3">
                        {t('ROLE_SELECTION.LOG_IN')}
                    </ButtonPrimaryGradient>
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
