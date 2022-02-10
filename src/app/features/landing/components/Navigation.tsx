import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import logo from '../../../../assets/images/logo.svg';
import { LANDING_PATHS } from '../../../routes';

const Navigation = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        if (showSidebar) {
            document.getElementsByTagName('html')[0].style.overflow = 'hidden';
        } else {
            document.getElementsByTagName('html')[0].style.overflow = 'auto';
        }
    }, [showSidebar]);

    return (
        <div className="layout__header--landing">
            <div className="flex--primary">
                <NavLink
                    className="landing__navigation__logo d--b flex--shrink"
                    to={LANDING_PATHS.HOW_IT_WORKS}
                >
                    <img src={logo} alt="logo" />
                </NavLink>
                <div
                    className={`landing__navigation__hamburger ${
                        showSidebar ? 'active' : ''
                    }`}
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* WEB SIZE NAV */}
                <div className="landing__navigation__items">
                    <div className="flex flex--grow flex--jc--end mr-6 mr-md-30">
                        <NavLink
                            to={LANDING_PATHS.HOW_IT_WORKS}
                            className="nav-link--landing"
                        >
                            <div>How it works</div>
                        </NavLink>
                        <NavLink
                            to={LANDING_PATHS.PRICING}
                            className="nav-link--landing pl-10"
                        >
                            <div>Pricing</div>
                        </NavLink>
                        <NavLink
                            to={LANDING_PATHS.BECOME_TUTOR}
                            className="nav-link--landing pl-10"
                        >
                            <div>Become a tutor</div>
                        </NavLink>
                    </div>
                    <div className="flex--primary">
                        <div>
                            <button className="btn btn--ghost  btn--base type--color--black">
                                Sign in
                            </button>
                            <button className="btn btn--primary ml-4 btn--base">
                                Get started
                            </button>
                        </div>
                    </div>
                    {/* <div className="landing__navigation__language">
                        <i className="icon icon--sm icon--language icon--grey"></i>
                        <span className="type--color--secondary ml-1">EN</span>
                    </div> */}
                </div>
            </div>
            <div
                className={`landing__navigation ${showSidebar ? 'active' : ''}`}
            >
                <NavLink
                    to={LANDING_PATHS.HOW_IT_WORKS}
                    className="d--b type--color--white mt-20"
                >
                    <div>How it works</div>
                </NavLink>
                <NavLink
                    to={LANDING_PATHS.PRICING}
                    className="d--b type--color--white"
                >
                    <div>Pricing</div>
                </NavLink>
                <NavLink
                    to={LANDING_PATHS.BECOME_TUTOR}
                    className="d--b type--color--white"
                >
                    <div>Become a tutor</div>
                </NavLink>
            </div>
        </div>
    );
};

export default Navigation;
