import { NavLink, Route, Switch } from 'react-router-dom';

import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import MyReviews from './features/myReviews/MyReviews';
import Onboarding from './features/onboarding/Onboarding';
import Register from './features/register/Register';
import ResetPassword from './features/reset-password/ResetPassword';
import RoleSelection from './features/roleSelection/RoleSelection';
import SearchTutors from './features/searchTutors/SearchTutors';
import TutorProfile from './features/searchTutors/TutorProfile';
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
    SEARCH_TUTORS_TUTOR_PROFILE = '/search-tutors/:tutorId',
    ONBOARDING = '/onboarding',
    MY_REVIEWS = '/my-reviews',
}

interface IMenuItem {
    name: string;
    icon: string;
    key: string;
    path: string;
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
                roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin]}
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
                roles={[Role.Parent, Role.Student, Role.SuperAdmin]}
            >
                <TutorProfile />
            </PermissionsGate>
        ),
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
            <Route component={() => <Onboarding />} />
        </Switch>
    );
}

//has to be in this file to prevent app crash when importing
export const menuPerRole: IMenuPerRole = {
    [Role.Tutor]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
        {
            name: 'My Reviews',
            icon: 'reviews',
            key: 'MY_REVIEWS',
            path: PATHS.MY_REVIEWS,
        },
    ],
    [Role.Student]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
        {
            name: 'Search tutors',
            icon: 'search-tutors',
            key: 'SEARCH_TUTORS',
            path: PATHS.SEARCH_TUTORS,
        },
    ],
    [Role.Parent]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
        {
            name: 'Search tutors',
            icon: 'search-tutors',
            key: 'SEARCH_TUTORS',
            path: PATHS.SEARCH_TUTORS,
        },
    ],
    [Role.SuperAdmin]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
        {
            name: 'Search tutors',
            icon: 'search-tutors',
            key: 'SEARCH_TUTORS',
            path: PATHS.SEARCH_TUTORS,
        },
    ],
};

export function RenderMenuLinks() {
    const userRole = getUserRoleAbrv();

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
                    >
                        <i
                            className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}
                        ></i>
                        <span className={`navbar__item__label`}>
                            {route.name}
                        </span>
                    </NavLink>
                ))}
            </>
        );
    }

    return <></>;
}
