import { Route, Switch, Redirect } from 'react-router-dom';
import Landing from './pages/Landing';
import PermissionsGate from './PermissionGate';

export enum PATHS {
    ROOT = '/'
};

const ROUTES: any = [
    {
        path: PATHS.ROOT,
        key: 'ROOT',
        exact: true,
        component: () => <Landing />
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