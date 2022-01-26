import { NavLink } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import { logout } from '../../slices/authSlice';
import { RoleOptions } from '../../slices/roleSlice';
import { userReset } from '../../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RenderMenuLinks } from '../routes';
import { persistor } from '../store';
import ImageCircle from './ImageCircle';

const Navbar = () => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        persistor.purge();
        dispatch(logout());
        dispatch(userReset());
    };

    const user = useAppSelector((state) => state.user.user);

    return (
        <div className="navbar">
            <NavLink className="d--b" to="/my-bookings">
                <img className="navbar__logo" src={logo} alt="logo" />
            </NavLink>
            <div className="flex--grow">
                <RenderMenuLinks></RenderMenuLinks>
            </div>
            <div className="navbar__bottom">
                <div className="flex flex--grow flex--center">
                    <div className="navbar__bottom__avatar">
                        {user?.Role?.abrv === RoleOptions.Tutor ? (
                            <img
                                src={
                                    user?.File?.path
                                        ? user.File?.path
                                        : 'https://source.unsplash.com/random/300×300/?parent'
                                }
                                alt="avatar"
                            />
                        ) : (
                            <ImageCircle
                                initials={`${user?.firstName.charAt(
                                    0
                                )}${user?.lastName.charAt(0)}`}
                            />
                        )}
                    </div>
                    <div className="navbar__bottom__user-info">
                        <div className="type--color--primary type--wgt--bold type--break">
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div className="type--xs type--color--secondary type--wgt--regular ">
                            {user?.Role?.name}
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
