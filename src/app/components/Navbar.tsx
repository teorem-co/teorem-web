import { NavLink } from 'react-router-dom';

import avatar from '../../assets/images/avatar.svg';
import logo from '../../assets/images/logo.svg';
import { INavLink } from '../../interfaces/INavLink';
import { logout } from '../../slices/authSlice';
import { useAppDispatch } from '../hooks';
import { persistor } from '../store';

interface Props {
    navLinks: INavLink[];
}

//maybe later remove links from props and just get them inside NavBar since they will be predefined and not fetched

const Navbar = (props: Props) => {
    const { navLinks } = props;

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        persistor.purge();
        dispatch(logout());
    };

    console.log('render');

    return (
        <div className="navbar">
            <NavLink className="d--b" to="/">
                <img className="navbar__logo" src={logo} alt="logo" />
            </NavLink>
            <div className="flex--grow">
                {navLinks.length > 0 ? (
                    navLinks.map((link, index) => (
                        <NavLink
                            exact
                            key={link.name}
                            to={link.path}
                            className={`navbar__item ${
                                index === navLinks.length - 1 ? 'mb-10' : ''
                            }`}
                            activeClassName="active"
                        >
                            <i
                                className={`icon icon--base navbar__item__icon navbar__item--${link.icon}`}
                            ></i>
                            <span className={`navbar__item__label`}>
                                {link.name}
                            </span>
                        </NavLink>
                    ))
                ) : (
                    <></>
                )}
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
