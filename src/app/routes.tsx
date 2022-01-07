import { NavLink, Route, Switch } from 'react-router-dom';

import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import Register from './features/register/Register';
import ResetPassword from './features/reset-password/ResetPassword';
import RoleSelection from './features/roleSelection/RoleSelection';
import SearchTutors from './features/searchTutors/SearchTutors';
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
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <RoleSelection />,
    },
    {
        path: PATHS.REGISTER,
        key: 'REGISTER',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <Register />,
    },
    {
        path: PATHS.SEARCH_TUTORS,
        key: 'SEARCH_TUTORS',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <SearchTutors />,
    },
    {
        path: PATHS.RESET_PASSWORD,
        key: 'RESET_PASSWORD',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <ResetPassword />,
    },
    {
        path: PATHS.LOGIN,
        key: 'LOGIN',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        isPublic: true,
        component: () => <Login />,
    },
    {
        path: '',
        key: 'BOOKING',
        component: (props: any) => (
            <PermissionsGate
                roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin]}
            >
                <RenderRoutes {...props} />
            </PermissionsGate>
        ),
        routes: [
            {
                key: 'MY_BOOKINGS',
                path: PATHS.MY_BOOKINGS,
                exact: true,
                component: () => <MyBookings />,
            },
        ],
    },
];

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
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
    [Role.Student]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
    [Role.Parent]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
        },
    ],
    [Role.SuperAdmin]: [
        {
            name: 'My Bookings',
            icon: 'calendar',
            key: 'MY_BOOKINGS',
            path: PATHS.MY_BOOKINGS,
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
