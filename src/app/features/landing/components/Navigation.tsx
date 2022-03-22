import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import logo from '../../../../assets/images/logo.svg';
import { LANDING_PATHS, PATHS } from '../../../routes';

const Navigation = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const landingHeaderRef = useRef<HTMLDivElement>(null);
    const landingHeaderElement = landingHeaderRef.current as HTMLDivElement;

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
        } else {
            landingHeaderElement.classList.remove('active');
        }
    };

    return (
        <div ref={landingHeaderRef} className={`layout__header--background active`}>
            <div className="layout__header--landing">
                <div className="flex--primary">
                    <NavLink className="landing__navigation__logo d--b flex--shrink" to={LANDING_PATHS.HOW_IT_WORKS}>
                        <img src={logo} alt="logo" />
                    </NavLink>
                    <div className={`landing__navigation__hamburger ${showSidebar ? 'active' : ''}`} onClick={() => setShowSidebar(!showSidebar)}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    {/* WEB SIZE NAV */}
                    <div className="landing__navigation__items">
                        <div className="flex flex--grow flex--jc--center">
                            <NavLink to={LANDING_PATHS.HOW_IT_WORKS} className="nav-link--landing">
                                <div>How it works</div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.PRICING} className="nav-link--landing pl-10">
                                <div>Pricing</div>
                            </NavLink>
                            <NavLink to={LANDING_PATHS.BECOME_TUTOR} className="nav-link--landing pl-10">
                                <div>Become a tutor</div>
                            </NavLink>
                        </div>
                        <div className="flex--primary">
                            <div>
                                <NavLink to={PATHS.LOGIN} className="btn btn--ghost btn--ghost--landing type--color--black type--wgt--bold">
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
