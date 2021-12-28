import { Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing';
import RoleSelection from './pages/roleSelection/RoleSelection';

export enum PATHS {
    ROOT = '/',
    ROLE_SELECTION = '/role-selection'
};

const ROUTES: any = [
    {
        path: PATHS.ROOT,
        key: 'ROOT',
        exact: true,
        component: () => <Landing />
    }
    , {
        path: PATHS.ROLE_SELECTION,
        key: 'ROLE_SELECTION',
        exact: true,
        component: () => <RoleSelection />
    }
];

export default ROUTES;

function RouteWithSubRoutes(route: any) {
    return (
        <Route
            key={route.key}
            path={route.path}
            exact={route.exact}
            render={props => <route.component {...props} routes={route.routes} />}
        />
    );
};

export function RenderRoutes(routesObj: any) {
    const { routes } = routesObj;
    return (
        <Switch>
            {routes.map((route: any) => {
                return <RouteWithSubRoutes key={route.key} {...route} />
            })}
        </Switch>
    );
};