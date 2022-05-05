import { t } from 'i18next';
import { forEach } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter , matchPath, NavLink, Redirect, Route, Switch, useHistory } from 'react-router-dom';

import Chat from './features/chat/pages/Chat';
import CompletedLessons from './features/completedLessons/CompletedLessons';
import Dashboard from './features/dashboard/Dashboard';
import Earnings from './features/earnings/Earnings';
import ForgotPassword from './features/forgot-password/ForgotPassword';
import ResetPassword from './features/forgot-password/ResetPassword';
import BecomeTutor from './features/landing/pages/BecomeTutor';
import HowItWorks from './features/landing/pages/HowItWorks';
import Pricing from './features/landing/pages/Pricing';
import Privacy from './features/landing/pages/Privacy';
import Terms from './features/landing/pages/Terms';
import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import AdditionalInformation from './features/my-profile/pages/AdditionalInformation';
import ChildInformations from './features/my-profile/pages/ChildInformations';
import GeneralAvailability from './features/my-profile/pages/GeneralAvailability';
import MyTeachings from './features/my-profile/pages/MyTeachings';
import PersonalInformation from './features/my-profile/pages/PersonalInformation';
import ProfileAccount from './features/my-profile/pages/ProfileAccount';
import MyReviews from './features/myReviews/MyReviews';
import Notifications from './features/notifications/Notifications';
import Onboarding from './features/onboarding/Onboarding';
import Register from './features/register/Register';
import RoleSelection from './features/roleSelection/RoleSelection';
import SearchTutors from './features/searchTutors/SearchTutors';
import TutorProfile from './features/searchTutors/TutorProfile';
import TutorBookings from './features/tutor-bookings/TutorBookings';
import TutorManagment from './features/tutor-managment/TutorManagment';
import TutorManagmentProfile from './features/tutor-managment/TutorProfile';
import { useAppSelector } from './hooks';
import { Role } from './lookups/role';
import NotFound from './pages/NotFound';
import PermissionsGate from './PermissionGate';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';

export const PATHS = {
    ROLE_SELECTION: t('PATHS.ROLE_SELECTION'),
    REGISTER: t('PATHS.REGISTER'),
    FORGOT_PASSWORD: t('PATHS.FORGOT_PASSWORD'),
    RESET_PASSWORD: t('PATHS.RESET_PASSWORD'),
    LOGIN: t('PATHS.LOGIN'),
    MY_BOOKINGS: t('PATHS.MY_BOOKINGS'),
    SEARCH_TUTORS: t('PATHS.SEARCH_TUTORS'),
    SEARCH_TUTORS_TUTOR_PROFILE: t('PATHS.SEARCH_TUTORS_TUTOR_PROFILE'),
    SEARCH_TUTORS_TUTOR_BOOKINGS: t('PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS'),
    ONBOARDING: t('PATHS.ONBOARDING'),
    MY_REVIEWS: t('PATHS.MY_REVIEWS'),
    COMPLETED_LESSONS: t('PATHS.COMPLETED_LESSONS'),
    CHAT: t('PATHS.CHAT'),
    DASHBOARD: t('PATHS.DASHBOARD'),
    NOTIFICATIONS: t('PATHS.NOTIFICATIONS'),
    EARNINGS: t('PATHS.EARNINGS'),
    TERMS: t('PATHS.TERMS'),
    PRIVACY: t('PATHS.PRIVACY'),
    TUTOR_MANAGMENT: t('PATHS.TUTOR_MANAGMENT'),
    TUTOR_MANAGMENT_TUTOR_PROFILE: t('PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE'),
};

export const LANDING_PATHS = {
    HOW_IT_WORKS: t('PATHS.LANDING_PATHS.HOW_IT_WORKS'),
    BECOME_TUTOR: t('PATHS.LANDING_PATHS.BECOME_TUTOR'),
    PRICING: t('PATHS.LANDING_PATHS.PRICING'),
};

export const PROFILE_PATHS = {
    MY_PROFILE: t('PATHS.PROFILE_PATHS.MY_PROFILE'),
    MY_PROFILE_INFO: t('PATHS.MY_PROFILE_INFO'),
    MY_PROFILE_INFO_PERSONAL: t('PATHS.MY_PROFILE_INFO_PERSONAL'),
    MY_PROFILE_INFO_AVAILABILITY: t('PATHS.MY_PROFILE_INFO_AVAILABILITY'),
    MY_PROFILE_INFO_TEACHINGS: t('PATHS.MY_PROFILE_INFO_TEACHINGS'),
    MY_PROFILE_INFO_ADDITIONAL: t('PATHS.MY_PROFILE_INFO_ADDITIONAL'),
    MY_PROFILE_ACCOUNT: t('PATHS.MY_PROFILE_ACCOUNT'),
    MY_PROFILE_CHILD_INFO: t('PATHS.MY_PROFILE_CHILD_INFO'),
};

interface IMenuItem {
    name: string;
    icon: string;
    key: string;
    path: string;
    rootPath?: string;
}

interface IMenuPerRole {
    [key: string]: IMenuItem[];
}

const ROUTES: any = [
    {
        path: PATHS.ROLE_SELECTION,
        key: 'ROLE_SELECTION',
        exact: true,
        component: () => <RoleSelection />,
    },
    {
        path: PATHS.REGISTER,
        key: 'REGISTER',
        exact: true,
        component: () => <Register />,
    },
    {
        path: LANDING_PATHS.HOW_IT_WORKS,
        key: 'HOW_IT_WORKS',
        exact: true,
        component: () => <HowItWorks />,
    },
    {
        path: LANDING_PATHS.BECOME_TUTOR,
        key: 'BECOME_TUTOR',
        exact: true,
        component: () => <BecomeTutor />,
    },
    {
        path: LANDING_PATHS.PRICING,
        key: 'PRICING',
        exact: true,
        component: () => <Pricing />,
    },
    {
        path: PATHS.TERMS,
        key: 'TERMS',
        exact: true,
        component: () => <Terms />,
    },
    {
        path: PATHS.PRIVACY,
        key: 'PRIVACY',
        exact: true,
        component: () => <Privacy />,
    },
    {
        path: PATHS.ONBOARDING,
        key: 'ONBOARDING',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <Onboarding />,
    },
    {
        path: PATHS.FORGOT_PASSWORD,
        key: 'FORGOT_PASSWORD',
        exact: true,
        component: () => <ForgotPassword />,
    },
    {
        path: PATHS.RESET_PASSWORD,
        key: 'RESET_PASSWORD',
        exact: true,
        component: () => <ResetPassword />,
    },
    {
        path: PATHS.LOGIN,
        key: 'LOGIN',
        exact: true,
        component: () => <Login />,
    },
    {
        path: PATHS.MY_BOOKINGS,
        key: 'MY_BOOKINGS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin, Role.Child]}>
                <MyBookings />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.CHAT,
        key: 'CHAT',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin, Role.Child]}>
                <Chat />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.MY_REVIEWS,
        key: 'MY_REVIEWS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin]}>
                <MyReviews />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.DASHBOARD,
        key: 'DASHBOARD',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin, Role.Parent, Role.Student, Role.Child]}>
                <Dashboard />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.NOTIFICATIONS,
        key: 'NOTIFICATIONS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin, Role.Parent, Role.Student, Role.Child]}>
                <Notifications />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.EARNINGS,
        key: 'EARNINGS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin]}>
                <Earnings />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.SEARCH_TUTORS,
        key: 'SEARCH_TUTORS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Parent, Role.Student, Role.SuperAdmin]}>
                <SearchTutors />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.SEARCH_TUTORS_TUTOR_PROFILE,
        key: 'SEARCH_TUTORS_TUTOR_PROFILE',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Parent, Role.Student, Role.Tutor, Role.SuperAdmin]}>
                <TutorProfile />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS,
        key: 'SEARCH_TUTORS_TUTOR_BOOKINGS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Parent, Role.Student, Role.SuperAdmin]}>
                <TutorBookings />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.COMPLETED_LESSONS,
        key: 'COMPLETED_LESSONS',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.Parent, Role.Student, Role.SuperAdmin, Role.Child]}>
                <CompletedLessons />
            </PermissionsGate>
        ),
    },
    {
        path: PROFILE_PATHS.MY_PROFILE,
        key: 'MY_PROFILE',
        component: (props: any) => {
            return (
                <PermissionsGate roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin]}>
                    <RenderRoutes {...props} />
                </PermissionsGate>
            );
        },
        routes: [
            {
                path: PROFILE_PATHS.MY_PROFILE_INFO,
                key: 'MY_PROFILE_INFO',
                component: (props: any) => <RenderRoutes {...props} />,
                routes: [
                    {
                        path: PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL,
                        key: 'MY_PROFILE_INFO_PERSONAL',
                        exact: true,
                        component: () => <PersonalInformation />,
                    },
                    {
                        path: PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY,
                        key: 'MY_PROFILE_INFO_AVAILABILITY',
                        exact: true,
                        component: () => <GeneralAvailability />,
                    },
                    {
                        path: PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS,
                        key: 'MY_PROFILE_INFO_TEACHINGS',
                        exact: true,
                        component: () => <MyTeachings />,
                    },
                    {
                        path: PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL,
                        key: 'MY_PROFILE_INFO_ADDITIONAL',
                        exact: true,
                        component: () => <AdditionalInformation />,
                    },
                ],
            },
            {
                path: PROFILE_PATHS.MY_PROFILE_ACCOUNT,
                key: 'MY_PROFILE_ACCOUNT',
                exact: true,
                component: () => <ProfileAccount />,
            },
            {
                path: PROFILE_PATHS.MY_PROFILE_CHILD_INFO,
                key: 'MY_PROFILE_CHILD_INFO',
                exact: true,
                component: () => <ChildInformations />,
            },
        ],
    },
    {
        path: PATHS.TUTOR_MANAGMENT,
        key: 'TUTOR_MANAGMENT',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.SuperAdmin]}>
                <TutorManagment />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE,
        key: 'TUTOR_MANAGMENT_TUTOR_PROFILE',
        exact: true,
        component: () => (
            <PermissionsGate roles={[Role.SuperAdmin]}>
                <TutorManagmentProfile />
            </PermissionsGate>
        ),
    },
];
//handle subroutes by <RenderRoutes {...props} /> inside PermissionGate if needed

export default ROUTES;

function RouteWithSubRoutes(route: any) {
    return (
        <Route key={route.key} path={route.path} exact={route.exact} render={(props: any) => <route.component {...props} routes={route.routes} />} />
    );
}

export function RenderRoutes(routesObj: any) {
    const { routes } = routesObj;
    const { i18n } = useTranslation();
    const history = useHistory();
    const [locationKeys, setLocationKeys] = useState<(string | undefined)[]>([]);

    const syncLanguage = () => {

        if(matchPath(location.pathname, {path: "/:lang"})) {
            const lang = matchPath(location.pathname, {
                path: "/:lang"
            })?.params.lang;

            if(lang !==  i18n.language) {
                i18n.changeLanguage(lang);
                window.location.reload();
            }
        } else {
            history.push(`/${i18n.language}` + location.pathname.split("/").slice(2).join("/"));
        }
    };

    useEffect(() => {
      return history.listen((location: any) => {
        if (history.action === 'PUSH') {
          if (location.key) setLocationKeys([location.key]);
        }
  
        if (history.action === 'POP') {
          if (locationKeys[1] === location.key) {
            setLocationKeys(([_, ...keys]) => keys);
          } else {
            setLocationKeys((keys) => [location.key, ...keys]);
            syncLanguage();
          }
        }
      });
    }, [locationKeys]);

    useEffect(()=>{
        syncLanguage();
    }, []);

    return (
        <Switch>
            {routes.map((route: any) => {
                return <RouteWithSubRoutes key={route.key} {...route} />;
            })}
            <Route component={() => <NotFound />} />
        </Switch>
    );
}

//has to be in this file to prevent app crash when importing
export const menuPerRole: IMenuPerRole = {
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
            name: 'CHAT',
            icon: 'chat',
            key: 'CHAT',
            path: PATHS.CHAT,
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

export function RenderMenuLinks() {
    const userRole = getUserRoleAbrv();

    const chat = useAppSelector((state) => state.chat);

    const { t } = useTranslation();

    if (userRole) {
        return (
            <>
                {menuPerRole[userRole].map((route) => (
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
                        <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
                        <span className={`navbar__item__label`}>{t(`NAVIGATION.${route.name}`)}</span>
                        {route.key == 'CHAT' && chat.newMessages > 0 && <i className={`navbar__item__unread`}></i>}
                    </NavLink>
                ))}
            </>
        );
    }

    return <></>;
}
