import { NavLink } from 'react-router-dom';

import avatar from '../../assets/images/avatar.svg';
import logo from '../../assets/images/logo.svg';
import { logout } from '../../slices/authSlice';
import { useAppDispatch } from '../hooks';
import { persistor } from '../store';

const Navbar = () => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        persistor.purge();
        dispatch(logout());
    };

    return (
        <div className="navbar">
            <NavLink className="d--b" to="/">
                <img className="navbar__logo" src={logo} alt="logo" />
            </NavLink>
            <div className="flex--grow">
                {/* Map through app paths and render nav items like this*/}
                <NavLink
                    to="/my-bookings"
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
                <div className="flex flex--grow flex--center">
                    <div className="navbar__bottom__avatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className="navbar__bottom__user-info">
                        <div className="type--color--primary type--wgt--bold type--break">
                            Ivana Nash
                        </div>
                        <div className="type--xs type--color--secondary type--wgt--regular">
                            Parent/Guardian
                        </div>
                    </div>
                </div>
                <NavLink to="/" onClick={handleLogout} className="d--ib">
                    <i className="icon icon--logout icon--sm icon--grey"></i>
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;
