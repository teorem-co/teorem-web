import { NavLink, Redirect, Route, Switch } from 'react-router-dom';

import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import Register from './features/register/Register';
import ResetPassword from './features/reset-password/ResetPassword';
import RoleSelection from './features/roleSelection/RoleSelection';
import SearchTutors from './features/searchTutors/SearchTutors';
import { Role } from './lookups/role';
import NotFound from './pages/NotFound';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';
import { isAuthenticated } from './utils/isAuthenticated';

export enum PATHS {
    ROLE_SELECTION = '/role-selection',
    REGISTER = '/register',
    RESET_PASSWORD = '/reset-password',
    LOGIN = '/',
    MY_BOOKINGS = '/my-bookings',
    SEARCH_TUTORS = '/search-tutors',
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
        path: PATHS.MY_BOOKINGS,
        key: 'MY_BOOKINGS',
        exact: true,
        roles: [Role.Tutor],
        isMenu: true,
        icon: 'calendar',
        name: 'My Bookings',
        isPublic: false,
        component: () => <MyBookings />,
    },
];

export default ROUTES;

function RouteWithSubRoutes(route: any) {
    return route.isPublic || isAuthenticated() ? (
        <Route
            key={route.key}
            path={route.path}
            exact={route.exact}
            render={(props: any) => (
                <route.component {...props} routes={route.routes} />
            )}
        />
    ) : (
        <Redirect to="/" />
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

    const menuRoutes = routes.filter((route: any) => {
        const hasPermission = route.roles.some(
            (routeRole: any) => routeRole === getUserRoleAbrv()
        );

        return hasPermission && route.isMenu;
    });

    if (menuRoutes.length > 0) {
        return menuRoutes.map((menuRoute: any) => (
            <NavLink
                exact
                key={menuRoute.key}
                to={menuRoute.path}
                className={`navbar__item`}
                activeClassName="active"
            >
                <i
                    className={`icon icon--base navbar__item__icon navbar__item--${menuRoute.icon}`}
                ></i>
                <span className={`navbar__item__label`}>{menuRoute.name}</span>
            </NavLink>
        ));
    }

    return <></>;
}
