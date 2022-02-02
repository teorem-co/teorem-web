import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import logo from '../../../../assets/images/logo.svg';
import { LANDING_PATHS } from '../../../routes';

const Navigation = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div>
            <div className="flex--primary">
                <NavLink
                    className="landing__navigation__logo d--b flex--shrink"
                    to={LANDING_PATHS.HOW_IT_WORKS}
                >
                    <img src={logo} alt="logo" />
                </NavLink>
                <div className="landing__navigation__hamburger">
                    <i
                        className="icon icon--md icon--menu icon--black"
                        onClick={() => setShowSidebar(!showSidebar)}
                    ></i>
                </div>
                {/* WEB SIZE NAV */}
                <div className="landing__navigation__items">
                    <div className="flex">
                        <NavLink to={LANDING_PATHS.HOW_IT_WORKS}>
                            <div className="type--md">How it works</div>
                        </NavLink>
                        <NavLink to={LANDING_PATHS.PRICING}>
                            <div className="type--md pl-10">Pricing</div>
                        </NavLink>
                        <NavLink to={LANDING_PATHS.BECOME_TUTOR}>
                            <div className="type--md pl-10">Become a tutor</div>
                        </NavLink>
                    </div>
                    <div>
                        <button className="btn btn--primary btn--base">
                            Sign in
                        </button>
                        <button className="btn btn--primary ml-4 btn--base">
                            Get started
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`landing__navigation ${showSidebar ? 'active' : ''}`}
            >
                <NavLink to={LANDING_PATHS.HOW_IT_WORKS}>
                    <div>How it works</div>
                </NavLink>
                <NavLink to={LANDING_PATHS.PRICING}>
                    <div>Pricing</div>
                </NavLink>
                <NavLink to={LANDING_PATHS.BECOME_TUTOR}>
                    <div>Become a tutor</div>
                </NavLink>
            </div>
        </div>
    );
};

export default Navigation;
