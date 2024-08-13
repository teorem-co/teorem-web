import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import { getUserRoleAbrv } from '../utils/getUserRoleAbrv';
import { useEffect, useState } from 'react';
import { PATHS } from '../routes';
import { NavLink } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { Role } from '../types/role';

interface IMenuItem {
    name: string;
    icon: string;
    key: string;
    path: string;
    rootPath?: string;
    disabled?: boolean;
}

interface IMenuPerRole {
    [key: string]: IMenuItem[];
}

//has to be in this file to prevent app crash when importing
export function menuPerRole(stripeConnected: boolean): IMenuPerRole {
    return {
        [Role.Tutor]: [
            {
                name: 'DASHBOARD',
                icon: 'dashboard',
                key: 'DASHBOARD',
                path: PATHS.DASHBOARD,
            },
            {
                name: 'MY_BOOKINGS',
                icon: 'calendar',
                key: 'MY_BOOKINGS',
                path: PATHS.MY_BOOKINGS,
            },
            {
                name: 'CHAT',
                icon: 'chat',
                key: 'CHAT',
                path: PATHS.CHAT,
            },
            {
                name: 'MY_REVIEWS',
                icon: 'reviews',
                key: 'MY_REVIEWS',
                path: PATHS.MY_REVIEWS,
            },
            {
                name: 'EARNINGS',
                icon: 'earnings',
                key: 'EARNINGS',
                path: PATHS.EARNINGS,
                disabled: !stripeConnected,
            },
        ],
        [Role.Student]: [
            {
                name: 'DASHBOARD',
                icon: 'dashboard',
                key: 'DASHBOARD',
                path: PATHS.DASHBOARD,
            },
            {
                name: 'MY_BOOKINGS',
                icon: 'calendar',
                key: 'MY_BOOKINGS',
                path: PATHS.MY_BOOKINGS,
            },
            {
                name: 'CHAT',
                icon: 'chat',
                key: 'CHAT',
                path: PATHS.CHAT,
            },
            {
                name: 'SEARCH_TUTORS',
                icon: 'search-tutors',
                key: 'SEARCH_TUTORS',
                path: PATHS.SEARCH_TUTORS,
            },
            {
                name: 'COMPLETED_LESSONS',
                icon: 'completed-lessons',
                key: 'COMPLETED_LESSONS',
                path: PATHS.COMPLETED_LESSONS,
            },
        ],
        [Role.Parent]: [
            {
                name: 'DASHBOARD',
                icon: 'dashboard',
                key: 'DASHBOARD',
                path: PATHS.DASHBOARD,
            },
            {
                name: 'MY_BOOKINGS',
                icon: 'calendar',
                key: 'MY_BOOKINGS',
                path: PATHS.MY_BOOKINGS,
            },
            {
                name: 'CHAT',
                icon: 'chat',
                key: 'CHAT',
                path: PATHS.CHAT,
            },
            {
                name: 'SEARCH_TUTORS',
                icon: 'search-tutors',
                key: 'SEARCH_TUTORS',
                path: PATHS.SEARCH_TUTORS,
            },
            {
                name: 'COMPLETED_LESSONS',
                icon: 'completed-lessons',
                key: 'COMPLETED_LESSONS',
                path: PATHS.COMPLETED_LESSONS,
            },
        ],
        [Role.SuperAdmin]: [
            {
                name: 'TUTOR_MANAGMENT',
                icon: 'tutor-managment',
                key: 'TUTOR_MANAGMENT',
                path: PATHS.TUTOR_MANAGMENT,
            },
            {
                name: 'STUDENT_MANAGEMENT',
                icon: 'student-management',
                key: 'STUDENT_MANAGEMENT',
                path: PATHS.STUDENT_MANAGEMENT,
            },
            {
                name: 'CHAT',
                icon: 'chat',
                key: 'CHAT',
                path: PATHS.CHAT,
            },
            {
                name: 'TUTOR_VIDEOS',
                icon: 'video',
                key: 'TUTOR_VIDEOS',
                path: PATHS.TUTOR_VIDEOS,
            },
            {
                name: 'BOOKING_MANAGEMENT',
                icon: 'calendar',
                key: 'BOOKING_MANAGEMENT',
                path: PATHS.BOOKING_MANAGEMENT,
            },
        ],
        [Role.Child]: [
            {
                name: 'MY_BOOKINGS',
                icon: 'calendar',
                key: 'MY_BOOKINGS',
                path: PATHS.MY_BOOKINGS,
            },
            {
                name: 'CHAT',
                icon: 'chat',
                key: 'CHAT',
                path: PATHS.CHAT,
            },
            {
                name: 'COMPLETED_LESSONS',
                icon: 'completed-lessons',
                key: 'COMPLETED_LESSONS',
                path: PATHS.COMPLETED_LESSONS,
            },
        ],
    };
}

export function RenderMenuLinks() {
    const userRole = getUserRoleAbrv();
    const user = useAppSelector((state) => state.user);

    const chat = useAppSelector((state) => state.chat);

    const { t } = useTranslation();

    const badgeStyle = {
        '& .MuiBadge-badge': {
            color: 'white',
            backgroundColor: '#7E6CF2',
        },
    };

    const [showBadge, setShowBadge] = useState(false);
    const [doAnimation, setDoAnimation] = useState(true);
    const [oldNumOfNewMessages, setoldNumOfNewMessages] = useState(chat.newMessages);
    // Function to trigger the badge pop-up animation

    const isMobile = window.innerWidth < 1200;

    useEffect(() => {
        if (chat.newMessages) {
            if (chat.newMessages == 0) {
                setDoAnimation(true);
            }

            if (chat.newMessages > 0 && doAnimation && oldNumOfNewMessages != chat.newMessages) {
                setShowBadge(true);

                setTimeout(() => {
                    setShowBadge(false);
                }, 1800);

                setDoAnimation(false);
                setoldNumOfNewMessages(chat.newMessages);
            }
        }
    }, [chat.newMessages]);

    if (!userRole) return null;

    return (
        <>
            {menuPerRole(user?.user?.stripeConnected || false)[userRole].map((route: any) =>
                route.disabled ? (
                    <div className={`navbar__item`} style={{ cursor: route.disabled ? 'not-allowed' : 'pointer' }}>
                        <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
                        <span className={`navbar__item__label`}>{t(`NAVIGATION.${route.name}`)}</span>
                        {route.key == 'CHAT' && chat.newMessages != null && chat.newMessages > 0 && (
                            <i className={`navbar__item__unread`}></i>
                        )}
                    </div>
                ) : (
                    <NavLink
                        key={route.key}
                        to={route.path}
                        className={`navbar__item`}
                        activeClassName="active"
                        isActive={(match: any, location: Location) => {
                            //format nicer later
                            if (route.rootPath) {
                                if (location.pathname.startsWith(route.rootPath)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if (!match) {
                                    return false;
                                }
                            }

                            return true;
                        }}
                    >
                        {route.key == 'CHAT' && chat.newMessages != null && chat.newMessages > 0 ? (
                            <Badge
                                badgeContent={chat.newMessages}
                                className={showBadge ? 'badge-pulse' : ''}
                                sx={badgeStyle}
                                max={10}
                            >
                                <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
                            </Badge>
                        ) : (
                            <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
                        )}
                        <span className={`navbar__item__label ${isMobile ? 'font__lg' : ''}`}>
                            {t(`NAVIGATION.${route.name}`)}
                        </span>
                    </NavLink>
                )
            )}
        </>
    );
}
