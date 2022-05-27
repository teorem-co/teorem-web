import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import logo from '../../../../assets/images/logo.svg';
import logoWhite from '../../../../assets/images/logoWhite.svg';
import { LANDING_PATHS, PATHS } from '../../../routes';
import LanguageSelector from './LanguageSelector';

const Navigation = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const landingHeaderRef = useRef<HTMLDivElement>(null);
    const [onTop, setOnTop] = useState<boolean>(true);
    const history = useHistory();

    useEffect(() => {
        if (showSidebar) {
            document.getElementsByTagName('html')[0].style.overflow = 'hidden';
        } else {
            document.getElementsByTagName('html')[0].style.overflow = 'auto';
        }
    }, [showSidebar]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return function () {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = (e: any) => {
        const scrollTop = e.currentTarget?.pageYOffset;
        const landingHeaderElement = landingHeaderRef.current as HTMLDivElement;
        //debugger;
        if (scrollTop === 0) {
            landingHeaderElement.classList.add('active');
            setOnTop(true);
        } else {
            landingHeaderElement.classList.remove('active');
            setOnTop(false);
        }
    };


    return (
        <div
            ref={landingHeaderRef}
            className={`layout__header--background active ${
                history.location.pathname === '/pricing' ? (onTop ? 'layout__header--background--primary' : '') : ''
            }`}
        >
            <div className="layout__header--landing">
                <div className="flex--primary">
                    <NavLink className="landing__navigation__logo d--b flex--shrink" to={LANDING_PATHS.HOW_IT_WORKS}>
                        {history.location.pathname === '/pricing' ? (
                            onTop ? (
                                <img src={logoWhite} alt="logo" />
                            ) : (
                                <img src={logo} alt="logo" />
                            )
                        ) : (
                            <img src={logo} alt="logo" />
                        )}
                    </NavLink>
                    <div className="flex--primary">
                        <div className="flex">
                            <div className='language__mobile'>
                                <LanguageSelector onTop={onTop} />
                            </div>
                            <div
                                className={`landing__navigation__hamburger ${history.location.pathname === '/pricing' ? (onTop ? 'pricing' : '') : ''} ${
                                    showSidebar ? 'active' : ''
                                }`}
                                onClick={() => setShowSidebar(!showSidebar)}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    {/* WEB SIZE NAV */}
                    <div className="landing__navigation__items">
                        <div className="flex flex--grow flex--jc--center">
                            <NavLink  to={LANDING_PATHS.HOW_IT_WORKS} className="nav-link--landing">
                                <div>{t('LANDING.HEADER.NAV_1')}</div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.PRICING} className="nav-link--landing">
                                <div>{t('LANDING.HEADER.NAV_2')}</div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.BECOME_TUTOR} className="nav-link--landing">
                                <div>{t('LANDING.HEADER.NAV_3')}</div>
                            </NavLink>
                        </div>
                        <div className="flex--primary">
                            <div className="flex">
                                <LanguageSelector onTop={onTop} />

                                <NavLink to={PATHS.LOGIN} className="btn btn--ghost btn--ghost--landing type--wgt--bold">
                                    {t('LANDING.HEADER.SIGN_IN')}
                                </NavLink>
                                <NavLink to={PATHS.REGISTER} className="btn btn--primary btn--primary--landing ml-4">
                                    {t('LANDING.HEADER.GET_STARTED')}
                                </NavLink>
                            </div>
                        </div>
                        {/* <div className="landing__navigation__language">
                        <i className="icon icon--sm icon--language icon--grey"></i>
                        <span className="type--color--secondary ml-1">EN</span>
                    </div> */}
                    </div>
                </div>
                <div>
                    <div className={`landing__navigation ${showSidebar ? 'active' : ''}`}>
                        <div className="p-5">
                            <img className="w--100--max" src={logo} alt="logo" />
                        </div>
                        <div className="flex--grow mt-8">
                            <NavLink
                                
                                to={LANDING_PATHS.HOW_IT_WORKS}
                                className="d--b landing__navigation__item"
                            >
                                <div className="flex flex--center">
                                    <i className="icon icon--base icon--how-it-works icon--primary-gradient"></i>
                                    <span className="d--ib ml-2">{t('LANDING.HEADER.NAV_1')}</span>
                                </div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.PRICING} className="d--b landing__navigation__item">
                                <div className="flex flex--center">
                                    <i className="icon icon--base icon--pricing-item icon--primary-gradient"></i>
                                    <span className="d--ib ml-2">{t('LANDING.HEADER.NAV_2')}</span>
                                </div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.BECOME_TUTOR} className="d--b landing__navigation__item">
                                <div className="flex flex--center">
                                    <i className="icon icon--base icon--become-a-tutor icon--primary-gradient"></i>
                                    <span className="d--ib ml-2">{t('LANDING.HEADER.NAV_3')}</span>
                                </div>
                            </NavLink>
                        </div>
                        <div className="p-3 pl-4">
                            <NavLink to={PATHS.LOGIN} className="btn btn--base btn--ghost landing__navigation__btn mr-2">
                                <div>{t('LANDING.HEADER.SIGN_IN')}</div>
                            </NavLink>
                            <NavLink to={PATHS.REGISTER} className="btn btn--base btn--primary landing__navigation__btn ml-2">
                                <div>{t('LANDING.HEADER.GET_STARTED')}</div>
                            </NavLink>
                        </div>
                    </div>
                    {showSidebar && <div onClick={() => setShowSidebar(false)} className="landing__navigation__overlay"></div>}
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
