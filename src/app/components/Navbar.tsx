import { NavLink } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar__logo">
                <NavLink to="/">
                    <img src={logo} alt="logo" />
                </NavLink>
            </div>
            <div className="flex--grow">
                {/* Map through app paths and render nav items like this*/}
                <NavLink
                    to="/"
                    className="navbar__item"
                    activeClassName="active"
                >
                    <i
                        className={`icon icon--base navbar__item__icon navbar__item--calendar`}
                    ></i>
                    <span className={`navbar__item__label`}>My Bookings</span>
                </NavLink>
                <NavLink
                    to="route"
                    className="navbar__item"
                    activeClassName="active"
                >
                    <i
                        className={`icon icon--base navbar__item__icon navbar__item--reviews`}
                    ></i>
                    <span className={`navbar__item__label`}>Reviews</span>
                </NavLink>
                <NavLink
                    to="/route"
                    className="navbar__item"
                    activeClassName="active"
                >
                    <i
                        className={`icon icon--base navbar__item__icon navbar__item--chat`}
                    ></i>
                    <span className={`navbar__item__label`}>Chat</span>
                </NavLink>
                <NavLink
                    to="/route"
                    className="navbar__item"
                    activeClassName="active"
                >
                    <i
                        className={`icon icon--base navbar__item__icon navbar__item--search-tutors`}
                    ></i>
                    <span className={`navbar__item__label`}>Search Tutors</span>
                </NavLink>
            </div>
            <div className="navbar__bottom">
                {/* Here goes logout and user avatar */}
            </div>
        </div>
    );
};

export default Navbar;
