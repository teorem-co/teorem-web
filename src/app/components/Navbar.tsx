import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import gradientCircle from '../../assets/images/gradient-circle.svg';
import logo from '../../assets/images/logo.svg';
import { useLazyGetTutorByIdQuery } from '../../services/tutorService';
import { logout } from '../../slices/authSlice';
import { RoleOptions } from '../../slices/roleSlice';
import { logoutUser } from '../../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { LANDING_PATHS, PATHS, PROFILE_PATHS, RenderMenuLinks } from '../routes';
import { persistor } from '../store';
import ImageCircle from './ImageCircle';
import { useLazyGetUserQuery } from '../../services/userService';
import { StripeDocumentUpload } from './StripeDocumentUpload';

const Navbar = () => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        persistor.purge();
        dispatch(logout());
        dispatch(logoutUser());
        dispatch({ type: 'USER_LOGOUT' });
    };

    const landingHostName = process.env.REACT_APP_LANDING_HOSTNAME || getLandingHostName();

    function getLandingHostName() {
        const hostname = window.location.hostname;
        const lastIndex = hostname.lastIndexOf('.');
        if (lastIndex !== -1) {
            const domain = hostname.substring(lastIndex); //.co, .hr etc
            return 'https://www.teorem' + domain;
        } else {
            // If dot is not found, return localhost, because it is probably localhost
            return 'http://localhost:3000';
        }
    }

    const user = useAppSelector((state) => state.auth?.user);

    const [getTutorProfileData] = useLazyGetTutorByIdQuery();

    const [textCopiedToClipboard, setTextCopiedToClipboard] = useState<boolean>(false);
    const shareProfile = async () => {
        const tutorSlug = (await getTutorProfileData(user?.id || '').unwrap()).slug;
        navigator.clipboard.writeText(window.location.hostname + t('PATHS.SEARCH_TUTORS_TUTOR_PROFILE').replace(':tutorSlug', tutorSlug));
        //todo: aproptiate domain
        setTextCopiedToClipboard(true);
    };

    const landingPath = LANDING_PATHS.HOW_IT_WORKS;

    useEffect(() => {
        textCopiedToClipboard && setTimeout(() => setTextCopiedToClipboard(false), 800);
    }, [textCopiedToClipboard]);

    const [getUser, { isLoading: isLoadingUser, isUninitialized: userUninitialized, isFetching: userFetching }] = useLazyGetUserQuery();
    const [profileImageURL, setProfileImageURL] = useState(user?.profileImage);
    const cacheBuster = Date.now();

    useEffect(() => {
        async function getUserInfo() {
            if (user) {
                const userResponse = await getUser(user.id).unwrap();
                if (userResponse.profileImage) {
                    setProfileImageURL(userResponse.profileImage);
                }
            }
        }
        getUserInfo();
    }, [user]);

    return (
        <div className="navbar">
            <div>
                <StripeDocumentUpload />

                <NavLink
                    className="d--b"
                    to={`${
                        user?.Role?.abrv === RoleOptions.SuperAdmin
                            ? PATHS.TUTOR_MANAGMENT
                            : user?.Role?.abrv === RoleOptions.Tutor
                            ? PATHS.DASHBOARD
                            : PATHS.DASHBOARD
                    }`}
                >
                    <img className="navbar__logo" src={logo} alt="logo" />
                </NavLink>
                <div className="flex--grow">
                    <RenderMenuLinks></RenderMenuLinks>
                </div>
            </div>
            <div>
                {user?.Role.abrv === RoleOptions.Tutor && (
                    <div className="navbar__bottom navbar__bottom__share" onClick={shareProfile}>
                        <div className="navbar__bottom__share-profile">
                            <div className="navbar__bottom__share--icon">
                                <i className={`icon icon--base icon--grey ${textCopiedToClipboard ? 'icon--check' : 'icon--share'}`}></i>
                            </div>
                            <div className="navbar__bottom__user-info">
                                <div className="type--color--tertiary type--wgt--bold type--break">
                                    {textCopiedToClipboard ? t('NAVIGATION.TEXT_COPIED') : t('NAVIGATION.SHARE_PROFILE')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                                {user?.profileImage ? (
                                    <img src={profileImageURL ? `${profileImageURL}&v=${cacheBuster}` : gradientCircle} alt="avatar" />
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
                                <div className="type--xs type--color--secondary type--wgt--regular ">{t('ROLES.' + user?.Role?.abrv)}</div>
                            </div>
                        </NavLink>
                    )}

                    <a href={`${landingHostName}${landingPath}`} onClick={handleLogout} className="d--ib">
                        <i className="icon icon--logout icon--sm icon--grey"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
