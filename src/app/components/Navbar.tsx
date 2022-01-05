import { NavLink } from 'react-router-dom';

import ROUTES from '../../app/routes';
import avatar from '../../assets/images/avatar.svg';
import logo from '../../assets/images/logo.svg';
import { logout } from '../../slices/authSlice';
import { useAppDispatch } from '../hooks';
import { RenderMenuLinks } from '../routes';
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
                <RenderMenuLinks routes={ROUTES}></RenderMenuLinks>
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
