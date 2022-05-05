import { NavLink } from 'react-router-dom';

import gradientCircle from '../../assets/images/gradient-circle.svg';
import logo from '../../assets/images/logo.svg';
import { logout } from '../../slices/authSlice';
import { RoleOptions } from '../../slices/roleSlice';
import { logoutUser } from '../../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PATHS, PROFILE_PATHS, RenderMenuLinks } from '../routes';
import { persistor } from '../store';
import ImageCircle from './ImageCircle';

const Navbar = () => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        persistor.purge();
        dispatch(logout());
        dispatch(logoutUser());
        dispatch({ type: 'USER_LOGOUT' });
    };

    const user = useAppSelector((state) => state.auth?.user);

    return (
        <div className="navbar">
            <NavLink 
                className="d--b" 
                to={`${user?.Role?.abrv === RoleOptions.SuperAdmin ? 
                        PATHS.TUTOR_MANAGMENT : 
                        user?.Role?.abrv === RoleOptions.Tutor ? 
                            PATHS.DASHBOARD : 
                            PATHS.MY_BOOKINGS}`}
            >
                <img className="navbar__logo" src={logo} alt="logo" />
            </NavLink>
            <div className="flex--grow">
                <RenderMenuLinks></RenderMenuLinks>
            </div>
            <div className="navbar__bottom">
                {/* Don't show user profile settings to child role */}
                {(user?.Role?.abrv === RoleOptions.Child && (
                    <div className="flex flex--grow flex--center">
                        <div className="navbar__bottom__avatar pos--rel">
                            <ImageCircle initials={`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`} />

                            <div className="navbar__bottom--settings">
                                <i className="icon icon--base icon--white icon--settings"></i>
                            </div>
                        </div>
                        <div className="navbar__bottom__user-info">
                            <div className="type--color--primary type--wgt--bold type--break">
                                {user?.firstName} {user?.lastName}
                            </div>
                            <div className="type--xs type--color--secondary type--wgt--regular ">{user?.Role?.name}</div>
                        </div>
                    </div>
                )) || (
                    <NavLink to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL} className="navbar__bottom__my-profile" activeClassName="active">
                        <div className="navbar__bottom__avatar pos--rel">
                            {user?.Role?.abrv === RoleOptions.Tutor ? (
                                <img src={user?.profileImage ? 'https://' + user?.profileImage : gradientCircle} alt="avatar" />
                            ) : (
                                <ImageCircle initials={`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`} />
                            )}
                            <div className="navbar__bottom--settings">
                                <i className="icon icon--base icon--white icon--settings"></i>
                            </div>
                        </div>
                        <div className="navbar__bottom__user-info">
                            <div className="type--color--primary type--wgt--bold type--break">
                                {user?.firstName} {user?.lastName}
                            </div>
                            <div className="type--xs type--color--secondary type--wgt--regular ">{user?.Role?.name}</div>
                        </div>
                    </NavLink>
                )}

                <NavLink to={PATHS.LOGIN} onClick={handleLogout} className="d--ib">
                    <i className="icon icon--logout icon--sm icon--grey"></i>
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;
