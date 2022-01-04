import { NavLink, Route, Switch } from 'react-router-dom';

import Landing from './features/Landing';
import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import Register from './features/register/Register';
import RoleSelection from './features/roleSelection/RoleSelection';
import { Role } from './lookups/role';
import NotFound from './pages/NotFound';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';

export enum PATHS {
    ROOT = '/',
    ROLE_SELECTION = '/role-selection',
    REGISTER = '/register',
    LOGIN = '/login',
    MY_BOOKINGS = '/my-bookings',
}

//MENU ROUTES
// Profile                 PARENT TUTOR
// My Bookings             PARENT TUTOR
// Chat                    PARENT TUTOR
// Reviews                        TUTOR
// Search Tutors           PARENT
// Completed Lessions      PARENT
// Notifications           PARENT

const ROUTES: any = [
    {
        path: PATHS.ROOT,
        key: 'ROOT',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        component: () => <Landing />,
    },
    {
        path: PATHS.ROLE_SELECTION,
        key: 'ROLE_SELECTION',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        component: () => <RoleSelection />,
    },
    {
        path: PATHS.REGISTER,
        key: 'REGISTER',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        component: () => <Register />,
    },
    {
        path: PATHS.LOGIN,
        key: 'LOGIN',
        exact: true,
        roles: [Role.Tutor],
        isMenu: false,
        component: () => <Login />,
    },
    {
        path: PATHS.MY_BOOKINGS,
        key: 'MY_BOOKINGS',
        exact: true,
        roles: [Role.Tutor],
        isMenu: true,
        icon: 'calendar',
        name: 'My Bookings',
        component: () => <MyBookings />,
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

export function RenderMenuLinks(routesObj: any) {
    const { routes } = routesObj;

    const menuItems = routes.forEach((route: any) => {
        const hasPermission = route.roles.some(
            (routeRole: any) => routeRole === getUserRoleAbrv()
        );

        if (hasPermission && route.isMenu) {
            return (
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
                    <span className={`navbar__item__label`}>{route.name}</span>
                </NavLink>
            );
        }
    });

    return menuItems ? menuItems : <></>;
}
