import { t } from 'i18next';
import React, { useEffect, useState } from 'react';

import logo from '../../assets/images/logo.svg';
import { ButtonPrimaryGradient } from './ButtonPrimaryGradient';
import { useAppDispatch } from '../store/hooks';
import { setLoginModalOpen, setRegistrationModalOpen } from '../store/slices/modalsSlice';

export default function PublicNavbar() {
    const dispatch = useAppDispatch();
    const [textCopiedToClipboard, setTextCopiedToClipboard] = useState<boolean>(false);

    useEffect(() => {
        textCopiedToClipboard && setTimeout(() => setTextCopiedToClipboard(false), 800);
    }, [textCopiedToClipboard]);

    return (
        <div className="navbar">
            <a className="d--b" onClick={() => dispatch(setLoginModalOpen(true))}>
                <img className="navbar__logo" src={logo} alt="logo" />
            </a>
            <div className="flex--grow">
                <a className={`navbar__item`} onClick={() => dispatch(setLoginModalOpen(true))}>
                    <i className={`icon icon--base navbar__item__icon navbar__item--search-tutors`}></i>
                    <span className={`navbar__item__label`}>{t(`NAVIGATION.SEARCH_TUTORS`)}</span>
                </a>
            </div>
            <div className="type--center" style={{ padding: '10px' }}>
                <a className="type--color--white" onClick={() => dispatch(setLoginModalOpen(true))}>
                    <ButtonPrimaryGradient className="btn btn--base w--100 mb-3">
                        {t('NAVIGATION.LOGIN')}
                    </ButtonPrimaryGradient>
                </a>
                <a
                    className="btn btn--base btn--ghost--bordered w--100 type--wgt--extra-bold"
                    onClick={() => dispatch(setRegistrationModalOpen(true))}
                >
                    {t('NAVIGATION.REGISTER')}
                </a>
            </div>
        </div>
    );
}
