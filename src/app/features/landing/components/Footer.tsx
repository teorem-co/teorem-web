import { t } from 'i18next';
import React from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import diners from '../../../../assets/images/diners-club.png';
import ipad from '../../../../assets/images/ipad-hand-hold.png';
import logoWhite from '../../../../assets/images/logoWhite.svg';
import maestro from '../../../../assets/images/maestro.png';
import masterCard from '../../../../assets/images/mastercard.png';
import stripe from '../../../../assets/images/stripe-white.svg';
import visa from '../../../../assets/images/visa.png';
import { LANDING_PATHS, PATHS } from '../../../routes';

const Footer = () => {
    const history = useHistory();
    return (
        <div className="landing__footer">
            <div className="landing__footer__content">
                <NavLink className="landing__navigation__logo d--b flex--shrink mt-10" to={t(LANDING_PATHS.HOW_IT_WORKS)}>
                    <img src={logoWhite} alt="logo" />
                </NavLink>
                <div className="type--color--white mt-10 type--md">
                    {t('LANDING.FOOTER.TITLE_TEXT')}
                    <a className="type--color--white type--underline" href="mailto: info@teorem.co">
                        info@teorem.co
                    </a>
                </div>
                <div className="flex flex--wrap w--100 type--color--white ">
                    <div className="mr-20">
                        <div className="type--wgt--bold mt-8">{t('LANDING.FOOTER.APP_NAME')}</div>
                        <div>{t('LANDING.FOOTER.ADDRESS')}</div>
                        <div>{t('LANDING.FOOTER.MOBILE')}</div>
                        <div>{t('LANDING.FOOTER.EMAIL')}</div>
                    </div>
                    <div className="mr-20">
                        <div className="type--wgt--bold mt-8">{t('LANDING.FOOTER.LEGAL.TITLE')}</div>
                        <div className="cur--pointer" onClick={() => history.push(t(PATHS.TERMS))}>
                            {t('LANDING.FOOTER.LEGAL.LEGAL')}
                        </div>
                        <div className="cur--pointer" onClick={() => history.push(t(PATHS.PRIVACY))}>
                            {t('LANDING.FOOTER.LEGAL.PRIVACY')}
                        </div>
                        <div className="cur--pointer" onClick={() => history.push(t(PATHS.REGISTER))}>
                            {t('LANDING.FOOTER.LEGAL.TUTOR')}
                        </div>
                    </div>
                    <div className="">
                        <div className="type--wgt--bold mt-8">{t('LANDING.FOOTER.PAYMENT.TITLE')}</div>
                        <div className="landing__footer__cards">
                            <img src={stripe} alt="stripe logo" />
                            <img src={visa} alt="visa logo" />
                            <img src={masterCard} alt="master card logo" />
                            <img src={diners} alt="diners logo" />
                            <img src={maestro} alt="maestro card logo" />
                        </div>
                    </div>
                </div>
                <div className="mt-10 mb-4">
                    <span className="type--color--white">&#169; Teorem 2021</span>
                </div>
            </div>
            <div className="landing__footer__img">
                <img src={ipad} alt="footer-photo" />
            </div>
        </div>
    );
};

export default Footer;
