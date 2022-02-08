import { useTranslation } from 'react-i18next';
import { NavLink, Route, Switch } from 'react-router-dom';

import CompletedLessons from './features/completedLessons/CompletedLessons';
import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import AdditionalInformation from './features/my-profile/pages/AdditionalInformation';
import GeneralAvailability from './features/my-profile/pages/GeneralAvailability';
import MyTeachings from './features/my-profile/pages/MyTeachings';
import PersonalInformation from './features/my-profile/pages/PersonalInformation';
import ProfileAccount from './features/my-profile/pages/ProfileAccount';
import MyReviews from './features/myReviews/MyReviews';
import Onboarding from './features/onboarding/Onboarding';
import Register from './features/register/Register';
import ResetPassword from './features/reset-password/ResetPassword';
import RoleSelection from './features/roleSelection/RoleSelection';
import SearchTutors from './features/searchTutors/SearchTutors';
import TutorProfile from './features/searchTutors/TutorProfile';
import TutorBookings from './features/tutor-bookings/TutorBookings';
import { Role } from './lookups/role';
import NotFound from './pages/NotFound';
import PermissionsGate from './PermissionGate';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';

export enum PATHS {
    ROLE_SELECTION = '/role-selection',
    REGISTER = '/register',
    RESET_PASSWORD = '/reset-password',
    LOGIN = '/',
    MY_BOOKINGS = '/my-bookings',
    SEARCH_TUTORS = '/search-tutors',
    SEARCH_TUTORS_TUTOR_PROFILE = '/search-tutors/profile/:tutorId',
    SEARCH_TUTORS_TUTOR_BOOKINGS = '/search-tutors/bookings/:tutorId',
    ONBOARDING = '/onboarding',
    MY_REVIEWS = '/my-reviews',
    COMPLETED_LESSONS = '/completed-lessons',
}

export enum PROFILE_PATHS {
    MY_PROFILE = '/my-profile',
    MY_PROFILE_INFO = '/my-profile/info',
    MY_PROFILE_INFO_PERSONAL = '/my-profile/info/personal',
    MY_PROFILE_INFO_AVAILABILITY = '/my-profile/info/availability',
    MY_PROFILE_INFO_TEACHINGS = '/my-profile/info/teachings',
    MY_PROFILE_INFO_ADDITIONAL = '/my-profile/info/additional',
    MY_PROFILE_ACCOUNT = '/my-profile/account',
}

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
        path: PATHS.ONBOARDING,
        key: 'ONBOARDING',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <Onboarding />,
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
            <PermissionsGate
                roles={[
                    Role.Tutor,
                    Role.Parent,
                    Role.Student,
                    Role.SuperAdmin,
                    Role.Child,
                ]}
            >
                <MyBookings />
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
        path: PATHS.SEARCH_TUTORS,
        key: 'SEARCH_TUTORS',
        exact: true,
        component: () => (
            <PermissionsGate
                roles={[Role.Parent, Role.Student, Role.SuperAdmin]}
            >
                <SearchTutors />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.SEARCH_TUTORS_TUTOR_PROFILE,
        key: 'SEARCH_TUTORS_TUTOR_PROFILE',
        exact: true,
        component: () => (
            <PermissionsGate
                roles={[Role.Parent, Role.Student, Role.Tutor, Role.SuperAdmin]}
            >
                <TutorProfile />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS,
        key: 'SEARCH_TUTORS_TUTOR_BOOKINGS',
        exact: true,
        component: () => (
            <PermissionsGate
                roles={[Role.Parent, Role.Student, Role.SuperAdmin]}
            >
                <TutorBookings />
            </PermissionsGate>
        ),
    },
    {
        path: PATHS.COMPLETED_LESSONS,
        key: 'COMPLETED_LESSONS',
        exact: true,
        component: () => (
            <PermissionsGate
                roles={[Role.Parent, Role.Student, Role.SuperAdmin]}
            >
                <CompletedLessons />
            </PermissionsGate>
        ),
    },
    {
        path: PROFILE_PATHS.MY_PROFILE,
        key: 'MY_PROFILE',
        component: (props: any) => {
            return (
                <PermissionsGate roles={[Role.Tutor]}>
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
        ],
    },
];
//handle subroutes by <RenderRoutes {...props} /> inside PermissionGate if needed

export default ROUTES;

function RouteWithSubRoutes(route: any) {
    return (
        <Route
            key={route.key}
            path={route.path}
            exact={route.exact}
            render={(props: any) => (
                <route.component {...props} routes={route.routes} />
            )}
        />
    );
}

export function RenderRoutes(routesObj: any) {
    const { routes } = routesObj;
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
            name: 'MY_BOOKINGS',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
        {
            name: 'MY_REVIEWS',
            icon: 'reviews',
            key: 'MY_REVIEWS',
            path: PATHS.MY_REVIEWS,
        },
        {
            name: 'MY_PROFILE',
            icon: 'profile',
            key: 'MY_PROFILE_INFO_PERSONAL',
            rootPath: PROFILE_PATHS.MY_PROFILE,
            path: PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL,
        },
    ],
    [Role.Student]: [
        {
            name: 'MY_BOOKINGS',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
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
            name: 'MY_BOOKINGS',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
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
            name: 'MY_BOOKINGS',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
        {
            name: 'SEARCH_TUTORS',
            icon: 'search-tutors',
            key: 'SEARCH_TUTORS',
            path: PATHS.SEARCH_TUTORS,
        },
        {
            name: 'MY_PROFILE',
            icon: 'profile',
            key: 'MY_PROFILE_INFO_PERSONAL',
            rootPath: PROFILE_PATHS.MY_PROFILE,
            path: PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL,
        },
        {
            name: 'COMPLETED_LESSONS',
            icon: 'completed-lessons',
            key: 'COMPLETED_LESSONS',
            path: PATHS.COMPLETED_LESSONS,
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
            name: 'COMPLETED_LESSONS',
            icon: 'completed-lessons',
            key: 'COMPLETED_LESSONS',
            path: PATHS.COMPLETED_LESSONS,
        },
    ],
};

export function RenderMenuLinks() {
    const userRole = getUserRoleAbrv();

    const { t } = useTranslation();

    if (userRole) {
        return (
            <>
                {menuPerRole[userRole].map((route) => (
                    <NavLink
                        exact
                        key={route.key}
                        to={route.path}
                        className={`navbar__item`}
                        activeClassName="active"
                        isActive={(match: any, location: Location) => {
                            //format nicer later
                            if (route.rootPath) {
                                if (
                                    location.pathname.startsWith(route.rootPath)
                                ) {
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
                        <i
                            className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}
                        ></i>
                        <span className={`navbar__item__label`}>
                            {t(`NAVIGATION.${route.name}`)}
                        </span>
                    </NavLink>
                ))}
            </>
        );
    }

    return <></>;
}
