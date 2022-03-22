import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import logo from '../../../../assets/images/logo.svg';
import logoWhite from '../../../../assets/images/logoWhite.svg';
import { LANDING_PATHS, PATHS } from '../../../routes';

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

    const testActiveClassName = (e: any) => {
        const currentUrl = e.url;
        const location = history.location.pathname;

        if (currentUrl === location) {
            return true;
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
                    <div
                        className={`landing__navigation__hamburger ${onTop ? 'pricing' : ''} ${showSidebar ? 'active' : ''}`}
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    {/* WEB SIZE NAV */}
                    <div className="landing__navigation__items">
                        <div className="flex flex--grow flex--jc--center">
                            <NavLink isActive={(e: any) => testActiveClassName(e)} to={LANDING_PATHS.HOW_IT_WORKS} className="nav-link--landing">
                                <div>How it works</div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.PRICING} className="nav-link--landing">
                                <div>Pricing</div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.BECOME_TUTOR} className="nav-link--landing">
                                <div>Become a tutor</div>
                            </NavLink>
                        </div>
                        <div className="flex--primary">
                            <div>
                                <NavLink to={PATHS.LOGIN} className="btn btn--ghost btn--ghost--landing type--wgt--bold">
                                    Sign in
                                </NavLink>
                                <NavLink to={PATHS.REGISTER} className="btn btn--primary btn--primary--landing ml-4">
                                    Get started
                                </NavLink>
                            </div>
                        </div>
                        {/* <div className="landing__navigation__language">
                        <i className="icon icon--sm icon--language icon--grey"></i>
                        <span className="type--color--secondary ml-1">EN</span>
                    </div> */}
                    </div>
                </div>
                <div className={`landing__navigation ${showSidebar ? 'active' : ''}`}>
                    <NavLink to={LANDING_PATHS.HOW_IT_WORKS} className="d--b type--color--white mt-20">
                        <div>How it works</div>
                    </NavLink>
                    <NavLink to={LANDING_PATHS.PRICING} className="d--b type--color--white">
                        <div>Pricing</div>
                    </NavLink>
                    <NavLink to={LANDING_PATHS.BECOME_TUTOR} className="d--b type--color--white">
                        <div>Become a tutor</div>
                    </NavLink>
                    <NavLink to={PATHS.REGISTER} className="d--b type--color--white mt-20">
                        <div>Register</div>
                    </NavLink>
                    <NavLink to={PATHS.LOGIN} className="d--b type--color--white">
                        <div>Login</div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
