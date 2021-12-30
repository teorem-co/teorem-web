import { Route, Switch } from 'react-router-dom';

//import Landing from './features/Landing';
import Login from './features/login/Login';
import Register from './features/register/Register';
import RoleSelection from './features/roleSelection/RoleSelection';

export enum PATHS {
    ROOT = '/',
    ROLE_SELECTION = '/role-selection',
    REGISTER = '/register',
    LOGIN = '/login',
}

const ROUTES: any = [
    /*{
        path: PATHS.ROOT,
        key: 'ROOT',
        exact: true,
        component: () => <Landing />,
    },*/
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
        path: PATHS.ROOT,
        key: 'LOGIN',
        exact: true,
        component: () => <Login />,
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
        </Switch>
    );
}
